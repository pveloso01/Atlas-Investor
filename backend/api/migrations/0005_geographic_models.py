# Generated manually based on geographic models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_add_database_indexes'),
    ]

    operations = [
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(help_text="District code (e.g., '01' for Aveiro)", max_length=10, unique=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('full_path', models.CharField(help_text="Full path for display (e.g., 'Aveiro')", max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['code'],
            },
        ),
        migrations.CreateModel(
            name='AutonomousRegion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(help_text="Region code (e.g., 'AR01' for Açores)", max_length=10, unique=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('full_path', models.CharField(help_text="Full path for display (e.g., 'Açores')", max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['code'],
            },
        ),
        migrations.CreateModel(
            name='Municipality',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(help_text="Municipality code (e.g., 'mun-aveiro-01')", max_length=50, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('full_path', models.CharField(help_text="Full path (e.g., 'Aveiro > Águeda')", max_length=400)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('autonomous_region', models.ForeignKey(blank=True, help_text='Autonomous region if Azores or Madeira', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='municipalities', to='api.autonomousregion')),
                ('district', models.ForeignKey(blank=True, help_text='District if mainland Portugal', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='municipalities', to='api.district')),
            ],
            options={
                'verbose_name_plural': 'Municipalities',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Parish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(help_text="Parish code (e.g., 'par-aveiro-01-01')", max_length=50, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('full_path', models.CharField(help_text="Full path (e.g., 'Aveiro > Águeda > Aguada de Cima')", max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('municipality', models.ForeignKey(help_text='Municipality this parish belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='parishes', to='api.municipality')),
            ],
            options={
                'verbose_name_plural': 'Parishes',
                'ordering': ['name'],
            },
        ),
        migrations.AddIndex(
            model_name='district',
            index=models.Index(fields=['code'], name='api_distric_code_idx'),
        ),
        migrations.AddIndex(
            model_name='district',
            index=models.Index(fields=['name'], name='api_distric_name_idx'),
        ),
        migrations.AddIndex(
            model_name='autonomousregion',
            index=models.Index(fields=['code'], name='api_autonom_code_idx'),
        ),
        migrations.AddIndex(
            model_name='autonomousregion',
            index=models.Index(fields=['name'], name='api_autonom_name_idx'),
        ),
        migrations.AddIndex(
            model_name='municipality',
            index=models.Index(fields=['code'], name='api_municip_code_idx'),
        ),
        migrations.AddIndex(
            model_name='municipality',
            index=models.Index(fields=['name'], name='api_municip_name_idx'),
        ),
        migrations.AddIndex(
            model_name='municipality',
            index=models.Index(fields=['district'], name='api_municip_distric_idx'),
        ),
        migrations.AddIndex(
            model_name='municipality',
            index=models.Index(fields=['autonomous_region'], name='api_municip_autonom_idx'),
        ),
        migrations.AddIndex(
            model_name='parish',
            index=models.Index(fields=['code'], name='api_parish_code_idx'),
        ),
        migrations.AddIndex(
            model_name='parish',
            index=models.Index(fields=['name'], name='api_parish_name_idx'),
        ),
        migrations.AddIndex(
            model_name='parish',
            index=models.Index(fields=['municipality'], name='api_parish_municip_idx'),
        ),
    ]

