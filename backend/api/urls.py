from django.conf.urls import url, include
from rest_framework_nested import routers

from .views import (
    UserViewSet, DiagnosisViewSet, UserDiagnosisViewSet, RegisterView, LoginView,
    XrayViewSet, AudioViewSet, TemperatureViewSet, HealthOfficerViewSet,
    HealthOfficerDiagnosisViewSet
)


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'healthofficers', HealthOfficerViewSet)
router.register(r'diagnoses', DiagnosisViewSet, basename='diagnoses')
router.register(r'xrays', XrayViewSet, basename='xrays')
router.register(r'audios', AudioViewSet, basename='audios')
router.register(r'temperatures', TemperatureViewSet, basename='temperatures')

users_router = routers.NestedSimpleRouter(router, r'users', lookup='user')
users_router.register(r'diagnoses', UserDiagnosisViewSet, basename='users-diagnoses')

healthofficers_router = routers.NestedSimpleRouter(router, r'healthofficers', lookup='healthofficer')
healthofficers_router.register(r'diagnoses', HealthOfficerDiagnosisViewSet, basename='healthofficers-diagnoses')

urlpatterns = [
    url(r'login', LoginView.as_view()),
    url(r'register', RegisterView.as_view()),
    url(r'^', include(router.urls)),
    url(r'^', include(users_router.urls)),
    url(r'^', include(healthofficers_router.urls)),
]
