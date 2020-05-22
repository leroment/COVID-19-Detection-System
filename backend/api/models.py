from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# User from django.contrib.auth.models

class Diagnosis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

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
