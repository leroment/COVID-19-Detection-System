from django.contrib.auth.models import User
from rest_framework import serializers

class UserValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'email', 'is_staff', 'first_name', 'last_name']

