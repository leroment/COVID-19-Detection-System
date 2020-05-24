from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer, UserValidationSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Create your views here.


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
