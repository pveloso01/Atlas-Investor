"""
Management command to seed default subscription tiers and features.
"""

from django.core.management.base import BaseCommand
from subscriptions.models import SubscriptionTier, Feature
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed default subscription tiers and features'

    def handle(self, *args, **options):
        self.stdout.write('Seeding subscription tiers and features...')

        # Create tiers
        tiers_data = [
            {
                'name': 'Free',
                'slug': 'free',
                'price_monthly': Decimal('0.00'),
                'price_yearly': Decimal('0.00'),
                'features': {
                    'features': [
                        'Limited property searches (10/month)',
                        'Basic ROI calculator',
                        'View-only access to reports',
                        'Community support',
                        'Portfolio tracking (1 property)',
                    ]
                },
                'display_order': 0,
            },
            {
                'name': 'Basic',
                'slug': 'basic',
                'price_monthly': Decimal('19.00'),
                'price_yearly': Decimal('190.00'),
                'features': {
                    'features': [
                        'Unlimited property searches',
                        'Full ROI calculator',
                        'PDF report generation (5/month)',
                        'Email support',
                        'Portfolio tracking (up to 5 properties)',
                        'Basic analytics',
                    ]
                },
                'display_order': 1,
            },
            {
                'name': 'Pro',
                'slug': 'pro',
                'price_monthly': Decimal('49.00'),
                'price_yearly': Decimal('490.00'),
                'features': {
                    'features': [
                        'Everything in Basic',
                        'Unlimited PDF reports',
                        'Advanced analytics and insights',
                        'Portfolio tracking (unlimited)',
                        'Priority support',
                        'API access',
                        'Export data (CSV/Excel)',
                        'Custom report templates',
                    ]
                },
                'display_order': 2,
            },
            {
                'name': 'Enterprise',
                'slug': 'enterprise',
                'price_monthly': Decimal('0.00'),  # Custom pricing
                'price_yearly': Decimal('0.00'),
                'features': {
                    'features': [
                        'Everything in Pro',
                        'White-label options',
                        'Custom integrations',
                        'Dedicated support',
                        'Custom feature requests',
                        'SLA guarantees',
                        'Team collaboration features',
                    ]
                },
                'display_order': 3,
            },
        ]

        for tier_data in tiers_data:
            tier, created = SubscriptionTier.objects.get_or_create(
                slug=tier_data['slug'],
                defaults=tier_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created tier: {tier.name}'))
            else:
                self.stdout.write(f'Tier already exists: {tier.name}')

        # Create features
        free_tier = SubscriptionTier.objects.get(slug='free')
        basic_tier = SubscriptionTier.objects.get(slug='basic')
        pro_tier = SubscriptionTier.objects.get(slug='pro')

        features_data = [
            {
                'name': 'Property Search',
                'slug': 'property_search',
                'description': 'Search and filter properties',
                'required_tier': free_tier,
                'is_usage_based': True,
                'usage_limit': 10,  # Free tier limit
            },
            {
                'name': 'PDF Reports',
                'slug': 'pdf_reports',
                'description': 'Generate PDF property reports',
                'required_tier': basic_tier,
                'is_usage_based': True,
                'usage_limit': 5,  # Basic tier limit, unlimited for Pro+
            },
            {
                'name': 'Advanced Analytics',
                'slug': 'advanced_analytics',
                'description': 'Advanced investment analytics and insights',
                'required_tier': pro_tier,
                'is_usage_based': False,
            },
            {
                'name': 'API Access',
                'slug': 'api_access',
                'description': 'Access to REST API',
                'required_tier': pro_tier,
                'is_usage_based': False,
            },
            {
                'name': 'Data Export',
                'slug': 'data_export',
                'description': 'Export data to CSV/Excel',
                'required_tier': pro_tier,
                'is_usage_based': False,
            },
        ]

        for feature_data in features_data:
            feature, created = Feature.objects.get_or_create(
                slug=feature_data['slug'],
                defaults=feature_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created feature: {feature.name}'))
            else:
                self.stdout.write(f'Feature already exists: {feature.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded subscription tiers and features!'))

