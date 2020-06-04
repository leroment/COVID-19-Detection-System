from django.contrib import admin
from .models import Diagnosis, XrayImage, AudioRecording, TemperatureReading, DiagnosisResult

# Register your models here.

@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    pass

@admin.register(XrayImage)
class XrayAdmin(admin.ModelAdmin):
    pass

@admin.register(AudioRecording)
class AudioAdmin(admin.ModelAdmin):
    pass

@admin.register(TemperatureReading)
class TemperatureAdmin(admin.ModelAdmin):
    pass

@admin.register(DiagnosisResult)
class DiagnosisResultAdmin(admin.ModelAdmin):
    pass
