from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Diagnosis, XrayImage, AudioRecording, TemperatureReading

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


class DiagnosisSerializer(serializers.ModelSerializer):
    temperaturereadings = TemperatureSerializer(many=True, source='temperaturereading_set', read_only=True)
    audiorecordings = AudioSerializer(many=True, source='audiorecording_set', read_only=True)
    xrayimages = XraySerializer(many=True, source='xrayimage_set', read_only=True)

    class Meta:
        model = Diagnosis
        fields = [
            'id',
            'user',
            'temperaturereadings',
            'audiorecordings',
            'xrayimages',
        ]
