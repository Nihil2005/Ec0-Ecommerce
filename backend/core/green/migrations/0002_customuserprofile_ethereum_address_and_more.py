# Generated by Django 5.0.2 on 2024-03-21 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('green', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuserprofile',
            name='ethereum_address',
            field=models.CharField(blank=True, max_length=42, null=True, verbose_name='Ethereum Address'),
        ),
        migrations.AddField(
            model_name='product',
            name='smart_contract_address',
            field=models.CharField(blank=True, max_length=42, null=True, verbose_name='Smart Contract Address'),
        ),
    ]
