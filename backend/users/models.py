from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model extending Django's AbstractUser."""
    email = models.EmailField(unique=True, blank=False, null=False)
    
    # Additional fields can be added here in the future
    # phone_number = models.CharField(max_length=20, blank=True)
    # profile_picture = models.ImageField(upload_to='profiles/', blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
    
    def __str__(self):
        return self.email
