# Generated by Django 5.1 on 2024-08-29 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_examen_rename_nombre_sala_edificio_sala_codigo_sala_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sala',
            name='codigo_sala',
            field=models.CharField(default='Sala Desconocida', max_length=20),
            preserve_default=False,
        ),
    ]
