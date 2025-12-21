# Generated manually - Add geographic fields to Property model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_geographic_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='district',
            field=models.ForeignKey(
                blank=True,
                help_text='District where property is located',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='properties',
                to='api.district'
            ),
        ),
        migrations.AddField(
            model_name='property',
            name='municipality',
            field=models.ForeignKey(
                blank=True,
                help_text='Municipality where property is located',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='properties',
                to='api.municipality'
            ),
        ),
        migrations.AddField(
            model_name='property',
            name='parish',
            field=models.ForeignKey(
                blank=True,
                help_text='Parish where property is located',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='properties',
                to='api.parish'
            ),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['district'], name='api_propert_distric_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['municipality'], name='api_propert_municip_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['parish'], name='api_propert_parish_idx'),
        ),
    ]

