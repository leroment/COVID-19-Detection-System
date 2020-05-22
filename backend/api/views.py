from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
import json

from .serializers import UserSerializer, UserValidationSerializer, DiagnosisSerializer, UserDiagnosisSerializer
from .models import Diagnosis, TemperatureReading, AudioRecording, XrayImage

import logging

logger = logging.getLogger(__name__)


class UserOnly(BasePermission):
    message = 'Invalid user'

    def has_permission(self, request, view):
        user_id = int(request.resolver_match.kwargs['user_pk'])
        return request.user.id == user_id


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
        data = json.loads(request.data.get('data'))
        audio_data = request.FILES['audio']
        xray_data = request.FILES.get('xray')
        user_id = int(self.kwargs['user_pk'])

        diagnosis = Diagnosis.objects.create(
            user_id=user_id,
        )
        temperature = TemperatureReading.objects.create(
            diagnosis=diagnosis,
            reading=data['temperature'],
        )
        audio = AudioRecording.objects.create(
            diagnosis=diagnosis,
            file=audio_data.read(),
        )
        if xray_data:
            xray = XrayImage.objects.create(
                diagnosis=diagnosis,
                file=xray_data.read(),
            )

        response_data = {
            'id': diagnosis.id,
            'temperature_id': temperature.id,
            'audio_id': audio.id,
        }

        if xray:
            response_data['xray_id'] = xray.id

        # TODO errors
        # TODO validation
        return Response(response_data, status=status.HTTP_201_CREATED)


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
