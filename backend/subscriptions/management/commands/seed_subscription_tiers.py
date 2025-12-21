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

        # Create tiers with improved pricing and features
        tiers_data = [
            {
                'name': 'Free',
                'slug': 'free',
                'price_monthly': Decimal('0.00'),
                'price_yearly': Decimal('0.00'),
                'features': {
                    'features': [
                        '5 property searches per month',
                        'Basic ROI calculator',
                        'View-only PDF reports',
                        'Portfolio tracking (1 property)',
                        'Community support',
                        'Basic property details',
                    ]
                },
                'display_order': 0,
            },
            {
                'name': 'Basic',
                'slug': 'basic',
                'price_monthly': Decimal('39.00'),
                'price_yearly': Decimal('374.40'),  # 20% discount
                'features': {
                    'features': [
                        '50 property searches per month',
                        'Advanced ROI calculator',
                        '3 PDF reports per month',
                        'Portfolio tracking (10 properties)',
                        'Property comparison (2 properties)',
                        'Email support (48h response)',
                        'Basic portfolio analytics',
                        '3 months historical data',
                    ]
                },
                'display_order': 1,
            },
            {
                'name': 'Pro',
                'slug': 'pro',
                'price_monthly': Decimal('99.00'),
                'price_yearly': Decimal('950.40'),  # 20% discount
                'features': {
                    'features': [
                        'Unlimited property searches',
                        'Unlimited PDF reports',
                        'Unlimited portfolio tracking',
                        'Automated deal alerts',
                        'Bulk property analysis (up to 50)',
                        'Advanced analytics & insights',
                        'Property valuation estimates',
                        'Investment recommendations',
                        'Tax optimization insights',
                        'Priority support (24h response)',
                        'API access (read-only)',
                        '2 years historical data',
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
                        'Unlimited bulk analysis',
                        'White-label reports',
                        'Custom integrations',
                        'Dedicated account manager',
                        'Phone & email support (4h response)',
                        'Full API access',
                        'Unlimited historical data',
                        'Team collaboration features',
                        'SLA guarantees',
                        'Custom feature development',
                        'Onboarding assistance',
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
                'usage_limit': 5,  # Free tier: 5/month
            },
            {
                'name': 'PDF Reports',
                'slug': 'pdf_reports',
                'description': 'Generate PDF property reports',
                'required_tier': basic_tier,
                'is_usage_based': True,
                'usage_limit': 3,  # Basic tier: 3/month, unlimited for Pro+
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
                'required_tier': basic_tier,
                'is_usage_based': False,
            },
            {
                'name': 'Automated Deal Alerts',
                'slug': 'deal_alerts',
                'description': 'Automated email alerts for matching properties',
                'required_tier': pro_tier,
                'is_usage_based': False,
            },
            {
                'name': 'Bulk Analysis',
                'slug': 'bulk_analysis',
                'description': 'Analyze multiple properties at once',
                'required_tier': pro_tier,
                'is_usage_based': True,
                'usage_limit': 50,  # Pro tier: 50 at a time, unlimited for Enterprise
            },
            {
                'name': 'Property Comparison',
                'slug': 'property_comparison',
                'description': 'Compare multiple properties side-by-side',
                'required_tier': basic_tier,
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

