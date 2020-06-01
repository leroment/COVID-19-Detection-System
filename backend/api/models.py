from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# User from django.contrib.auth.models

class DiagnosisStatus(models.TextChoices):
    WAITING = 'WA', "WAITING"
    PROCESSING = 'PR', "PROCESSING"
    AWAITING_REVIEW = 'AR', "AWAITING_REVIEW"
    REVIEWED = 'RE', "REVIEWED"


class Diagnosis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_diagnoses')
    status = models.CharField(
        max_length=2,
        choices=DiagnosisStatus.choices
    )
    health_officer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='health_officer_diagnoses')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Diagnoses"

class TemperatureReading(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    reading = models.FloatField()

class AudioRecording(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    file = models.BinaryField()

class XrayImage(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    file = models.BinaryField()
