# Generated by Django 3.0.5 on 2020-05-25 05:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Diagnosis',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Diagnoses',
            },
        ),
        migrations.CreateModel(
            name='XrayImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.BinaryField()),
                ('diagnosis', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Diagnosis')),
            ],
        ),
        migrations.CreateModel(
            name='TemperatureReading',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reading', models.FloatField()),
                ('diagnosis', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Diagnosis')),
            ],
        ),
        migrations.CreateModel(
            name='AudioRecording',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.BinaryField()),
                ('diagnosis', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Diagnosis')),
            ],
        ),
    ]
