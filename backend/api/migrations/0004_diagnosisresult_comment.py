# Generated by Django 3.0.5 on 2020-06-05 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200601_1549'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosisresult',
            name='comment',
            field=models.CharField(max_length=2048, null=True),
        ),
    ]
