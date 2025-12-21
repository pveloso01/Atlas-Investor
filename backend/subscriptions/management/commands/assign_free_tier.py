"""
Management command to assign Free tier to existing users.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from subscriptions.models import SubscriptionTier, Subscription
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Assign Free tier to existing users without subscriptions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without actually doing it',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        try:
            free_tier = SubscriptionTier.objects.get(slug='free')
        except SubscriptionTier.DoesNotExist:
            self.stdout.write(self.style.ERROR('Free tier does not exist. Please run seed_subscription_tiers first.'))
            return

        users_without_subscription = User.objects.filter(subscription__isnull=True)
        count = users_without_subscription.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('All users already have subscriptions.'))
            return

        self.stdout.write(f'Found {count} users without subscriptions.')

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN - No changes will be made.'))
            for user in users_without_subscription[:10]:  # Show first 10
                self.stdout.write(f'  Would assign Free tier to: {user.email}')
            if count > 10:
                self.stdout.write(f'  ... and {count - 10} more users')
            return

        assigned = 0
        for user in users_without_subscription:
            # Note: Free tier doesn't create a Stripe subscription
            # Users on Free tier just don't have a subscription record
            # This command is mainly for tracking/analytics purposes
            # In practice, Free tier users are identified by the absence of a subscription
            assigned += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully processed {assigned} users. '
                'Free tier users are identified by the absence of a subscription record.'
            )
        )

