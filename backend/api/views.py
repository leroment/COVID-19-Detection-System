from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.db.models import Count, Q
import json
import magic
import subprocess
import sys
import os

from .serializers import UserSerializer, UserValidationSerializer, DiagnosisSerializer, XraySerializer, AudioSerializer, TemperatureSerializer
from .models import Diagnosis, TemperatureReading, AudioRecording, XrayImage, DiagnosisStatus, DiagnosisResult

import logging

logger = logging.getLogger(__name__)


class UserOnly(BasePermission):
    message = 'Invalid user'

    def has_permission(self, request, view):
        user_id = int(request.resolver_match.kwargs['user_pk'])
        return request.user.id == user_id


class HealthOfficerOnly(BasePermission):
    message = 'Not a health officer'

    def has_permission(self, request, view):
        healthofficer_id = int(request.resolver_match.kwargs['healthofficer_pk'])
        return request.user.is_staff and request.user.id == healthofficer_id


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class DiagnosisViewSet(viewsets.ModelViewSet):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer


class UserDiagnosisViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, UserOnly)
    serializer_class = DiagnosisSerializer

    def get_queryset(self):
        user_id = int(self.kwargs['user_pk'])
        return Diagnosis.objects.filter(user=user_id)

    def create(self, request, *args, **kwargs):
        validation_errors = {}

        data = None
        try:
            data = json.loads(request.data.get('data'))
        except TypeError:
            validation_errors['data'] = 'Must be JSON'

        audio_file = request.FILES.get('audio')
        xray_file = request.FILES.get('xray')
        user_id = int(self.kwargs['user_pk'])

        audio_data = None
        xray_data = None

        # Check audio is WAV
        if audio_file:
            audio_data = audio_file.read()
            audio_mime = magic.from_buffer(audio_data, mime=True)
            if audio_mime not in ['audio/x-wav', 'audio/wav']:
                validation_errors['audio'] = 'Audio must be in WAV format'
        else:
            validation_errors['audio'] = 'Audio required'

        # Check xray is PNG
        if xray_file:
            xray_data = xray_file.read()
            xray_mime = magic.from_buffer(xray_data, mime=True)
            if xray_mime != 'image/png':
                validation_errors['xray'] = 'Xray must be a PNG image'

        if not data or 'temperature' not in data:
            validation_errors['temperature'] = 'Temperature required'
        elif type(data['temperature']) not in [int, float]:
            validation_errors['temperature'] = 'Temperature must be a number'

        if validation_errors:
            raise ValidationError(validation_errors)

        # Run Analysis Scripts
        covid_outcome = False
        temp_outcome = False

        # run xray and sound detection
        xray_out = subprocess.check_output(['python', 'api/scripts/xray-analysis/covid19_recognise_new.py', xray_file.temporary_file_path()])
        soundfile_out = subprocess.check_output(['python', 'api/scripts/cough-detection/coughdetect_new.py', audio_file.temporary_file_path()])

        # # outcome converted to string (Positive/Negative) xray comes with probability percentage
        xray_string = xray_out.decode()
        cough_string = soundfile_out.decode()

        xray_string = xray_string.rstrip('\n')

        confidence_value = float(xray_string)

        # -1 is negative
        cough_outcome = cough_string.find("Positive")

        # Temperature Analysis
        if (data['temperature'] >= 38):
            temp_outcome = True

        #COVID determination
        if (confidence_value >= 80):
            covid_outcome = True

        elif ((cough_outcome != -1 or temp_outcome) and confidence_value >= 70):
            covid_outcome = True

        elif (cough_outcome and temp_outcome and confidence_value >= 60):
            covid_outcome = True

        # Get health officer with the least cases waiting to be reviewed
        health_officer = (
            User.objects
            .filter(is_staff=True)
            .annotate(diagnosis_count=Count('health_officer_diagnoses', filter=~Q(health_officer_diagnoses__status=DiagnosisStatus.REVIEWED)))  # include waiting, processing and awaiting review diagnoses
            .order_by('diagnosis_count')
            .first()
        )

        # Create items in database
        diagnosis = Diagnosis.objects.create(
            user_id=user_id,
            status=DiagnosisStatus.AWAITING_REVIEW,
            health_officer=health_officer,
        )
        temperature = TemperatureReading.objects.create(
            diagnosis=diagnosis,
            reading=data['temperature'],
        )
        audio = AudioRecording.objects.create(
            diagnosis=diagnosis,
            file=audio_data,
        )
        if xray_data:
            xray = XrayImage.objects.create(
                diagnosis=diagnosis,
                file=xray_data,
            )

        diagnosisresult = DiagnosisResult.objects.create(
            diagnosis=diagnosis,
            approved=False,
            confidence=float(xray_string),
            has_covid=covid_outcome,
            creation_date=True,
            last_update=True
        )

        response_data = {
            'id': diagnosis.id,
            'temperature_id': temperature.id,
            'audio_id': audio.id,
            'diagnosis_id': diagnosisresult.id
        }

        if xray_data:
            response_data['xray_id'] = xray.id

        return Response(response_data, status=status.HTTP_201_CREATED)


class HealthOfficerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer


class HealthOfficerDiagnosisViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (IsAuthenticated, HealthOfficerOnly)
    serializer_class = DiagnosisSerializer

    def get_queryset(self):
        status_filter = self.request.query_params.get('status', None)

        user_id = int(self.kwargs['healthofficer_pk'])
        qs = Diagnosis.objects.filter(health_officer=user_id)
        try:
            if status_filter:
                qs = qs.filter(status=DiagnosisStatus[status_filter])
        except KeyError:
            raise ValidationError({'status': status_filter + ' is not a valid status'})
        return qs

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != DiagnosisStatus.AWAITING_REVIEW:
            raise ValidationError('Diagnosis not awaiting review')

        validation_errors = {}

        approved = request.data.get('approved')
        comment = request.data.get('comment')

        if approved is None:
            validation_errors['approved'] = 'Required'
        if type(approved) != bool:
            validation_errors['approved'] = 'Must be a boolean'

        if comment is not None:
            if type(comment) != str:
                validation_errors['comment'] = 'Must be a string'

        if validation_errors:
            raise ValidationError(validation_errors)

        if approved:
            instance.status = DiagnosisStatus.REVIEWED
        else:
            instance.status = DiagnosisStatus.NEEDS_DATA
        instance.save()

        latest_result = DiagnosisResult.objects.filter(diagnosis=instance).order_by('last_update').last()
        latest_result.approved = True
        if comment:
            latest_result.comment = comment
        latest_result.save()

        return Response(self.serializer_class(instance).data)



class XrayViewSet(viewsets.ReadOnlyModelViewSet):
    # TODO restrict to only specific User and Health Officers
    queryset = XrayImage.objects.all()
    serializer_class = XraySerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return HttpResponse(instance.file, content_type='image/png')


class AudioViewSet(viewsets.ReadOnlyModelViewSet):
    # TODO restrict to only specific User and Health Officers
    queryset = AudioRecording.objects.all()
    serializer_class = AudioSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return HttpResponse(instance.file, content_type='audio/wav')


class TemperatureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TemperatureReading.objects.all()
    serializer_class = TemperatureSerializer


class LoginView(APIView):
    def post(self, request):
        user = authenticate(username=request.data.get('email'), password=request.data.get('password'))
        if user is not None:
            (token, created) = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user, context={'request': request}).data,
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    def post(self, request):
        serialized = UserValidationSerializer(data={
            'email': request.data.get('email'),
            'username': request.data.get('email'),
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'password': request.data.get('password'),
        }, context={'request': request})
        if serialized.is_valid():
            user = User.objects.create_user(
                email=serialized.validated_data['email'],
                username=serialized.validated_data['username'],
                password=serialized.validated_data['password'],
                first_name=serialized.validated_data['first_name'],
                last_name=serialized.validated_data['last_name'],
            )
            return Response(UserSerializer(user, context={'request': request}).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)
