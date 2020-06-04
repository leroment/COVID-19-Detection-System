from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Diagnosis, XrayImage, AudioRecording, TemperatureReading,
    DiagnosisStatus, DiagnosisResult
)

import logging

logger = logging.getLogger(__name__)

class UserValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_staff', 'first_name', 'last_name']


class TemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperatureReading
        fields = ['id', 'reading']

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioRecording
        fields = ['id']

class XraySerializer(serializers.ModelSerializer):
    class Meta:
        model = XrayImage
        fields = ['id']


class CutDownHealthOfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class DiagnosisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosisResult
        fields = [
            'diagnosis',
            'approved',
            'confidence',
            'has_covid',
            'creation_date',
            'last_update',
        ]


class DiagnosisSerializer(serializers.ModelSerializer):
    temperaturereadings = TemperatureSerializer(many=True, source='temperaturereading_set', read_only=True)
    audiorecordings = AudioSerializer(many=True, source='audiorecording_set', read_only=True)
    xrayimages = XraySerializer(many=True, source='xrayimage_set', read_only=True)

    health_officer = CutDownHealthOfficerSerializer()
    status = serializers.SerializerMethodField('get_status_label')
    result = serializers.SerializerMethodField('get_result')

    def get_status_label(self, obj):
        return DiagnosisStatus(obj.status).label

    def get_result(self, obj):
        latest_result = DiagnosisResult.objects.filter(diagnosis=obj).order_by('last_update').last()
        if latest_result:
            return DiagnosisResultSerializer(latest_result).data
        else:
            return None

    class Meta:
        model = Diagnosis
        fields = [
            'id',
            'status',
            'user',
            'health_officer',
            'creation_date',
            'last_update',
            'temperaturereadings',
            'audiorecordings',
            'xrayimages',
            'result',
        ]
