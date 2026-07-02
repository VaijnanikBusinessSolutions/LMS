import datetime
from django.db import models
import os
from django.utils.translation import gettext_lazy as _

# Create your models here.
import re
import pandas as pd
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Permission
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .rbac import RBAC_ACTIONS, RBAC_MODULES, build_permission_codename, normalize_action, normalize_module_slug, permission_label, inherited_parent_modules
from django.core.validators import RegexValidator
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken


# ------------------ Role Model ------------------




# ------------------ Management Commands Helper ------------------
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken


# ------------------ Role Model ------------------

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

# ------------------ Role Model ------------------
class Role(models.Model):
    # We use the specific strings from the LMS project
    ADMIN = 'admin'
    TEAM_LEADER = 'team-leader'
    EMPLOYEE = 'employee'
    name = models.CharField(max_length=50, unique=True)
    permissions = models.ManyToManyField(Permission, blank=True, related_name='rbac_roles')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.name

    @property
    def normalized_name(self):
        return (self.name or "").strip().lower()

    def has_permission(self, module_slug, action='view'):
        if not self.is_active or not module_slug:
            return False
        if self.normalized_name == normalize_module_slug(self.ADMIN):
            return True
        codename = build_permission_codename(module_slug, action)
        return self.permissions.filter(codename=codename).exists()


class PermissionModule(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Permission Module'
        verbose_name_plural = 'Permission Modules'

    def __str__(self):
        return self.name

    @classmethod
    def normalize_action(cls, action):
        return normalize_action(action)

    @classmethod
    def sync_default_modules(cls):
        modules = []
        for index, (slug, config) in enumerate(RBAC_MODULES.items(), start=1):
            module, created = cls.objects.get_or_create(
                slug=slug.replace('_', '-'),
                defaults={
                    'name': config['name'],
                    'description': config['description'],
                    'sort_order': index,
                },
            )
            if not created:
                updates = []
                if module.name != config['name']:
                    module.name = config['name']
                    updates.append('name')
                if module.description != config['description']:
                    module.description = config['description']
                    updates.append('description')
                if module.sort_order != index:
                    module.sort_order = index
                    updates.append('sort_order')
                if updates:
                    module.save(update_fields=updates)
            modules.append(module)
        cls.objects.exclude(slug__in=[slug.replace('_', '-') for slug in RBAC_MODULES.keys()]).filter(is_active=True).update(is_active=False)
        return modules


def sync_rbac_permissions():
    PermissionModule.sync_default_modules()

    content_type = ContentType.objects.get_for_model(PermissionModule)

    for module_slug in RBAC_MODULES.keys():
        normalized_slug = normalize_module_slug(module_slug)
        for action in RBAC_ACTIONS.keys():
            codename = build_permission_codename(normalized_slug, action)
            permission, created = Permission.objects.get_or_create(
                content_type=content_type,
                codename=codename,
                defaults={'name': permission_label(normalized_slug, action)},
            )
            if not created and permission.name != permission_label(normalized_slug, action):
                permission.name = permission_label(normalized_slug, action)
                permission.save(update_fields=['name'])


class RoleModulePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='module_permissions')
    module = models.ForeignKey(PermissionModule, on_delete=models.CASCADE, related_name='role_permissions')
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    can_approve = models.BooleanField(default=False)
    can_export = models.BooleanField(default=False)
    can_manage = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['module__sort_order', 'module__name']
        unique_together = ('role', 'module')
        verbose_name = 'Role Module Permission'
        verbose_name_plural = 'Role Module Permissions'

    def __str__(self):
        return f'{self.role.name} -> {self.module.slug}'

    def allowed_actions(self):
        return {
            'view': self.can_view,
            'create': self.can_create,
            'update': self.can_update,
            'delete': self.can_delete,
            'approve': self.can_approve,
            'export': self.can_export,
            'manage': self.can_manage,
        }


# ------------------ Custom User Manager ------------------
class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        
        email = self.normalize_email(email)
        
        # User creation must specify a role explicitly.
        if 'role' not in extra_fields:
            raise ValueError(_('Role is required'))

        user = self.model(email=email, **extra_fields)
        
        if password:
            user.set_password(password)
        else:
            raise ValueError(_('Password is required'))
            
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        # Default dummy values for Dojo specific fields
        extra_fields.setdefault('first_name', 'Admin')
        extra_fields.setdefault('last_name', 'User')
        extra_fields.setdefault('employeeid', 'ADMIN001') 

        if 'role' not in extra_fields:
            raise ValueError(_('Superuser role is required. Create/select the admin role from Role Management first.'))

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


# ------------------ Custom User Model ------------------
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    employeeid = models.CharField(max_length=10, unique=True)
    
    # Dojo uses snake_case, LMS used camelCase. Sticking to snake_case (Django Standard)
    first_name = models.CharField(max_length=100) # Increased length to match LMS
    last_name = models.CharField(max_length=100, blank=True, null=True)
    
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='users')
    designation = models.CharField(max_length=100, blank=True, null=True)
    business_unit = models.CharField(max_length=100, blank=True, null=True)
    section = models.CharField(max_length=100, blank=True, null=True) 


    # Dojo Specific Fields
    hq = models.CharField(max_length=50, blank=True, null=True)
    factory = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=50, blank=True, null=True)
    line = models.CharField(max_length=50, blank=True, null=True)
    subline = models.CharField(max_length=50, blank=True, null=True)

    # Fields imported from LMS requirements (added to Dojo model)
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True) # Renamed to snake_case
    profile_image = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    
    status = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['employeeid', 'first_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    @property
    def role_name(self):
        """Returns the string name of the role"""
        return self.role.name if self.role else None

    @property
    def normalized_role_name(self):
        return normalize_module_slug(self.role_name)

    # --- Helper properties to match LMS logic style ---
    @property
    def is_admin_role(self):
        return self.normalized_role_name == normalize_module_slug(Role.ADMIN)

    @property
    def is_team_leader(self):
        return self.normalized_role_name == normalize_module_slug(Role.TEAM_LEADER)

    @property
    def is_employee(self):
        return self.normalized_role_name == normalize_module_slug(Role.EMPLOYEE)

    def has_module_permission(self, module_slug, action='view'):
        if not self.is_authenticated or not self.is_active:
            return False
        if self.is_superuser:
            return True
        if not self.role_id or not self.role or not self.role.is_active:
            return False
        normalized_slug = normalize_module_slug(module_slug)
        if self.role.has_permission(normalized_slug, action):
            return True

        return any(
            self.role.has_permission(parent_slug, action)
            for parent_slug in inherited_parent_modules(normalized_slug)
        )

    def has_any_module_permission(self, module_slug, actions):
        return any(self.has_module_permission(module_slug, action) for action in actions)

    def get_lms_user_type(self):
        if self.has_module_permission('admin_dashboard', 'view'):
            return Role.ADMIN
        if self.has_module_permission('team_leader_dashboard', 'view'):
            return Role.TEAM_LEADER
        return Role.EMPLOYEE

    def get_accessible_modules(self):
        if not self.role_id or not self.role:
            return {}
        if self.role.normalized_name == normalize_module_slug(Role.ADMIN):
            return {
                module_slug: {
                    'name': config['name'],
                    **{action: True for action in RBAC_ACTIONS.keys()},
                }
                for module_slug, config in RBAC_MODULES.items()
            }
        modules = {
            module_slug: {
                'name': config['name'],
                **{action: False for action in RBAC_ACTIONS.keys()},
            }
            for module_slug, config in RBAC_MODULES.items()
        }
        for permission in self.role.permissions.all():
            for module_slug in RBAC_MODULES.keys():
                normalized_slug = normalize_module_slug(module_slug)
                for action in RBAC_ACTIONS.keys():
                    if permission.codename == build_permission_codename(normalized_slug, action):
                        modules[normalized_slug][action] = True

        for module_slug in RBAC_MODULES.keys():
            normalized_slug = normalize_module_slug(module_slug)
            parent_slugs = inherited_parent_modules(normalized_slug)
            if not parent_slugs:
                continue

            for action in RBAC_ACTIONS.keys():
                if any(modules[parent_slug][action] for parent_slug in parent_slugs if parent_slug in modules):
                    modules[normalized_slug][action] = True
        return modules

from django.db import models
# ------------------ HQ ------------------
class Hq(models.Model):
    hq_id = models.AutoField(primary_key=True)
    hq_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.hq_name

    class Meta:
        db_table = 'hq'


# ------------------ Factory ------------------
class Factory(models.Model):
    factory_id = models.AutoField(primary_key=True)
    factory_name = models.CharField(max_length=100)
    hq = models.ForeignKey(Hq, on_delete=models.CASCADE, related_name='factories', null=True, blank=True)

    def __str__(self):
        return f"{self.factory_name} ({self.hq.hq_name if self.hq else 'No HQ'})"

    class Meta:
        db_table = 'factory'
        unique_together = ('factory_name', 'hq')


# ------------------ Department ------------------
class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=100)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='departments', null=True, blank=True)
    hq = models.ForeignKey(Hq, on_delete=models.CASCADE, related_name='departments', null=True, blank=True)


    def __str__(self):
        if self.factory:
            return f"{self.department_name} ({self.factory.factory_name})"
        elif self.hq:
            return f"{self.department_name} ({self.hq.hq_name})"
        return self.department_name

    class Meta:
        db_table = 'department'

# ------------------ Line ------------------
class Line(models.Model):
    line_id = models.AutoField(primary_key=True)
    line_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='lines', null=True, blank=True)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='lines', null=True, blank=True)
    hq = models.ForeignKey(Hq, on_delete=models.CASCADE, related_name='lines', null=True, blank=True)


    def __str__(self):
        if self.department:
            return f"{self.line_name} ({self.department.department_name})"
        elif self.factory:
            return f"{self.line_name} ({self.factory.factory_name})"
        elif self.hq:
            return f"{self.line_name} ({self.hq.hq_name})"
        return self.line_name

    class Meta:
        db_table = 'line'


# ------------------ SubLine ------------------
class SubLine(models.Model):
    subline_id = models.AutoField(primary_key=True)
    subline_name = models.CharField(max_length=100)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name='sublines', null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='sublines', null=True, blank=True)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='sublines', null=True, blank=True)
    hq = models.ForeignKey(Hq, on_delete=models.CASCADE, related_name='sublines', null=True, blank=True)

    def __str__(self):
        if self.line:
            return f"{self.subline_name} ({self.line.line_name})"
        elif self.department:
            return f"{self.subline_name} ({self.department.department_name})"
        elif self.factory:
            return f"{self.subline_name} ({self.factory.factory_name})"
        elif self.hq:
            return f"{self.subline_name} ({self.hq.hq_name})"
        return self.subline_name

    class Meta:
        db_table = 'subline'


# ------------------ Station ------------------
class Station(models.Model):
    station_id = models.AutoField(primary_key=True)
    station_name = models.CharField(max_length=100)
    subline = models.ForeignKey(SubLine, on_delete=models.CASCADE, related_name='stations', null=True, blank=True)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name='stations', null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='stations', null=True, blank=True)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='stations', null=True, blank=True)
    hq = models.ForeignKey(Hq, on_delete=models.CASCADE, related_name='stations', null=True, blank=True)

    def __str__(self):
        if self.subline:
            return f"{self.station_name} ({self.subline.subline_name})"
        elif self.line:
            return f"{self.station_name} ({self.line.line_name})"
        elif self.department:
            return f"{self.station_name} ({self.department.department_name})"
        elif self.factory:
            return f"{self.station_name} ({self.factory.factory_name})"
        elif self.hq:
            return f"{self.station_name} ({self.hq.hq_name})"
        return self.station_name

    class Meta:
        db_table = 'station'

        # Add this new model to your existing models.py
class StationType(models.Model):
    type_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True)  # e.g., 'CTQ'
    name = models.CharField(max_length=100)  
    icon = models.ImageField(upload_to='station_icons/', null=True, blank=True)          
    color = models.CharField( max_length=50,default='from-blue-600 to-blue-700',help_text="Tailwind gradient class, e.g. from-red-600 to-red-700")

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'station_type'

from django.db.models.signals import post_migrate
from django.dispatch import receiver
# --- UPDATED: Hierarchy Structure Model ---
class HierarchyStructure(models.Model):
    structure_id = models.AutoField(primary_key=True)
    structure_name = models.CharField(max_length=200)

    # Links
    hq = models.ForeignKey('Hq', on_delete=models.CASCADE, related_name='structures', null=True, blank=True)
    factory = models.ForeignKey('Factory', on_delete=models.CASCADE, related_name='structures', null=True, blank=True)
    department = models.ForeignKey('Department', on_delete=models.CASCADE, related_name="structures", null=True, blank=True)
    line = models.ForeignKey('Line', on_delete=models.CASCADE, related_name="structures", null=True, blank=True)
    subline = models.ForeignKey('SubLine', on_delete=models.CASCADE, related_name="structures", null=True, blank=True)
    station = models.ForeignKey('Station', on_delete=models.CASCADE, related_name="structures", null=True, blank=True)

    # Station Type - stored as CharField to preserve the type code
    station_type = models.CharField(max_length=20, null=True, blank=True)  # Stores 'CTQ', 'PDI', 'MARUA', 'OTHER', 'NONE'

    def __str__(self):
        return self.structure_name

    class Meta:
        db_table = "hierarchy_structure"


# --- Auto-Create Types Script ---
@receiver(post_migrate)
def create_default_station_types(sender, **kwargs):
    if sender.name == 'api':  # Change 'api' to your app name
        types = [
            ('CTQ', 'Critical to Quality'),
            ('PDI', 'Pre-Delivery Inspection'),
            ('MARUA', 'Marua Checkpoint'),
            ('OTHER', 'Other Process'),
            ('NONE', 'Standard Station'),
        ]
        for code, name in types:
            StationType.objects.get_or_create(code=code, defaults={'name': name})
        print("✅ Station Types (Names & Codes) ensured in Database")
        
@receiver(post_migrate)
def ensure_rbac_defaults(sender, **kwargs):
    if sender.name != 'app1':
        return
    sync_rbac_permissions()

# class HierarchyStructure(models.Model):
#     structure_id = models.AutoField(primary_key=True)
#     structure_name = models.CharField(max_length=200)

#     # link to HQ and Factory
#     hq = models.ForeignKey(Hq, on_delete=models.CASCADE, related_name='hierarchy_structures', null=True, blank=True)
#     factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='hierarchy_structures', null=True, blank=True)

#     # instead of JSON, store direct relations
#     department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="hierarchy_structures", null=True, blank=True)
#     line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name="hierarchy_structures", null=True, blank=True)
#     subline = models.ForeignKey(SubLine, on_delete=models.CASCADE, related_name="hierarchy_structures", null=True, blank=True)
#     station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name="hierarchy_structures", null=True, blank=True)

#     def _str_(self):
#         return f"{self.structure_name}"

#     class Meta:
#         db_table = "hierarchy_structure"
        
        
from django.db import models
from django.core.validators import RegexValidator

class MasterTable(models.Model):
    # Choices for sex/gender
    MALE = 'M'
    FEMALE = 'F'
    OTHER = 'O'
    SEX_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Other'),
    ]

    emp_id = models.CharField(max_length=20, primary_key=True, unique=True)  # Unique Employee ID
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    department = models.ForeignKey(
        'Department',
        on_delete=models.SET_NULL,
        null=True,
        related_name='employees'
    )
    current_line = models.ForeignKey(
        'Line',  # Link to your Line model
        on_delete=models.SET_NULL, # If Line is deleted, set this field to NULL
        null=True,                # Allow this field to be empty in the database
        blank=True,               # Allow this field to be blank in forms
        related_name='employees_on_line' # Optional, but good practice
    )
    current_station = models.ForeignKey(
        'Station', # Link to your Station model
        on_delete=models.SET_NULL, # If Station is deleted, set this field to NULL
        null=True,                # Allow this field to be empty in the database
        blank=True,               # Allow this field to be blank in forms
        related_name='employees_at_station' # Optional, but good practice
    )
    date_of_joining = models.DateField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)  # ✅ Birth date added
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, null=True, blank=True)
    email = models.EmailField(unique=False, null=True, blank=True)
    photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True)

    phone = models.CharField(
        max_length=15,
        unique=False,
        null=True, blank=True,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )]
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.emp_id})"


# ------------------ Level 0 ------------------    
from django.db import transaction   # ← This line was missing!
from django.utils import timezone
class TrainingBatch(models.Model):
    """ Manages the state of a training batch. """
    batch_id = models.CharField(max_length=20, unique=True, primary_key=True, help_text="e.g., BATCH-21-11-2025-1")
    is_active = models.BooleanField(default=True, help_text="Active batches appear in the attendance dropdown.")
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.batch_id


# STANDARD DOJO J0001(ADDED EMPLOYEE_ID AND DATE_OF_JOINING)


from datetime import datetime

class UserRegistration(models.Model):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    EMPLOYMENT_TYPE_CHOICES = [
        ('contractual', 'Contractual'),
        ('permanent', 'Permanent'),
    ]


    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    temp_id = models.CharField(max_length=50, unique=True, editable=False, blank=True, null=True)
    batch_id = models.CharField(max_length=20, editable=False, null=True, blank=True )
    email = models.EmailField(unique=False, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, default='M')
    photo = models.ImageField(upload_to='user_images/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    emergency_phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    
    aadhar_number = models.CharField(max_length=12, null=True, blank=True, help_text="12-digit Aadhar number")
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, null=True, blank=True)
    experience = models.BooleanField(default=False, help_text="Check if you have work experience")
    experience_years = models.PositiveIntegerField(null=True, blank=True, help_text="Number of years of experience")
    company_of_experience = models.CharField(max_length=200, null=True, blank=True, help_text="Previous company name")


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    is_added_to_master = models.BooleanField(default=False)
    added_to_master_at = models.DateTimeField(null=True, blank=True)

    date_of_joining = models.DateField(null=True, blank=True)
    employee_Id = models.CharField(max_length=40, null=True, blank=True)


    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.temp_id})"
    

    def save(self, *args, **kwargs):
        if not self.temp_id:
            self.temp_id = f"TEMP{uuid.uuid4().hex[:12].upper()}"

        if not self.pk:  # assign batch only for new user
            today = timezone.localdate()
            date_str = today.strftime("%d-%m-%Y")

            # Check if today's batch already exists
            today_batch = TrainingBatch.objects.filter(
                batch_id__startswith=f"BATCH-{date_str}-"
            ).first()

            if today_batch:
                # Use today's existing batch
                self.batch_id = today_batch.batch_id

            else:
                # Find the last used batch number across all days
                last_batch = TrainingBatch.objects.order_by('-batch_id').first()

                if last_batch:
                    last_num = int(last_batch.batch_id.split('-')[-1])
                    next_num = last_num + 1
                else:
                    next_num = 1

                # Create new batch for today
                new_batch_id = f"BATCH-{date_str}-{next_num}"
                self.batch_id = new_batch_id

                TrainingBatch.objects.create(
                    batch_id=new_batch_id,
                    is_active=True
                )

        super().save(*args, **kwargs)

    def clean(self):
        from django.core.exceptions import ValidationError
        
        if self.experience:
            if not self.experience_years:
                raise ValidationError({'experience_years': 'Experience years is required when experience is selected.'})
            if not self.company_of_experience:
                raise ValidationError({'company_of_experience': 'Company of experience is required when experience is selected.'})
        
        # Validate Aadhar number format if provided
        if self.aadhar_number and len(self.aadhar_number) != 12:
            raise ValidationError({'aadhar_number': 'Aadhar number must be exactly 12 digits.'})





# change j0001

class HumanBodyQuestions(models.Model):
    question_text = models.TextField(unique=True)
    sort_order = models.PositiveIntegerField(default=0, db_index=True) 
    
    
    
    class Meta:
        ordering = ['sort_order'] 

    def _str_(self):
        # return f"Q{self.order}: {self.question_text[:50]}..."
        return f"{self.question_text[:50]}..."


class HumanBodyCheckSession(models.Model):
    temp_id = models.CharField(max_length=50)  
    user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    remarks = models.TextField(blank=True, null=True, help_text="Remarks regarding the session or modification reason")

    class Meta:
        ordering = ['-created_at']
        
    def save(self, *args, **kwargs):
        # Auto-populate user if not set
        if not self.user and self.temp_id:
            try:
                self.user = UserRegistration.objects.get(temp_id=self.temp_id)
            except UserRegistration.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Session for {self.temp_id} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    @property
    def overall_status(self):
        answers = self.sheet_answers.values_list('answer', flat=True)
        if not answers:
            return 'pending'
        if 'not_eligible' in answers:
            return 'not_eligible'
        if all(ans == 'eligible' for ans in answers):
            return 'eligible'
        return 'pending'


class HumanBodyCheckSheet(models.Model):
    STATUS_CHOICES = [
        ('eligible', 'Eligible'),
        ('not_eligible', 'Not Eligible'),
        ('pending', 'Pending'),
    ]
    
    session = models.ForeignKey(HumanBodyCheckSession, on_delete=models.CASCADE, related_name="sheet_answers")
    question = models.ForeignKey(HumanBodyQuestions, on_delete=models.CASCADE)
    answer = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        unique_together = ('session', 'question')

    def __str__(self):
        return f"{self.session.temp_id} - {self.question.question_text[:30]} - {self.answer}"
    




# ------------------ Level 1 ------------------
class Level(models.Model):
    level_id = models.AutoField(primary_key=True)  # Auto-incrementing PK
    level_name = models.CharField(max_length=100, unique=True)
    

    def __str__(self):
        return f"{self.level_name} "


class Days(models.Model):
    days_id = models.AutoField(primary_key=True)  # Auto-incrementing PK
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="days")
    day = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"Day {self.day} - {self.level.level_name}"
    
    class Meta:
        verbose_name_plural = "Days"  # Proper plural form


class SubTopic(models.Model):
    subtopic_id = models.AutoField(primary_key=True)  # Auto-incrementing PK
    subtopic_name = models.CharField(max_length=255)
    days = models.ForeignKey(Days, on_delete=models.CASCADE, related_name="subtopics")
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="topics")
    

    def __str__(self):
        return self.subtopic_name



class SubTopicContent(models.Model):
    subtopiccontent_id = models.AutoField(primary_key=True)  # Auto-incrementing PK
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, related_name="contents")
    content = models.TextField()

    def __str__(self):
        return f"Content for {self.subtopic.subtopic_name}"

# =========================================start attendance ========================================
class TrainingContent(models.Model):
    trainingcontent_id = models.AutoField(primary_key=True)  # Auto-incrementing PK
    subtopiccontent = models.ForeignKey(SubTopicContent, on_delete=models.CASCADE, related_name="training_contents")
    description = models.CharField(max_length=255, null=True, blank= True)
    training_file = models.FileField(upload_to="training_files/", blank=True, null=True)
    url_link = models.URLField(blank=True, null=True)
    material = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Training for {self.subtopiccontent.subtopic.subtopic_name}"
from django.db import models
from django.utils import timezone

class RescheduledSession(models.Model):
    """
    Stores rescheduled training sessions for employees who were absent.
    """
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(
        'UserRegistration', 
        on_delete=models.CASCADE, 
        related_name='rescheduled_sessions'
    )
    batch = models.ForeignKey(
        'TrainingBatch', 
        on_delete=models.CASCADE, 
        related_name='rescheduled_sessions'
    )
    original_day = models.ForeignKey(
        'Days', 
        on_delete=models.CASCADE, 
        related_name='original_absences',
        help_text="The day the employee was originally absent"
    )
    original_date = models.DateField(
        help_text="The original date when employee was absent"
    )
    
    # Rescheduled details
    rescheduled_date = models.DateField()
    rescheduled_time = models.TimeField()
    training_subtopic = models.ForeignKey(
        'SubTopic',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rescheduled_sessions'
    )
    training_name = models.CharField(
        max_length=255,
        help_text="Name of the training session"
    )
    notes = models.TextField(blank=True, null=True)
    
    # Status tracking
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='scheduled'
    )
    
    # Attendance for rescheduled session
    attendance_marked = models.BooleanField(default=False)
    attendance_status = models.CharField(
        max_length=10,
        choices=[('present', 'Present'), ('absent', 'Absent')],
        null=True,
        blank=True
    )
    attendance_marked_at = models.DateTimeField(null=True, blank=True)
    marked_by = models.CharField(max_length=100, null=True, blank=True)
    attendance_photo = models.ImageField(
    upload_to='rescheduled_attendance_photos/',
    null=True,
    blank=True,
    help_text="Photo taken when marking attendance for rescheduled session"
)
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-rescheduled_date', '-rescheduled_time']
        verbose_name = 'Rescheduled Session'
        verbose_name_plural = 'Rescheduled Sessions'
    
    def __str__(self):
        return f"{self.employee.first_name} - {self.training_name} on {self.rescheduled_date}"
    
    def mark_attendance(self, status, marked_by=None):
        """Helper method to mark attendance for this session"""
        self.attendance_marked = True
        self.attendance_status = status
        self.attendance_marked_at = timezone.now()
        self.marked_by = marked_by
        if status == 'present':
            self.status = 'completed'
        self.save()
# =========================================end attendance ========================================

class Evaluation(models.Model):
    evaluation_id = models.AutoField(primary_key=True)  # Auto-incrementing PK
    subtopic = models.ForeignKey(SubTopic, on_delete=models.CASCADE, related_name="evaluations")
    evaluation_text = models.TextField()

    def __str__(self):
        return f"Evaluation for {self.subtopic.subtopic_name}"



class ProductionPlan(models.Model):
    month = models.CharField(max_length=20)
    year = models.PositiveIntegerField()

    hq = models.ForeignKey(Hq, on_delete=models.CASCADE, null=True, blank=True)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, null=True, blank=True)
    subline = models.ForeignKey(SubLine, on_delete=models.CASCADE, null=True, blank=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=True, blank=True)

    total_production_plan = models.PositiveIntegerField()
    total_production_actual = models.PositiveIntegerField(default=0)

    total_operators_required_plan = models.PositiveIntegerField(default=0)
    total_operators_required_actual = models.PositiveIntegerField(default=0)

    # CTQ Plan & Actual
    ctq_plan_l1 = models.PositiveIntegerField(default=0)
    ctq_plan_l2 = models.PositiveIntegerField(default=0)
    ctq_plan_l3 = models.PositiveIntegerField(default=0)
    ctq_plan_l4 = models.PositiveIntegerField(default=0)
    ctq_plan_total = models.PositiveIntegerField(default=0)

    ctq_actual_l1 = models.PositiveIntegerField(default=0)
    ctq_actual_l2 = models.PositiveIntegerField(default=0)
    ctq_actual_l3 = models.PositiveIntegerField(default=0)
    ctq_actual_l4 = models.PositiveIntegerField(default=0)
    ctq_actual_total = models.PositiveIntegerField(default=0)

    # PDI Plan & Actual
    pdi_plan_l1 = models.PositiveIntegerField(default=0)
    pdi_plan_l2 = models.PositiveIntegerField(default=0)
    pdi_plan_l3 = models.PositiveIntegerField(default=0)
    pdi_plan_l4 = models.PositiveIntegerField(default=0)
    pdi_plan_total = models.PositiveIntegerField(default=0)

    pdi_actual_l1 = models.PositiveIntegerField(default=0)
    pdi_actual_l2 = models.PositiveIntegerField(default=0)
    pdi_actual_l3 = models.PositiveIntegerField(default=0)
    pdi_actual_l4 = models.PositiveIntegerField(default=0)
    pdi_actual_total = models.PositiveIntegerField(default=0)

    # OTHER Plan & Actual
    other_plan_l1 = models.PositiveIntegerField(default=0)
    other_plan_l2 = models.PositiveIntegerField(default=0)
    other_plan_l3 = models.PositiveIntegerField(default=0)
    other_plan_l4 = models.PositiveIntegerField(default=0)
    other_plan_total = models.PositiveIntegerField(default=0)

    other_actual_l1 = models.PositiveIntegerField(default=0)
    other_actual_l2 = models.PositiveIntegerField(default=0)
    other_actual_l3 = models.PositiveIntegerField(default=0)
    other_actual_l4 = models.PositiveIntegerField(default=0)
    other_actual_total = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        location = f"{self.hq} > {self.factory}"
        if self.department:
            location += f" > {self.department}"
        if self.line:
            location += f" > {self.line}"
        if self.subline:
            location += f" > {self.subline}"
        if self.station:
            location += f" > {self.station}"
        return f"{self.month} {self.year} - {location}"



# ======================================================question paper ================================
class QuestionPaper(models.Model):
    question_paper_id = models.AutoField(primary_key=True)
    question_paper_name = models.CharField(max_length=200)
    department = models.ForeignKey(
        'Department', on_delete=models.CASCADE, related_name="question_papers", null=True, blank=True
    )
    line = models.ForeignKey(
        'Line', on_delete=models.CASCADE, related_name="question_papers", null=True, blank=True
    )
    subline = models.ForeignKey(
        'SubLine', on_delete=models.CASCADE, related_name="question_papers", null=True, blank=True
    )
    station = models.ForeignKey(
        'Station', on_delete=models.CASCADE, related_name="question_papers", null=True, blank=True
    )
    level = models.ForeignKey('Level', on_delete=models.CASCADE, related_name="question_papers")
    file = models.FileField(upload_to="question_papers/", null=True, blank=True)

    # === NEW TIMER FIELDS ===
    is_timer_enabled = models.BooleanField(
        default=True, 
        help_text="Enable countdown timer for this paper"
    )
    question_duration = models.PositiveIntegerField(
        default=30, 
        help_text="Time in seconds per question"
    )
    # ========================

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question_paper_name

    class Meta:
        db_table = 'question_paper'

        

from django.db import models


class StationLevelQuestionPaper(models.Model):
    """Mapping: Assign one QuestionPaper to one Station at one Level under a Department → Line → Subline"""

    department = models.ForeignKey(
        "Department", on_delete=models.CASCADE, related_name="department_questionpapers",null=True, blank=True
    )
    line = models.ForeignKey(
        "Line", on_delete=models.CASCADE, related_name="line_questionpapers",null=True, blank=True
    )
    subline = models.ForeignKey(
        "Subline", on_delete=models.CASCADE, related_name="subline_questionpapers",null=True, blank=True
    )
    station = models.ForeignKey(
        "Station", on_delete=models.CASCADE, related_name="station_questionpapers",null=True, blank=True
    )
    level = models.ForeignKey(
        "Level", on_delete=models.CASCADE, related_name="level_questionpapers"
    )
    question_paper = models.ForeignKey(
        "QuestionPaper", on_delete=models.CASCADE, related_name="assigned_stations"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # unique_together = ("department", "line", "subline", "station", "level")
        verbose_name = "Station-Level Question Paper Mapping"
        verbose_name_plural = "Station-Level Question Paper Mappings"

    def __str__(self):
        return f"{self.department or ''} / {self.line or ''} / {self.subline or ''} / {self.station or ''} / {self.level} → {self.question_paper}"


    # def __str__(self):
    #     return f"{self.department} / {self.line} / {self.subline} / {self.station} / {self.level} → {self.question_paper}"

from django.db import models
from django.core.exceptions import ValidationError
import os
# app1/models.py (or wherever TemplateQuestion lives)

from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Max

class TemplateQuestion(models.Model):
    question_paper = models.ForeignKey(
        "QuestionPaper",
        on_delete=models.CASCADE,
        related_name="template_questions"
    )

    # --- Language 1 text ---
    question = models.TextField()
    option_a = models.CharField(max_length=255)
    option_a_image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    option_b = models.CharField(max_length=255)
    option_b_image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    option_c = models.CharField(max_length=255)
    option_c_image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    option_d = models.CharField(max_length=255)
    option_d_image = models.ImageField(upload_to='question_images/', blank=True, null=True)

    # --- Language 2 text (optional) ---
    question_lang2 = models.TextField(null=True, blank=True)
    option_a_lang2 = models.CharField(max_length=255, null=True, blank=True)
    option_b_lang2 = models.CharField(max_length=255, null=True, blank=True)
    option_c_lang2 = models.CharField(max_length=255, null=True, blank=True)
    option_d_lang2 = models.CharField(max_length=255, null=True, blank=True)

    # --- Answer info ---
    correct_answer = models.CharField(max_length=255)
    # 0=A, 1=B, 2=C, 3=D
    correct_index = models.PositiveSmallIntegerField(default=0)

    # --- Images ---
    question_image = models.ImageField(upload_to='question_images/', blank=True, null=True)

    # NEW: archive flag
    is_active = models.BooleanField(
        default=True,
        help_text="If false, this question is hidden from normal selection."
    )

    # NEW: display order within a question paper
    order = models.PositiveSmallIntegerField(
        default=0,
        help_text="Display order of this question within its question paper."
    )

    def __str__(self):
        return self.question[:50]

    def clean(self):
        # Ensure correct_answer matches one of the text options
        text_options = [self.option_a, self.option_b, self.option_c, self.option_d]
        if self.correct_answer and self.correct_answer not in text_options:
            raise ValidationError("Correct answer must match one of the text options.")
        
        # Require at least one option with text or image
        if (
            not (self.option_a or self.option_a_image)
            and not (self.option_b or self.option_b_image)
            and not (self.option_c or self.option_c_image)
            and not (self.option_d or self.option_d_image)
        ):
            raise ValidationError("At least one option must have text or an image.")

        # correct_index within 0..3
        if self.correct_index < 0 or self.correct_index > 3:
            raise ValidationError("correct_index must be between 0 and 3.")

    def save(self, *args, **kwargs):
        """
        Auto-assign 'order' if it's 0 or not set.
        This ensures new questions go to the end of the list for that paper.
        """
        if (self.order is None or self.order == 0) and self.question_paper_id:
            max_order = (
                TemplateQuestion.objects
                .filter(question_paper_id=self.question_paper_id)
                .aggregate(Max('order'))['order__max'] or 0
            )
            self.order = max_order + 1

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['order', 'id']
        db_table = 'template_question'
# ======================================================question paper ================================



# ------------------ AR/VR ------------------
from django.db import models

class ARVRTrainingContent(models.Model):
    description = models.TextField()
    arvr_file = models.FileField(upload_to='arvr_files/', blank=True, null=True)
    url_link = models.TextField(max_length=500, blank=True, null=True)
    def str(self):
        return f"AR/VR Content - {self.description[:30]}..."


# --------------------------
# Level 2 Process Dojo
# --------------------------

from django.db import models

# class LevelWiseTrainingContent(models.Model):
#     level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="training_contents")
#     station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name="training_contents")
#     content_name = models.CharField(max_length=200)
#     file = models.FileField(upload_to="training_files/", null=True, blank=True)
#     url = models.URLField(null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def _str_(self):
#         return f"{self.content_name} ({self.level.level_name} - {self.station.station_name})"
    



#=============== hanchou and shokuchou ================#




class HanContent(models.Model):
    title = models.CharField(max_length=100, default='')

    def _str_(self):
        return self.title


# --- NEW MODEL ---
# This is the "Subtopic" that will live under a HanContent.
class HanSubtopic(models.Model):
    title = models.CharField(max_length=150)
    # This links each subtopic to its parent main topic.
    han_content = models.ForeignKey(HanContent, on_delete=models.CASCADE, related_name='subtopics')

    def __str__(self):
        # e.g., "Introduction to Python -> Week 1: Variables"
        return f"{self.han_content.title} -> {self.title}"



class HanTrainingContent(models.Model):
    # This ForeignKey has been CHANGED to point to HanSubtopic.
    han_subtopic = models.ForeignKey(HanSubtopic, on_delete=models.CASCADE, related_name='materials',  null=True)
    description = models.TextField()
    training_file = models.FileField(upload_to='training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Material for {self.han_subtopic.title}"
    

    
class ShoContent(models.Model):
    title = models.CharField(max_length=100, default='')

    def _str_(self):
        return self.title



class ShoSubtopic(models.Model):
    title = models.CharField(max_length=150)
    # This links each subtopic to its parent main topic.
    sho_content = models.ForeignKey(ShoContent, on_delete=models.CASCADE, related_name='sho_subtopics')

    def __str__(self):
        # e.g., "Introduction to Python -> Week 1: Variables"
        return f"{self.sho_content.title} -> {self.title}"



class ShoTrainingContent(models.Model):
    sho_subtopic = models.ForeignKey(ShoSubtopic, on_delete=models.CASCADE, related_name='sho_materials',  null=True)
    sho_description = models.TextField()
    training_file = models.FileField(upload_to='training_files/', blank=True, null=True)
    url_link = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Material for {self.sho_subtopic.title}"




from django.db import models
from django.core.exceptions import ValidationError

class HanchouExamQuestion(models.Model):
    question = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question[:50]  # show first 50 chars

    def clean(self):
        if self.correct_answer not in [
            self.option_a, self.option_b, self.option_c, self.option_d
        ]:
            raise ValidationError("Correct answer must match one of the options.")

from django.db.models import F, Q

class HanchouExamResult(models.Model):
    employee = models.ForeignKey(MasterTable, on_delete=models.PROTECT, related_name="hanchou_results")
    exam_name = models.CharField(max_length=50, default="hanchou", editable=False)
    started_at = models.DateTimeField()
    submitted_at = models.DateTimeField()
    total_questions = models.PositiveIntegerField()
    score = models.PositiveIntegerField()
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    pass_mark_percent = models.PositiveSmallIntegerField(default=70)
    passed = models.BooleanField(default=False)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=Q(score__lte=F("total_questions")),
                                   name="score_lte_total_questions"),
        ]

    @property
    def percentage(self):
        return 0 if not self.total_questions else round((self.score / self.total_questions) * 100, 2)

    def save(self, *args, **kwargs):
        self.passed = self.percentage >= self.pass_mark_percent
        super().save(*args, **kwargs)


from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import F, Q



class ShokuchouExamQuestion(models.Model):
    sho_question = models.TextField()
    sho_option_a = models.CharField(max_length=255)
    sho_option_b = models.CharField(max_length=255)
    sho_option_c = models.CharField(max_length=255)
    sho_option_d = models.CharField(max_length=255)
    sho_correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.sho_question[:50]  # show first 50 chars

    def clean(self):
        if self.sho_correct_answer not in [
            self.sho_option_a,
            self.sho_option_b,
            self.sho_option_c,
            self.sho_option_d,
        ]:
            raise ValidationError("Correct answer must match one of the options.")


class ShokuchouExamResult(models.Model):
    employee = models.ForeignKey(
        MasterTable, on_delete=models.PROTECT, related_name="shokuchou_results"
    )
    sho_exam_name = models.CharField(max_length=50, default="shokuchou", editable=False)
    sho_started_at = models.DateTimeField()
    sho_submitted_at = models.DateTimeField()
    sho_total_questions = models.PositiveIntegerField()
    sho_score = models.PositiveIntegerField()
    sho_duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    sho_pass_mark_percent = models.PositiveSmallIntegerField(default=70)
    sho_passed = models.BooleanField(default=False)
    sho_remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(sho_score__lte=F("sho_total_questions")),
                name="sho_score_lte_total_questions",
            ),
        ]

    @property
    def sho_percentage(self):
        return (
            0
            if not self.sho_total_questions
            else round((self.sho_score / self.sho_total_questions) * 100, 2)
        )

    def save(self, *args, **kwargs):
        self.sho_passed = self.sho_percentage >= self.sho_pass_mark_percent
        super().save(*args, **kwargs)


#=============== Hanchou and Shokuchou END ================#


    
# ================= 10 cycle ==============================#

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import MasterTable, Department, Station, Level

class TenCycleDayConfiguration(models.Model):
    id = models.AutoField(primary_key=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='day_configurations')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='day_configurations')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='day_configurations', null=True, blank=True)
    day_name = models.CharField(max_length=50)  # e.g., "Day 1"
    sequence_order = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('level', 'department', 'station', 'day_name')
        ordering = ['level', 'department', 'station', 'sequence_order']

    def __str__(self):
        return f"{self.level.level_name} - {self.department.department_name} - {self.day_name}"

class TenCycleTopics(models.Model):
    id = models.AutoField(primary_key=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='tencycle_topics')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='tencycle_topics')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='ten_cycle_topics', null=True, blank=True)
    slno = models.PositiveIntegerField()
    cycle_topics = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('level', 'department', 'station', 'slno')
        ordering = ['level', 'department', 'station', 'slno']

    def __str__(self):
        return f"{self.level.level_name} - {self.cycle_topics}"

class TenCycleSubTopic(models.Model):
    id = models.AutoField(primary_key=True)
    topic = models.ForeignKey(TenCycleTopics, on_delete=models.CASCADE, related_name='subtopics')
    sub_topic = models.CharField(max_length=200)
    score_required = models.PositiveIntegerField(default=1)  
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('topic', 'sub_topic')
        ordering = ['topic', 'id']

    def __str__(self):
        return f"{self.topic.cycle_topics} - {self.sub_topic}"

class TenCyclePassingCriteria(models.Model):
    id = models.AutoField(primary_key=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='ten_cycle_passing_criteria')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='ten_cycle_passing_criteria')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='ten_cycle_passing_criteria', null=True, blank=True)
    passing_percentage = models.FloatField(
        default=60.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Minimum percentage required to pass"
    )
    created_by = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('level', 'department', 'station')

    def __str__(self):
        return f"{self.level.level_name} - {self.department.department_name} ({self.passing_percentage}%)"

class OperatorPerformanceEvaluation(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(MasterTable, on_delete=models.CASCADE, related_name='performance_evaluations')
    date = models.DateField()
    shift = models.CharField(max_length=20,null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='evaluations')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='evaluations')
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='evaluations')
    line = models.CharField(max_length=100, null=True,blank=True)
    # process_name = models.CharField(max_length=100,null)
    operation_no = models.CharField(max_length=50,null=True,blank=True)
    date_of_retraining_completed = models.DateField(null=True, blank=True)
    prepared_by = models.CharField(max_length=100, null=True, blank=True)
    checked_by = models.CharField(max_length=100, null=True, blank=True)
    approved_by = models.CharField(max_length=100, null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    final_percentage = models.FloatField(null=True, blank=True)
    final_status = models.CharField(max_length=30, choices=[
        ('Pass', 'Pass'),
        ('Fail - Retraining Required', 'Fail - Retraining Required'),
        ('Not Evaluated', 'Not Evaluated')
    ], default='Not Evaluated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.emp_id}"

class EvaluationSubTopicMarks(models.Model):
    id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(OperatorPerformanceEvaluation, on_delete=models.CASCADE, related_name='subtopic_marks')
    subtopic = models.ForeignKey(TenCycleSubTopic, on_delete=models.CASCADE, related_name='subtopic_marks')
    day = models.ForeignKey(TenCycleDayConfiguration, on_delete=models.CASCADE, related_name='subtopic_marks')
    
    # Marks for each day/cycle
    mark_1 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_2 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_3 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_4 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_5 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_6 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_7 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_8 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_9 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    mark_10 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])

    total_score = models.IntegerField(null=True, blank=True)
    max_possible_score = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('employee', 'subtopic', 'day')

    def save(self, *args, **kwargs):
        marks = [
            self.mark_1, self.mark_2, self.mark_3, self.mark_4, self.mark_5,
            self.mark_6, self.mark_7, self.mark_8, self.mark_9, self.mark_10
        ]

        # Validate marks don't exceed subtopic's score_required
        for mark in marks:
            if mark is not None and mark > self.subtopic.score_required:
                raise ValueError(f"Mark {mark} exceeds maximum allowed score {self.subtopic.score_required}")

        valid_marks = [mark for mark in marks if mark is not None]
        self.total_score = sum(valid_marks) if valid_marks else 0
        self.max_possible_score = 10 * self.subtopic.score_required

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subtopic.topic.cycle_topics} - {self.subtopic.sub_topic} - {self.day.day_name}"

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver([post_save, post_delete], sender=EvaluationSubTopicMarks)
def update_operator_evaluation_summary(sender, instance, **kwargs):
    evaluation = instance.employee  # OperatorPerformanceEvaluation instance

    # Get all relevant day IDs for this evaluation config
    days = TenCycleDayConfiguration.objects.filter(
        level=evaluation.level,
        department=evaluation.department,
        station=evaluation.station,
        is_active=True
    )
    day_ids = list(days.values_list('id', flat=True))

    # Get all active subtopic IDs for this evaluation config
    topics = TenCycleTopics.objects.filter(
        level=evaluation.level,
        department=evaluation.department,
        station=evaluation.station,
        is_active=True
    )
    subtopic_ids = list(
        TenCycleSubTopic.objects.filter(
            topic__in=topics,
            is_active=True
        ).values_list('id', flat=True)
    )

    # Check completeness: count expected entries
    expected_count = len(day_ids) * len(subtopic_ids)

    # Count actual Evaluation marks for the evaluation
    actual_count = EvaluationSubTopicMarks.objects.filter(
        employee=evaluation,
        day_id__in=day_ids,
        subtopic_id__in=subtopic_ids
    ).count()

    # Aggregate total score and max score across all marks
    all_marks = EvaluationSubTopicMarks.objects.filter(employee=evaluation)
    total_score = sum(m.total_score or 0 for m in all_marks)
    total_max_score = sum(m.max_possible_score or 0 for m in all_marks)

    percentage = (total_score / total_max_score) * 100 if total_max_score > 0 else 0.0

    # Get passing criteria (with fallback)
    try:
        passing_criteria = TenCyclePassingCriteria.objects.get(
            level=evaluation.level,
            department=evaluation.department,
            station=evaluation.station,
            is_active=True
        )
        passing_percentage = passing_criteria.passing_percentage
    except TenCyclePassingCriteria.DoesNotExist:
        passing_percentage = 60.0

    # Determine final status
    if total_max_score == 0:
        final_status = 'Not Evaluated'
    else:
        final_status = 'Pass' if percentage >= passing_percentage else 'Fail - Retraining Required'

    # Determine if evaluation is complete: all marks exist for all days * all subtopics
    is_complete = (expected_count > 0) and (actual_count == expected_count)

    # Update evaluation model fields
    evaluation.final_percentage = round(percentage, 2)
    evaluation.final_status = final_status
    evaluation.is_completed = is_complete
    evaluation.save(update_fields=['final_percentage', 'final_status', 'is_completed'])

    
# =========================== 10 cycle ============================ #


#OJT models


# ------------------ OJT Topic ------------------
# ------------------ OJT Topic ------------------
class OJTTopic(models.Model):
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="ojt_topics")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="ojt_topics")
    sl_no = models.PositiveIntegerField()
    topic = models.CharField(max_length=200)
    category = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.sl_no}. {self.topic} ({self.department.department_name} - {self.level.level_name})"


# ------------------ Trainee Info ------------------

# class TraineeInfo(models.Model):
#     trainee_name = models.CharField(max_length=100)
#     trainer_id = models.CharField(max_length=50)
#     emp_id = models.CharField(max_length=50,null=True, blank=True,)
#     line = models.CharField(max_length=100)
#     subline = models.CharField(max_length=100)
#     station = models.CharField(max_length=100)
#     station_id = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='trainees', null=True, blank=True,db_column='station_id')
#     process_name = models.CharField(max_length=100)
#     revision_date = models.DateField()
#     doj = models.DateField()
#     trainer_name = models.CharField(max_length=100)
#     status = models.CharField(max_length=50, default="Pending")

#     def str(self):
#         return f"{self.trainee_name} ({self.emp_id})"
    
from django.db import models

class TraineeInfo(models.Model):
    trainee_name = models.CharField(max_length=100)
    trainer_id = models.CharField(max_length=50)
    emp_id = models.CharField(max_length=50, null=True, blank=True)
    line = models.CharField(max_length=100)
    subline = models.CharField(max_length=100)
    station = models.ForeignKey('Station', on_delete=models.CASCADE, related_name='trainees')
    process_name = models.CharField(max_length=100)
    revision_date = models.DateField()
    doj = models.DateField()
    trainer_name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default="Pending")
    level = models.ForeignKey('Level', on_delete=models.CASCADE, related_name='trainees')

    def __str__(self):
        return f"{self.trainee_name} ({self.emp_id}) - Level {self.level.pk}"

    class Meta:
        unique_together = ('emp_id', 'station', 'level')  # Critical: one record per emp-station-level
        verbose_name = "Trainee Info"
        verbose_name_plural = "Trainee Info"






# ------------------ OJT Days ------------------
class OJTDay(models.Model):
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="ojt_days")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="ojt_days")
    name = models.CharField(max_length=100)

    def str(self):
        return f"{self.name} ({self.department.department_name} - {self.level.level_name})"


# ------------------ OJT Score  ------------------

# from django.core.exceptions import ValidationError
# from django.db import models


# class OJTScore(models.Model):
#     topic = models.ForeignKey('OJTTopic', on_delete=models.CASCADE, related_name="scores")
#     day = models.ForeignKey('OJTDay', on_delete=models.CASCADE, related_name="scores")
#     trainee = models.ForeignKey('TraineeInfo', on_delete=models.CASCADE, related_name="scores")
#     score = models.PositiveIntegerField()

#     def clean(self):
#         """Validate score is within allowed range."""
#         department = self.topic.department
#         level = self.topic.level

#         try:
#             score_range = OJTScoreRange.objects.get(department=department, level=level)
#         except OJTScoreRange.DoesNotExist:
#             raise ValidationError({
#                 "score": f"No score range defined for {department.department_name} - {level.level_name}."
#             })

#         if not (score_range.min_score <= self.score <= score_range.max_score):
#             raise ValidationError({
#                 "score": f"Score must be between {score_range.min_score} and {score_range.max_score} "
#                          f"for {department.department_name} - {level.level_name}."
#             })

#     def save(self, *args, **kwargs):
#         self.full_clean()  # ensure validation before saving
#         super().save(*args, **kwargs)

#     def _str_(self):
#         return f"{self.trainee.trainee_name} - {self.topic.topic} - {self.day.name} : {self.score}"


# ------------------ OJT Score Range------------------

class OJTScoreRange(models.Model):
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="score_ranges")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="score_ranges")
    min_score = models.PositiveIntegerField(default=0)
    max_score = models.PositiveIntegerField()

    class Meta:
        unique_together = ("department", "level")  # prevent duplicate ranges

    def str(self):
        return f"{self.department.department_name} - {self.level.level_name}: {self.min_score} to {self.max_score}"

from django.core.exceptions import ValidationError

class OJTScore(models.Model):
    topic = models.ForeignKey(OJTTopic, on_delete=models.CASCADE, related_name="scores")
    day = models.ForeignKey(OJTDay, on_delete=models.CASCADE, related_name="scores")
    trainee = models.ForeignKey(TraineeInfo, on_delete=models.CASCADE, related_name="scores")
    score = models.PositiveIntegerField()

    def clean(self):
        department = self.topic.department
        level = self.topic.level

        try:
            score_range = OJTScoreRange.objects.get(department=department, level=level)
        except OJTScoreRange.DoesNotExist:
            raise ValidationError({
                "score": f"No score range defined for {department.department_name} - {level.level_name}."
            })

        if not (score_range.min_score <= self.score <= score_range.max_score):
            raise ValidationError({
                "score": f"Score must be between {score_range.min_score} and {score_range.max_score} "
                         f"for {department.department_name} - {level.level_name}."
            })

    def save(self, *args, **kwargs):
        # Ensure validation runs on save (not only via forms)
        self.full_clean()
        super().save(*args, **kwargs)

    def str(self):
        return f"{self.trainee.trainee_name} - {self.topic.topic} - Day {self.day.name} : {self.score}"



# ------------------ OJT Score Criteria ------------------

class OJTPassingCriteria(models.Model):
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="ojt_passing_criteria")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="ojt_passing_criteria")
    day = models.ForeignKey("OJTDay", on_delete=models.CASCADE, null=True, blank=True, related_name="ojt_passing_criteria")
    # If day is NULL, it means criteria applies to ALL days in that dept+level
    percentage = models.FloatField(help_text="Passing percentage (e.g., 60 for 60%)")

    class Meta:
        unique_together = ("department", "level", "day")  # avoid duplicates

    def str(self):
        if self.day:
            return f"{self.department.department_name} - {self.level.level_name} - {self.day.name}: {self.percentage}%"
        return f"{self.department.department_name} - {self.level.level_name} (All Days): {self.percentage}%"
    
#-----------------------Quantity OJT ----------------------------#

# from django.db import models


# class QuantityOJTScoreRange(models.Model):
#     department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="quantity_score_ranges",default="")
#     level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="quantity_score_ranges",default="")

#     # Production Score Range
#     production_min_score = models.DecimalField(max_digits=5, decimal_places=2)
#     production_max_score = models.DecimalField(max_digits=5, decimal_places=2)

#     # Rejection Score Range
#     rejection_min_score = models.DecimalField(max_digits=5, decimal_places=2)
#     rejection_max_score = models.DecimalField(max_digits=5, decimal_places=2)

#     def _str_(self):
#         return f"[{self.department.name} - {self.level.name}] Production: {self.production_min_score}-{self.production_max_score}, Rejection: {self.rejection_min_score}-{self.rejection_max_score}"



# class QuantityPassingCriteria(models.Model):
#     department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="quantity_passing_criteria",default="")
#     level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="quantity_passing_criteria",default="")

#     production_passing_percentage = models.DecimalField(max_digits=5, decimal_places=2)
#     rejection_passing_percentage = models.DecimalField(max_digits=5, decimal_places=2)

#     def _str_(self):
#         return f"[{self.department.name} - {self.level.name}] Production Passing: {self.production_passing_percentage}%, Rejection Passing: {self.rejection_passing_percentage}%"


# class OJTLevel2Quantity(models.Model):
#     level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="ojt_records")
#     trainee_name = models.CharField(max_length=200)
#     trainee_id = models.CharField(max_length=50 )
#     emp_id = models.CharField(max_length=50, blank=True, null=True)
#     station = models.ForeignKey("Station", on_delete=models.CASCADE, related_name="ojt_quantity_records",default='') 
#     station_name = models.CharField(max_length=100)
#     line_name = models.CharField(max_length=100, null=True, blank=True)
#     process_name = models.CharField(max_length=200, null=True, blank=True)
#     revision_date = models.DateField()
#     doj = models.DateField(verbose_name="Date of Joining")
#     trainer_name = models.CharField(max_length=200)
#     engineer_judge = models.CharField(max_length=200, blank=True, null=True)
#     status = models.CharField(max_length=50, default="Pending")

#     def __str__(self):
#         return f"{self.trainee_name} ({self.trainee_id})"

#     @property
#     def production_total(self):
#         return sum(e.production_marks for e in self.evaluations.all())

#     @property
#     def rejection_total(self):
#         return sum(e.rejection_marks for e in self.evaluations.all())



# # ---------------------------
# #   Daily Evaluation
# # ---------------------------
# class Level2QuantityOJTEvaluation(models.Model):
#     ojt_record = models.ForeignKey(
#         OJTLevel2Quantity,
#         on_delete=models.CASCADE,
#         related_name="evaluations"
#     )
#     day = models.PositiveIntegerField()
#     date = models.DateField()
#     plan = models.PositiveIntegerField()
#     production_actual = models.PositiveIntegerField()
#     production_marks = models.DecimalField(max_digits=5, decimal_places=2, default=0)
#     rejection_marks = models.DecimalField(max_digits=5, decimal_places=2, default=0)
#     number_of_rejections = models.PositiveIntegerField()

#     def _str_(self):
#         return f"Day {self.day} - {self.ojt_record.trainee_name} ({self.date})"

#     @property
#     def percentage(self):
#         """% of production achieved against plan"""
#         if self.plan > 0:
#             return (self.production_actual / self.plan) * 100
#         return 0

#     def calculate_production_marks(self):
#         pct = self.percentage
#         rule = QuantityScoreSetup.objects.filter(
#             score_type="production",
#             min_value__lte=pct,
#             max_value__gte=pct,
#             level=self.ojt_record.level
#         ).first()
#         return rule.marks if rule else 0

#     def calculate_rejection_marks(self):
#         rejections = self.number_of_rejections
#         rule = QuantityScoreSetup.objects.filter(
#             score_type="rejection",
#             min_value__lte=rejections,
#             max_value__gte=rejections,
#             level=self.ojt_record.level
#         ).first()
#         return rule.marks if rule else 0

#     def save(self, *args, **kwargs):
#         # Auto-calculate marks before saving
#         self.production_marks = self.calculate_production_marks()
#         self.rejection_marks = self.calculate_rejection_marks()
#         super().save(*args, **kwargs)

from django.db import models

# models.py
# models.py
class LevelDayRequirement(models.Model):
    level = models.OneToOneField(
        "Level",
        on_delete=models.CASCADE,
        related_name="day_requirement",
        to_field="level_id"  # Important: point to the actual PK field
    )
    required_days = models.PositiveSmallIntegerField(
        help_text="Number of days needed to complete OJT"
    )

    class Meta:
        ordering = ["level__level_id"]  # Default ordering (optional but clean)

    def __str__(self):
        return f"{self.level.level_name} → {self.required_days} days"



class QuantityOJTScoreRange(models.Model):
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="quantity_score_ranges",default="")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="quantity_score_ranges",default="")

    # Production Score Range
    production_min_score = models.DecimalField(max_digits=5, decimal_places=2)
    production_max_score = models.DecimalField(max_digits=5, decimal_places=2)

    # Rejection Score Range
    rejection_min_score = models.DecimalField(max_digits=5, decimal_places=2)
    rejection_max_score = models.DecimalField(max_digits=5, decimal_places=2)

    def _str_(self):
        return f"[{self.department.name} - {self.level.name}] Production: {self.production_min_score}-{self.production_max_score}, Rejection: {self.rejection_min_score}-{self.rejection_max_score}"



class QuantityPassingCriteria(models.Model):
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="quantity_passing_criteria",default="")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="quantity_passing_criteria",default="")

    production_passing_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    rejection_passing_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def _str_(self):
        return f"[{self.department.name} - {self.level.name}] Production Passing: {self.production_passing_percentage}%, Rejection Passing: {self.rejection_passing_percentage}%"


class OJTLevel2Quantity(models.Model):
    department = models.ForeignKey(
        "Department",
        on_delete=models.CASCADE,
        related_name="ojt_quantity_records",
        null=True,
        blank=True
    )
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="ojt_records")
    trainee_name = models.CharField(max_length=200)
    trainee_id = models.CharField(max_length=50 )
    emp_id = models.CharField(max_length=50, blank=True, null=True)
    station = models.ForeignKey("Station", on_delete=models.CASCADE, related_name="ojt_quantity_records",default='') 
    station_name = models.CharField(max_length=100)
    line_name = models.CharField(max_length=100, null=True, blank=True)
    process_name = models.CharField(max_length=200, null=True, blank=True)
    revision_date = models.DateField()
    doj = models.DateField(verbose_name="Date of Joining")
    trainer_name = models.CharField(max_length=200)
    engineer_judge = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=50, default="Pending")

    def __str__(self):
        return f"{self.trainee_name} ({self.trainee_id})"
    

    # models.py – add this method
    def evaluate_status(self):
        """
        Final status:
        - Pending: not all days filled OR last day missing
        - Fail:   any day below required marks
        - Pass:   all days filled AND every day >= required marks
        """
        required = self.required_days
        if required == 0:
            self.status = "Pending"
            self.save(update_fields=["status"])
            return

        evals = self.evaluations.order_by("day")
        filled_days = evals.count()

        # 1. Not all days filled?
        if filled_days < required:
            self.status = "Pending"
            self.save(update_fields=["status"])
            return

        # 2. Last day must be the required one
        if evals.last().day != required:
            self.status = "Pending"
            self.save(update_fields=["status"])
            return

        # 3. Get max marks per day
        prod_max = QuantityScoreSetup.objects.filter(
            level=self.level, score_type="production"
        ).order_by("-marks").first()
        rej_max = QuantityScoreSetup.objects.filter(
            level=self.level, score_type="rejection"
        ).order_by("-marks").first()

        if not (prod_max and rej_max):
            self.status = "Pending"
            self.save(update_fields=["status"])
            return

        max_per_day = prod_max.marks + rej_max.marks

        # 4. Get passing criteria (use stricter %)
        criteria = QuantityPassingCriteria.objects.filter(level=self.level).first()
        if not criteria:
            self.status = "Pending"
            self.save(update_fields=["status"])
            return

        min_pct = max(criteria.production_passing_percentage, criteria.rejection_passing_percentage)
        required_per_day = (min_pct / 100) * max_per_day

        # 5. Check every day
        for ev in evals:
            day_total = ev.production_marks + ev.rejection_marks
            if day_total < required_per_day:
                self.status = "Fail"
                self.save(update_fields=["status"])
                return

        # 6. All good → PASS
        self.status = "Pass"
        self.save(update_fields=["status"])

    @property
    def production_total(self):
        return sum(e.production_marks for e in self.evaluations.all())

    @property
    def rejection_total(self):
        return sum(e.rejection_marks for e in self.evaluations.all())
    
    # models.py – inside OJTLevel2Quantity
    @property
    def required_days(self):
        try:
            return self.level.day_requirement.required_days
        except LevelDayRequirement.DoesNotExist:
            return 0

    class Meta:
        unique_together = ('trainee_id', 'level', 'station', 'department')



# ---------------------------
#   Daily Evaluation
# ---------------------------
class Level2QuantityOJTEvaluation(models.Model):
    ojt_record = models.ForeignKey(
        OJTLevel2Quantity,
        on_delete=models.CASCADE,
        related_name="evaluations"
    )
    day = models.PositiveIntegerField()
    date = models.DateField()
    plan = models.PositiveIntegerField()
    production_actual = models.PositiveIntegerField()
    production_marks = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    rejection_marks = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    number_of_rejections = models.PositiveIntegerField()

    def _str_(self):
        return f"Day {self.day} - {self.ojt_record.trainee_name} ({self.date})"

    @property
    def percentage(self):
        """% of production achieved against plan"""
        if self.plan > 0:
            return (self.production_actual / self.plan) * 100
        return 0

    def calculate_production_marks(self):
        pct = self.percentage
        rule = QuantityScoreSetup.objects.filter(
            score_type="production",
            min_value__lte=pct,
            max_value__gte=pct,
            level=self.ojt_record.level
        ).first()
        return rule.marks if rule else 0

    def calculate_rejection_marks(self):
        rejections = self.number_of_rejections
        rule = QuantityScoreSetup.objects.filter(
            score_type="rejection",
            min_value__lte=rejections,
            max_value__gte=rejections,
            level=self.ojt_record.level
        ).first()
        return rule.marks if rule else 0
    def save(self, *args, **kwargs):
        self.production_marks = self.calculate_production_marks()
        self.rejection_marks = self.calculate_rejection_marks()
        super().save(*args, **kwargs)
        # Re-evaluate trainee status
        self.ojt_record.evaluate_status()

    # def save(self, *args, **kwargs):
    #     # Auto-calculate marks before saving
    #     self.production_marks = self.calculate_production_marks()
    #     self.rejection_marks = self.calculate_rejection_marks()
    #     super().save(*args, **kwargs)

# ==================== Refreshment Training ======================== #

# class RecurrenceInterval(models.Model):
#     """
#     Model to store recurrence interval for automatic scheduling
#     This applies globally to all training categories
#     """
#     interval_months = models.IntegerField(
#         help_text="Interval in months for automatic rescheduling (e.g., 3 or 6)"
#     )
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return f"{self.interval_months} months interval"
    
class Training_category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Curriculum(models.Model):
    category = models.ForeignKey(
        Training_category, on_delete=models.CASCADE, related_name='topics')
    topic = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("category", "topic")
        ordering = ["topic"]

    def __str__(self):
        return f"{self.category.name} > {self.topic}"


class CurriculumContent(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('link', 'Link'),
    ]

    curriculum = models.ForeignKey(
        'Curriculum', on_delete=models.CASCADE, related_name='contents')
    content_name = models.CharField(max_length=200)
    content_type = models.CharField(
        max_length=10, choices=CONTENT_TYPE_CHOICES)

    file = models.FileField(
        upload_to='training_contents/', null=True, blank=True)
    link = models.URLField(null=True, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content_name


class Trainer_name(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Venues(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# class Schedule(models.Model):
#     STATUS_CHOICES = [
#         ('scheduled', 'Scheduled'),
#         ('completed', 'Completed'),
#         ('cancelled', 'Cancelled'),
#         ('pending', 'Pending'),
#     ]

#     training_category = models.ForeignKey(
#         Training_category, on_delete=models.CASCADE, related_name='scheduled_categories')
#     training_name = models.ForeignKey(
#         Curriculum, on_delete=models.CASCADE, related_name='scheduled_topics')

#     trainer = models.ForeignKey(
#         Trainer_name, on_delete=models.SET_NULL, null=True)
#     venue = models.ForeignKey(Venues, on_delete=models.SET_NULL, null=True)

#     status = models.CharField(
#         max_length=20, choices=STATUS_CHOICES, default='Scheduled')
#     date = models.DateField()
#     time = models.TimeField()

#     employees = models.ManyToManyField(
#         "MasterTable", related_name='schedules')
#     recurrence_interval = models.ForeignKey(
#         RecurrenceInterval, 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True,
#         related_name='schedules',
#         help_text="Recurrence interval for this schedule"
#     )
#     is_recurring = models.BooleanField(
#         default=False,
#         help_text="Whether this schedule should automatically recur"
#     )
#     parent_schedule = models.ForeignKey(
#         'self',
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='recurring_schedules',
#         help_text="Original schedule if this is a recurring instance"
#     )
#     recurring_schedule_created = models.BooleanField(
#         default=False,
#         help_text="Flag to track if recurring schedule has been created"
#     )
#     completed_date = models.DateField(
#         null=True,
#         blank=True,
#         help_text="Date when training was marked as completed"
#     )

#     def __str__(self):
#         return f"{self.training_name.topic} on {self.date}"
    
# Remove or comment out the RecurrenceInterval model entirely
# We'll store the interval directly in the Schedule model

class Schedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]

    training_category = models.ForeignKey(
        'Training_category', on_delete=models.CASCADE, related_name='scheduled_categories')
    
    # CHANGED: Now supports multiple topics per schedule
    topics = models.ManyToManyField(
        'Curriculum', related_name='scheduled_sessions')

    trainer = models.ForeignKey(
        'Trainer_name', on_delete=models.SET_NULL, null=True)
    venue = models.ForeignKey('Venues', on_delete=models.SET_NULL, null=True)

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    date = models.DateField()
    time = models.TimeField()

    employees = models.ManyToManyField(
        "MasterTable", related_name='schedules')
    
    recurrence_months = models.IntegerField(
        null=True,
        blank=True,
        help_text="Number of months for recurrence (1-10). Null means no recurrence."
    )
    
    is_recurring = models.BooleanField(
        default=False,
        help_text="Whether this schedule should automatically recur"
    )
    
    parent_schedule = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recurring_schedules',
        help_text="Original schedule if this is a recurring instance"
    )
    
    recurring_schedule_created = models.BooleanField(
        default=False,
        help_text="Flag to track if recurring schedule has been created"
    )
    
    completed_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date when training was marked as completed"
    )
    
    next_training_date_override = models.DateField(
        null=True,
        blank=True,
        help_text="Manually set next training date (overrides calculated date)"
    )
    
    # 0 = Scheduled, 1 = Pre, 2 = Content, 3 = Post, 4 = Completed
    training_stage = models.IntegerField(default=0, help_text="Current stage of the training flow")

    def __str__(self):
        return f"{self.training_category.name} Session on {self.date}"
    
    def get_next_training_date(self):
        if self.next_training_date_override:
            return self.next_training_date_override
        if self.is_recurring and self.recurrence_months and self.completed_date:
            from dateutil.relativedelta import relativedelta
            return self.date + relativedelta(months=self.recurrence_months)
        return None
    
    def get_next_creation_date(self):
        next_date = self.get_next_training_date()
        if next_date:
            from datetime import timedelta
            return next_date - timedelta(days=7)
        return None

class EmployeeAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('rescheduled', 'Rescheduled'),
    ]

    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name='attendances')
    employee = models.ForeignKey(
        'MasterTable', on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='present')
    notes = models.TextField(blank=True, null=True)

    # For rescheduling
    reschedule_date = models.DateField(blank=True, null=True)
    reschedule_time = models.TimeField(blank=True, null=True)
    reschedule_reason = models.TextField(blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('schedule', 'employee')

    def __str__(self):
        return f"{self.employee} - {self.schedule} - {self.status}"


class RescheduleLog(models.Model):
    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name='reschedule_logs')
    employee = models.ForeignKey(
        'MasterTable', on_delete=models.CASCADE, related_name='reschedule_logs')
    original_date = models.DateField()
    original_time = models.TimeField()
    new_date = models.DateField()
    new_time = models.TimeField()
    reason = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Reschedule for {self.employee} on {self.schedule}"

    # new model 

class RescheduleHistory(models.Model):
    """
    Track the complete history of an employee's training journey
    from original schedule through reschedule to final attendance
    """
    employee = models.ForeignKey(
        'MasterTable', on_delete=models.CASCADE, related_name='reschedule_history'
    )
    original_schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name='original_histories'
    )
    
    # Original training details
    original_date = models.DateField()
    original_time = models.TimeField()
    original_venue = models.CharField(max_length=200, blank=True, null=True)
    original_trainer = models.CharField(max_length=200, blank=True, null=True)
    original_status = models.CharField(
        max_length=20,
        choices=[('absent', 'Absent'), ('rescheduled', 'Rescheduled')],
        help_text="Original attendance status (absent or rescheduled)"
    )
    
    # Rescheduled training details
    rescheduled_date = models.DateField()
    rescheduled_time = models.TimeField()
    reschedule_reason = models.TextField()
    
    # Final attendance status
    final_status = models.CharField(
        max_length=20,
        choices=[('present', 'Present'), ('absent', 'Absent'), ('pending', 'Pending')],
        default='pending',
        help_text="Final attendance status after reschedule"
    )
    final_attendance_marked_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Reschedule Histories'

    def __str__(self):
        return f"{self.employee} - {self.original_schedule.training_name.topic} - {self.final_status}"
    

from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class RefresherQuestionBank(models.Model):
    # CHANGED: Now linked to Category, not Topic
    category = models.OneToOneField(
        'Training_category',
        on_delete=models.CASCADE,
        related_name='refresher_question_bank'
    )
    passing_score = models.PositiveSmallIntegerField(default=70, help_text="Percentage required to pass")
    time_limit_minutes = models.PositiveSmallIntegerField(default=30, help_text="Time for Pre & Post Test")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"QB: {self.category.name}"

    class Meta:
        verbose_name = "Refresher Question Bank"
        verbose_name_plural = "Refresher Question Banks"

class RefresherQuestion(models.Model):
    bank = models.ForeignKey(
        RefresherQuestionBank,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_text = models.TextField(blank=True)
    question_image = models.ImageField(
        upload_to='refresher/questions/',
        null=True,
        blank=True
    )

    option_a = models.CharField(max_length=500, blank=True)
    option_b = models.CharField(max_length=500, blank=True)
    option_c = models.CharField(max_length=500, blank=True)
    option_d = models.CharField(max_length=500, blank=True)

    option_a_image = models.ImageField(upload_to='refresher/options/', null=True, blank=True)
    option_b_image = models.ImageField(upload_to='refresher/options/', null=True, blank=True)
    option_c_image = models.ImageField(upload_to='refresher/options/', null=True, blank=True)
    option_d_image = models.ImageField(upload_to='refresher/options/', null=True, blank=True)

    correct_answer = models.CharField(
        max_length=1,
        choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')],
        help_text="Correct option"
    )
    marks = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True, help_text="If False, this question won't appear in new tests")

    class Meta:
        ordering = ['order']
        verbose_name = "Refresher Question"
        verbose_name_plural = "Refresher Questions"

    def __str__(self):
        return f"{self.question_text[:50]}..."

    def clean(self):
        if not self.question_text and not self.question_image:
            raise ValidationError("Question must have either text or an image.")

from django.db import models
from django.utils import timezone
# make sure RefresherBatch is imported or defined above
# from .models import RefresherBatch  # if in another file

class RefresherTestSession(models.Model):
    TEST_TYPE_CHOICES = [('pre', 'Pre-Test'), ('post', 'Post-Test')]
    MODE_CHOICES = [('remote', 'Remote Control'), ('individual', 'Individual (PC/Tablet)')]

    schedule = models.ForeignKey(
        'Schedule',
        on_delete=models.CASCADE,
        related_name='refresher_test_sessions'
    )
    employee = models.ForeignKey(
        'MasterTable',
        on_delete=models.CASCADE,
        related_name='refresher_tests'
    )
    test_type = models.CharField(max_length=10, choices=TEST_TYPE_CHOICES)
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='individual')
    
    # NEW: link each test session to a specific batch (optional for backwards compatibility)
    batch = models.ForeignKey(
        'RefresherBatch',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='test_sessions'
    )
    
    # For remote mode
    remote_key_id = models.CharField(max_length=20, null=True, blank=True)
    
    # Timing
    started_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    # Results
    score = models.PositiveSmallIntegerField(null=True, blank=True)
    total_questions = models.PositiveSmallIntegerField(null=True, blank=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    passed = models.BooleanField(null=True, blank=True)

    class Meta:
        # UPDATED: include batch in the uniqueness so you can have multiple
        # attempts per employee/schedule/test_type across different batches.
        unique_together = ('schedule', 'employee', 'test_type', 'batch')
        verbose_name = "Refresher Test Session"
        verbose_name_plural = "Refresher Test Sessions"

    def __str__(self):
        return f"{self.employee} - {self.get_test_type_display()} ({self.schedule})"

class RefresherAnswer(models.Model):
    test_session = models.ForeignKey(
        RefresherTestSession,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    question = models.ForeignKey(
        RefresherQuestion,
        on_delete=models.CASCADE
    )
    selected_option = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')])
    is_correct = models.BooleanField()
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('test_session', 'question')

from django.db import models
from django.utils import timezone
from .models import Schedule, MasterTable  # adjust import if needed
# (You already import Schedule and MasterTable elsewhere in this file)

class RefresherBatch(models.Model):
    """
    A batch of employees for a given refresher training schedule.
    Example name: 'Safety Training - Batch 1'
    """
    schedule = models.ForeignKey(
        Schedule,
        on_delete=models.CASCADE,
        related_name='refresher_batches'
    )
    batch_number = models.PositiveIntegerField()
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    employees = models.ManyToManyField(
        MasterTable,
        related_name='refresher_batches'
    )

    class Meta:
        unique_together = ('schedule', 'batch_number')
        ordering = ['created_at']

    def __str__(self):
        return self.name



# ==================== Refreshment Training End ======================== #

class StationSetting(models.Model):
    SETTING_CHOICES = [
        ('CTQ', 'CTQ'),
        ('PDI', 'PDI'),
        ('OTHER', 'Other'),
        ('MARU A', 'Maru A'),
        ('CRITICAL', 'Critical'),
    ]

    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='settings')
    option = models.CharField(max_length=10, choices=SETTING_CHOICES)

    def __str__(self):
        return f"{self.station.station_name} ({self.department.department_name}) - {self.get_option_display()}"

    

class TestSession(models.Model):
    test_name = models.CharField(max_length=100)
    key_id = models.CharField(max_length=10, unique=True)
    employee = models.ForeignKey('MasterTable', on_delete=models.CASCADE, db_index=True)
    level = models.ForeignKey('Level', on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    skill = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    question_paper = models.ForeignKey('QuestionPaper', on_delete=models.CASCADE, related_name='test_sessions', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.employee and not self.department:
            self.department = self.employee.department
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.test_name} - {self.employee}"

from django.db.models import JSONField # Import JSONField (Django 3.1+ required)

class Score(models.Model):
    employee = models.ForeignKey('MasterTable', on_delete=models.CASCADE)
    marks = models.IntegerField()
    test = models.ForeignKey('TestSession', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    percentage = models.FloatField(default=0)
    passed = models.BooleanField(default=False)
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)
    level = models.ForeignKey('Level', on_delete=models.SET_NULL, null=True, blank=True)
    skill = models.ForeignKey('Station', on_delete=models.SET_NULL, null=True, blank=True)
    
    raw_answers = JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        # Auto-fill department from employee if not set
        if self.employee and not self.department:
            self.department = self.employee.department
        # Auto-fill level and skill from test session if not set
        if self.test:
            if not self.level and self.test.level:
                self.level = self.test.level
            if not self.skill and self.test.skill:
                self.skill = self.test.skill
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee} - {self.test} ({self.marks} marks)"

class KeyEvent(models.Model):
    base_id = models.IntegerField()
    key_id = models.IntegerField()
    key_sn = models.CharField(max_length=255, default='unknown')
    mode = models.IntegerField()
    timestamp = models.DateTimeField()
    info = models.CharField(max_length=255)
    client_timestamp = models.DateTimeField()
    event_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class ConnectEvent(models.Model):
    base_id = models.IntegerField()
    mode = models.IntegerField()
    info = models.CharField(max_length=255)
    timestamp = models.DateTimeField()




class VoteEvent(models.Model):
    base_id = models.IntegerField()
    mode = models.IntegerField()
    info = models.CharField(max_length=255)
    timestamp = models.DateTimeField()



from django.db import models

class CompanyLogo(models.Model):
    name = models.CharField(max_length=100)  # Optional: Name of the logo (e.g., company name)
    logo = models.ImageField(upload_to='logos/',blank=True,null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return self.name or f"Logo{self.id}"



class RetrainingConfig(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='retraining_configs')
    evaluation_type = models.CharField(
        max_length=20, 
        choices=[
            ('Evaluation', 'Evaluation'),
            ('OJT', 'OJT'),
            ('10 Cycle', '10 Cycle')
        ]
    )
    max_count = models.PositiveIntegerField(default=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('level', 'evaluation_type')

    def _str_(self):
        return f"{self.level.level_name} - {self.evaluation_type} (Max: {self.max_count})"


class RetrainingSession(models.Model):
    employee = models.ForeignKey(MasterTable, on_delete=models.CASCADE, related_name='retraining_sessions')
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='retraining_sessions')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='retraining_sessions')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='retraining_sessions',null=True, blank=True)
    evaluation_type = models.CharField(
        max_length=20, 
        choices=[
            ('Evaluation', 'Evaluation'),
            ('OJT', 'OJT'),
            ('10 Cycle', '10 Cycle')
        ]
    )
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    venue = models.CharField(max_length=128)
    status = models.CharField(max_length=16, choices=[('Pending','Pending'),('Completed','Completed'),('Missed','Missed')], default='Pending')
    attempt_no = models.PositiveIntegerField(default=1)
    performance_percentage = models.FloatField(null=True, blank=True)
    required_percentage = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['employee', 'evaluation_type', 'level', 'department', 'station', 'attempt_no']

    def _str_(self):
        return f"{self.employee.emp_id} - {self.level.level_name}/{self.department.department_name}/{self.station.station_name} - {self.evaluation_type} (Attempt {self.attempt_no})"


class RetrainingSessionDetail(models.Model):
    """Detailed information for each retraining session"""
    retraining_session = models.OneToOneField(
        RetrainingSession, 
        on_delete=models.CASCADE, 
        related_name='session_detail'
    )
    
    observations_failure_points = models.TextField(blank=True, null=True)
    trainer_name = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Detail for {self.retraining_session}"

    class Meta:
        verbose_name = "Retraining Session Detail"
#-----------------------Quantity OJT ----------------------------#

from django.db import models


# ---------------------------
#  Rules for Marks (Image Setup)
# ---------------------------
class QuantityScoreSetup(models.Model):
    """Stores the scoring setup for Production % and Rejections"""
    TYPE_CHOICES = (
        ("production", "Production"),
        ("rejection", "Rejection"),
    )

    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="score_setups")
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="score_setups")

    score_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    min_value = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    max_value = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    marks = models.PositiveIntegerField()

    def _str_(self):
        return f"[{self.department.name} - {self.level.name}] {self.get_score_type_display()} {self.min_value}-{self.max_value} → {self.marks}"


from django.db import models

class AssessmentMode(models.Model):
    MODE_CHOICES = [
        ('quality', 'Quality-Based'),
        ('quantity', 'Quantity-Based'),
    ]
    
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='quality')
    updated_at = models.DateTimeField(auto_now=True)
    
    @classmethod
    def get_current_mode(cls):
        mode, created = cls.objects.get_or_create(id=1, defaults={'mode': 'quality'})
        return mode
    
from django.db.models.signals import post_save
from django.dispatch import receiver

class LevelColour(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="colours")
    colour_code = models.CharField(max_length=20)  # e.g., "#ef4444"

    class Meta:
        unique_together = ('level',) 

    def __str__(self):
        return f"{self.level.level_name} - {self.colour_code}"

DEFAULT_COLOURS = {
    1: "#ef4444",  # red - Level 1
    2: "#f59e0b",  # amber - Level 2
    3: "#3b82f6",  # blue - Level 3
    4: "#10b981",  # emerald - Level 4
}

@receiver(post_save, sender=Level)
def create_default_colour(sender, instance, created, **kwargs):
    """
    Automatically assign a default colour when a new Level is created.
    """
    if created:
        level_id = instance.level_id
        if level_id in DEFAULT_COLOURS:
            if not LevelColour.objects.filter(level=instance).exists():
                LevelColour.objects.create(
                    level=instance, 
                    colour_code=DEFAULT_COLOURS[level_id]
                )

class SkillMatrixDisplaySetting(models.Model):
    # singleton entry for global setting
    display_shape = models.CharField(max_length=20, choices=[('piechart', 'Pie Chart'), ('levelblock', 'Level Block')], default='piechart')

    def __str__(self):
        return f"Display Shape: {self.display_shape}"

    class Meta:
        verbose_name = "Skill Matrix Display Setting"
        verbose_name_plural = "Skill Matrix Display Settings"

class SkillMatrix(models.Model):
    employee = models.ForeignKey("MasterTable", on_delete=models.CASCADE, related_name="skills")
    employee_name = models.CharField(max_length=100)
    emp_id = models.CharField(max_length=50)
    doj = models.DateField()
    level = models.ForeignKey("Level", on_delete=models.CASCADE)
    # link to hierarchy instead of station directly
    hierarchy = models.ForeignKey("HierarchyStructure", on_delete=models.CASCADE, related_name="skill_matrices")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
            station = self.hierarchy.station.station_name if self.hierarchy.station else 'No Station'
            return f"{self.employee_name} - {station} (Level {self.level.level_name})"



from django.db import models
from django.utils import timezone

class Notification(models.Model):
    """
    Comprehensive notification model for real-time notifications
    Tracks all system events and user interactions
    """
    NOTIFICATION_TYPES = [
        ('employee_registration', 'Employee Registration'),
        ('level_exam_completed', 'Level Exam Completed'),
        ('training_added', 'Training Added'),
        ('training_updated', 'Training Updated'),
        ('training_scheduled', 'Training Scheduled'),
        ('training_completed', 'Training Completed'),
        ('training_reschedule', 'Training Reschedule'),
        ('refresher_training_scheduled', 'Refresher Training Scheduled'),
        ('refresher_training_completed', 'Refresher Training Completed'),
        ('hanchou_exam_completed', 'Hanchou Exam Completed'),
        ('shokuchou_exam_completed', 'Shokuchou Exam Completed'),
        ('ten_cycle_evaluation_completed', '10 Cycle Evaluation Completed'),
        ('ojt_completed', 'OJT Completed'),
        ('ojt_quantity_completed', 'OJT Quantity Completed'),
        ('machine_allocated', 'Machine Allocated'),
        ('test_assigned', 'Test Assigned'),
        ('evaluation_completed', 'Evaluation Completed'),
        ('retraining_scheduled', 'Retraining Scheduled'),
        ('retraining_completed', 'Retraining Completed'),
        ('human_body_check_completed', 'Human Body Check Completed'),
        ('milestone_reached', 'Milestone Reached'),
        ('system_alert', 'System Alert'),
        ('multiskilling_scheduled', 'Multiskilling Scheduled'),
        ('multiskilling_completed', 'Multiskilling Completed'),
        ('skill_matrix_updated', 'Skill Matrix Updated'),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)

    # Recipients
    recipient = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    recipient_email = models.EmailField(null=True, blank=True)

    # Related objects
    employee = models.ForeignKey('MasterTable', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    level = models.ForeignKey('Level', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    training_schedule = models.ForeignKey('Schedule', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    machine_allocation = models.ForeignKey('MachineAllocation', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    test_session = models.ForeignKey('TestSession', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    retraining_session = models.ForeignKey('RetrainingSession', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    human_body_check_session = models.ForeignKey('HumanBodyCheckSession', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')

    # Status tracking
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    # Additional metadata
    metadata = models.JSONField(default=dict, blank=True)
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ], default='medium')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.recipient or self.recipient_email}"

    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

    def mark_as_unread(self):
        """Mark notification as unread"""
        if self.is_read:
            self.is_read = False
            self.read_at = None
            self.save(update_fields=['is_read', 'read_at'])

# In models.py

# class HandoverSheet(models.Model):
#     employee = models.OneToOneField(MasterTable, on_delete=models.CASCADE)  # ensures only one per employee
#     industrial_experience = models.CharField(max_length=255, blank=True, null=True)
#     kpapl_experience = models.CharField(max_length=255, blank=True, null=True)
#     required_department_at_handover = models.CharField(max_length=255,  blank=True, null=True)
#     distributed_department_after_dojo = models.ForeignKey(Department, on_delete=models.CASCADE)
#     allocated_line = models.ForeignKey(
#         'Line',  # Make sure you have a 'Line' model defined in this file
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         help_text="The specific line within the department the employee was allocated to during this handover."
#     )

#     allocated_station = models.ForeignKey(
#         'Station',  # Make sure you have a 'Station' model defined in this file
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         help_text="The specific station the employee was allocated to during this handover."
#     )
#     handover_date = models.DateField( blank=True, null=True)
#     contractor_name = models.CharField(max_length=255, blank=True, null=True)
#     p_and_a_name = models.CharField(max_length=255,blank=True, null=True)
#     qa_hod_name = models.CharField(max_length=255, blank=True, null=True)
#     is_training_completed = models.BooleanField(default=False)
#     gojo_incharge_name = models.CharField(max_length=255, blank=True, null=True)

#     def __str__(self):
#         return f"Handover for {self.employee.emp_id}"




from django.db import models
from django.conf import settings  # Import settings to refer to the User model securely

class HandoverSheet(models.Model):
    employee = models.OneToOneField(MasterTable, on_delete=models.CASCADE)
    
    # --- Existing Fields Preserved ---
    required_department_at_handover = models.CharField(max_length=255, blank=True, null=True)
    distributed_department_after_dojo = models.ForeignKey(Department, on_delete=models.CASCADE)
    
    allocated_line = models.ForeignKey(
        'Line',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The specific line within the department the employee was allocated to during this handover."
    )

    allocated_subline = models.ForeignKey(
        'SubLine',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The specific subline within the department the employee was allocated to during this handover."
    )

    allocated_station = models.ForeignKey(
        'Station',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The specific station the employee was allocated to during this handover."
    )
    
    handover_date = models.DateField(blank=True, null=True)
    is_training_completed = models.BooleanField(default=False)
    gojo_incharge_name = models.CharField(max_length=255, blank=True, null=True)

    # --- New Field: Assigning To ---
    # This links directly to your User table. 
    # We use settings.AUTH_USER_MODEL to strictly refer to your active Custom User model.
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_handovers',
        help_text="The System User (Supervisor/Manager) to whom this employee is assigned."
    )

    def __str__(self):
        return f"Handover for {self.employee.emp_id}"


class TrainingTopic(models.Model):
    topic_name = models.CharField(max_length=200)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="training_topics",default='')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name="training_topics",default='')
    
    def __str__(self):
        return f"{self.topic_name} ({self.level.level_name} - {self.station.station_name})"



class LevelWiseTrainingContent(models.Model):
    topic = models.ForeignKey(
        TrainingTopic,
        on_delete=models.CASCADE,
        related_name="contents",
        null=True,          # optional
        blank=True          # optional
    )
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="training_contents")
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name="training_contents")
    content_name = models.CharField(max_length=200)
    file = models.FileField(upload_to="training_files/", null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return f"{self.content_name} ({self.level.level_name} - {self.station.station_name})"
    



import uuid
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver








class DailyProductionData(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    entry_mode = models.CharField(
        max_length=10,
        choices=[('DAILY', 'Daily'), ('WEEKLY', 'Weekly'), ('MONTHLY', 'Monthly')],
        default='DAILY'
    )
    batch_id = models.UUIDField(default=uuid.uuid4, editable=False)

    Hq = models.ForeignKey(Hq, on_delete=models.CASCADE, null=True, blank=True)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, null=True, blank=True)
    subline = models.ForeignKey(SubLine, on_delete=models.CASCADE, null=True, blank=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=True, blank=True)

    
    total_production_plan = models.PositiveIntegerField(default=0)
    total_production_actual = models.PositiveIntegerField(default=0)
    
    
    total_operators_available = models.PositiveIntegerField(
        default=0,
        help_text="The total operators on payroll at the start of this period (Starting Team)"
    )
    total_operators_required_plan = models.PositiveIntegerField(default=0, help_text="Operators We NEED (Plan)")
    total_operators_required_actual = models.PositiveIntegerField(default=0)

    attrition_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, help_text="e.g., 2.0 for 2%")
    absenteeism_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, help_text="e.g., 5.5 for 5.5%")

   
    ctq_plan_l1 = models.PositiveIntegerField(default=0)
    ctq_plan_l2 = models.PositiveIntegerField(default=0)
    ctq_plan_l3 = models.PositiveIntegerField(default=0)
    ctq_plan_l4 = models.PositiveIntegerField(default=0)
    ctq_plan_total = models.PositiveIntegerField(default=0, editable=False)
    
    ctq_actual_l1 = models.PositiveIntegerField(default=0)
    ctq_actual_l2 = models.PositiveIntegerField(default=0)
    ctq_actual_l3 = models.PositiveIntegerField(default=0)
    ctq_actual_l4 = models.PositiveIntegerField(default=0)
    ctq_actual_total = models.PositiveIntegerField(default=0, editable=False)

    pdi_plan_l1 = models.PositiveIntegerField(default=0)
    pdi_plan_l2 = models.PositiveIntegerField(default=0)
    pdi_plan_l3 = models.PositiveIntegerField(default=0)
    pdi_plan_l4 = models.PositiveIntegerField(default=0)
    pdi_plan_total = models.PositiveIntegerField(default=0, editable=False)
    
    pdi_actual_l1 = models.PositiveIntegerField(default=0)
    pdi_actual_l2 = models.PositiveIntegerField(default=0)
    pdi_actual_l3 = models.PositiveIntegerField(default=0)
    pdi_actual_l4 = models.PositiveIntegerField(default=0)
    pdi_actual_total = models.PositiveIntegerField(default=0, editable=False)

    other_plan_l1 = models.PositiveIntegerField(default=0)
    other_plan_l2 = models.PositiveIntegerField(default=0)
    other_plan_l3 = models.PositiveIntegerField(default=0)
    other_plan_l4 = models.PositiveIntegerField(default=0)
    other_plan_total = models.PositiveIntegerField(default=0, editable=False)
    
    other_actual_l1 = models.PositiveIntegerField(default=0)
    other_actual_l2 = models.PositiveIntegerField(default=0)
    other_actual_l3 = models.PositiveIntegerField(default=0)
    other_actual_l4 = models.PositiveIntegerField(default=0)
    other_actual_total = models.PositiveIntegerField(default=0, editable=False)

    bifurcation_plan_l1 = models.PositiveIntegerField(default=0, editable=False)
    bifurcation_plan_l2 = models.PositiveIntegerField(default=0, editable=False)
    bifurcation_plan_l3 = models.PositiveIntegerField(default=0, editable=False)
    bifurcation_plan_l4 = models.PositiveIntegerField(default=0, editable=False)

    bifurcation_actual_l1 = models.PositiveIntegerField(default=0, editable=False)
    bifurcation_actual_l2 = models.PositiveIntegerField(default=0, editable=False)
    bifurcation_actual_l3 = models.PositiveIntegerField(default=0, editable=False)
    bifurcation_actual_l4 = models.PositiveIntegerField(default=0, editable=False)

    
    grand_total_plan = models.PositiveIntegerField(default=0, editable=False)
    grand_total_actual = models.PositiveIntegerField(default=0, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_date']

    def __str__(self):
        # Updated to show the new date range for clarity in Django Admin
        if self.start_date == self.end_date:
            return f"{self.start_date} (Daily) - {self.line.line_name if self.line else 'N/A'}"
        return f"{self.start_date} to {self.end_date} - {self.line.line_name if self.line else 'N/A'}"




@receiver(pre_save, sender=DailyProductionData)
def calculate_totals_on_save(sender, instance, **kwargs):
    """
    This function automatically calculates all production totals before saving.
    The complex operator gap logic is now handled in the view.
    """
    # 1. Calculate Department Totals
    instance.ctq_plan_total = instance.ctq_plan_l1 + instance.ctq_plan_l2 + instance.ctq_plan_l3 + instance.ctq_plan_l4
    instance.ctq_actual_total = instance.ctq_actual_l1 + instance.ctq_actual_l2 + instance.ctq_actual_l3 + instance.ctq_actual_l4
    instance.pdi_plan_total = instance.pdi_plan_l1 + instance.pdi_plan_l2 + instance.pdi_plan_l3 + instance.pdi_plan_l4
    instance.pdi_actual_total = instance.pdi_actual_l1 + instance.pdi_actual_l2 + instance.pdi_actual_l3 + instance.pdi_actual_l4
    instance.other_plan_total = instance.other_plan_l1 + instance.other_plan_l2 + instance.other_plan_l3 + instance.other_plan_l4
    instance.other_actual_total = instance.other_actual_l1 + instance.other_actual_l2 + instance.other_actual_l3 + instance.other_actual_l4

    # 2. Calculate Bifurcation Totals from department data
    instance.bifurcation_plan_l1 = instance.ctq_plan_l1 + instance.pdi_plan_l1 + instance.other_plan_l1
    instance.bifurcation_actual_l1 = instance.ctq_actual_l1 + instance.pdi_actual_l1 + instance.other_actual_l1
    instance.bifurcation_plan_l2 = instance.ctq_plan_l2 + instance.pdi_plan_l2 + instance.other_plan_l2
    instance.bifurcation_actual_l2 = instance.ctq_actual_l2 + instance.pdi_actual_l2 + instance.other_actual_l2
    instance.bifurcation_plan_l3 = instance.ctq_plan_l3 + instance.pdi_plan_l3 + instance.other_plan_l3
    instance.bifurcation_actual_l3 = instance.ctq_actual_l3 + instance.pdi_actual_l3 + instance.other_actual_l3
    instance.bifurcation_plan_l4 = instance.ctq_plan_l4 + instance.pdi_plan_l4 + instance.other_plan_l4
    instance.bifurcation_actual_l4 = instance.ctq_actual_l4 + instance.pdi_actual_l4 + instance.other_actual_l4

    # 3. Calculate Grand Totals
    instance.grand_total_plan = instance.ctq_plan_total + instance.pdi_plan_total + instance.other_plan_total
    instance.grand_total_actual = instance.ctq_actual_total + instance.pdi_actual_total + instance.other_actual_total




class AdvanceManpowerDashboard(models.Model):
    # Direct hierarchy relations
    hq = models.ForeignKey("Hq", on_delete=models.CASCADE, null=True, blank=True)
    factory = models.ForeignKey("Factory", on_delete=models.CASCADE)
    department = models.ForeignKey("Department", on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey("Line", on_delete=models.CASCADE, null=True, blank=True)
    subline= models.ForeignKey("SubLine", on_delete=models.CASCADE, null=True, blank=True)
   
    station = models.ForeignKey("Station", on_delete=models.CASCADE, null=True, blank=True)

    # Time period
    month = models.PositiveSmallIntegerField()  # 1–12
    year = models.PositiveSmallIntegerField()

    # KPIs / Metrics
    total_stations = models.PositiveIntegerField(default=0)
    operators_required = models.PositiveIntegerField(default=0)
    operators_available = models.PositiveIntegerField(default=0)
    buffer_manpower_required = models.PositiveIntegerField(default=0)
    buffer_manpower_available = models.PositiveIntegerField(default=0)
    l1_required= models.PositiveIntegerField(default=0)
    l1_available= models.PositiveIntegerField(default=0)
    l2_required= models.PositiveIntegerField(default=0)
    l2_available= models.PositiveIntegerField(default=0)
    l3_required= models.PositiveIntegerField(default=0)
    l3_available= models.PositiveIntegerField(default=0)
    l4_required= models.PositiveIntegerField(default=0)
    l4_available= models.PositiveIntegerField(default=0)


    attrition_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)   # %
    absenteeism_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
     # %

    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "advance_manpower_dashboard"
        unique_together = ("hq", "factory", "department", "line", "subline", "station", "month", "year")

    def __str__(self):
        return f"{self.factory} - {self.month}/{self.year}"




class ManagementReview(models.Model):

    hq = models.ForeignKey("Hq", on_delete=models.CASCADE, null=True, blank=True)
    factory = models.ForeignKey("Factory", on_delete=models.CASCADE)
    department = models.ForeignKey("Department", on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey("Line", on_delete=models.CASCADE, null=True, blank=True)
    subline = models.ForeignKey("Subline", on_delete=models.CASCADE, null=True, blank=True)
    station = models.ForeignKey("Station", on_delete=models.CASCADE, null=True, blank=True)


    # Time period
    month = models.PositiveSmallIntegerField()  # 1–12
    year = models.PositiveSmallIntegerField()

    new_operators_joined = models.IntegerField()
    new_operators_trained = models.IntegerField()
    total_training_plans = models.IntegerField()
    total_trainings_actual = models.IntegerField()
    total_defects_msil = models.IntegerField()
    ctq_defects_msil = models.IntegerField()
    total_defects_tier1 = models.IntegerField()
    ctq_defects_tier1 = models.IntegerField()
    total_internal_rejection = models.IntegerField()
    ctq_internal_rejection = models.IntegerField()

    unique_together = (
            "hq", "factory", "department", "line", "subline", "station", "month", "year"
        )
    def __str__(self):
        return f"{self.factory} - {self.month}/{self.year}"
    


class CTQandPDIdepartment(models.Model):
    CtqPdi_id = models.AutoField(primary_key=True)
    CtqPdi_name = models.CharField(max_length=100) # e.g., "CTQ", "PDI", "Combined Quality"
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='ctq_pdi_departments', null=True, blank=True)

    def __str__(self):
        # A more robust __str__ method that handles if factory is not set
        factory_info = self.factory.factory_name if self.factory else "No Factory"
        return f"{self.CtqPdi_name} ({factory_info})"

    class Meta:
        db_table = 'CtqPdi'
        unique_together = ('CtqPdi_name', 'factory')



class ManagementReviewCTQandPDI(models.Model):
    # Foreign Key to link this review to a specific department
    REVIEW_TYPE_CHOICES = [
        ('CTQ', 'CTQ'),
        ('PDI', 'PDI'),
        ('OTHER', 'Other'),
        ('MARU A', 'Maru A'),
        ('CRITICAL', 'Critical'),
        ('TOTAL', 'Total (Auto-Aggregated)'), # <-- ✨ ADD THIS LINE
    ]
   
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    review_type = models.CharField(
        max_length=10, 
        choices=REVIEW_TYPE_CHOICES
    )
    # The rest of your fields
    month_year = models.DateField()
    new_operators_joined = models.IntegerField()
    new_operators_trained = models.IntegerField()
    defects_msil = models.IntegerField()
    defects_tier1 = models.IntegerField()
    internal_rejection = models.IntegerField()
    training_plan = models.IntegerField(null=True, blank=True)
    training_actual = models.IntegerField(null=True, blank=True)
    

   
    def __str__(self):
        return f"{self.department.department_name} - {self.get_review_type_display()} - {self.month_year.strftime('%b %Y')}"

    class Meta:
        # This is CRITICAL. It allows you to have a CTQ, a PDI, etc.,
        # for the same department and month, but prevents duplicates.
        unique_together = ('department', 'month_year', 'review_type')

    
class UserManualdocs(models.Model):
    name = models.CharField(max_length=255, help_text="Content name/title")
    file = models.FileField(
        upload_to='usermanual_docs/', 
        help_text="Upload document file"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = "Content"
        verbose_name_plural = "Contents"

    def __str__(self):
        return self.name

    @property
    def file_extension(self):
        """Get file extension if file exists"""
        if self.file:
            return os.path.splitext(self.file.name)[1].lower()
        return None

    @property
    def file_size(self):
        """Get file size in bytes if file exists"""
        if self.file:
            try:
                return self.file.size
            except (OSError, ValueError):
                return 0
        return 0

    def delete(self, *args, **kwargs):
        """Override delete to also remove the file from storage"""
        if self.file:
            # Delete the file from storage when the model instance is deleted
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)




class EvaluationPassingCriteria(models.Model):
    level = models.ForeignKey("Level", on_delete=models.CASCADE, related_name="passing_criteria")
    department = models.ForeignKey("Department", on_delete=models.CASCADE, related_name="passing_criteria")
    percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Required percentage (e.g., 75.00)")

    class Meta:
        unique_together = ("level", "department")  # Prevent duplicate criteria for same level & department
        verbose_name_plural = "Evaluation Passing Criteria"

    def __str__(self):
        return f"{self.level.level_name} - {self.department.department_name}: {self.percentage}%"


# ==================== TrainingBatch ======================== #
    

from django.db import models
from django.utils.timezone import now

class MultiSkilling(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    employee = models.ForeignKey("MasterTable", on_delete=models.CASCADE, related_name="multi_skills")
    emp_id = models.CharField(max_length=20, blank=True)
    employee_name = models.CharField(max_length=100, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    department_name = models.CharField(max_length=100, blank=True, null=True) 

    department = models.ForeignKey(Department, on_delete=models.CASCADE,null=True, blank=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE,null=True, blank=True)
    # hierarchy = models.ForeignKey("HierarchyStructure", on_delete=models.CASCADE, related_name="multi_skills")

    skill_level =  models.ForeignKey(Level, on_delete=models.CASCADE)
    start_date = models.DateField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.employee:
            self.emp_id = self.employee.emp_id
            self.employee_name = f"{self.employee.first_name} {self.employee.last_name}"
            self.date_of_joining = self.employee.date_of_joining
            self.department_name = (
                self.employee.department.department_name if self.employee.department else None
            )
        super().save(*args, **kwargs)

    @property
    def current_status(self):
        today = now().date()
        if self.status == "scheduled" and self.start_date and self.start_date <= today:
            return "in-progress"
        return self.status

    def __str__(self):
        return f"{self.employee_name} - {self.station.station_name if self.station else 'No Station'}"


 # ==================== MultiSkilling End ======================== #
class Machine(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='machines/', null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='machines')
    level = models.IntegerField()
    process = models.ForeignKey(Station,on_delete=models.CASCADE,related_name='stations')  # Skill required
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.name

class MachineAllocation(models.Model):
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    employee = models.ForeignKey(SkillMatrix, on_delete=models.CASCADE)
    allocated_at = models.DateTimeField(auto_now_add=True)
    approval_status = models.CharField(
        max_length=10,
        choices=APPROVAL_STATUS_CHOICES,
        default='pending'
    )

    class Meta:
        # Ensure one allocation per machine-employee pair
        unique_together = ['machine', 'employee']

    # def save(self, *args, **kwargs):

    #     employee_level_value = self.employee.level.level_id
    #     # Auto-determine approval status based on employee level vs machine level
    #     if employee_level_value >= self.machine.level:
    #         self.approval_status = 'approved'
    #     else:
    #         self.approval_status = 'pending'
    #     super().save(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        # Only run this logic on the first save (i.e., when the object is new)
        # This prevents the approval_status from being overwritten by subsequent saves
        if not self.pk:
            employee_level_value = self.employee.level.level_id
            if employee_level_value >= self.machine.level:
                self.approval_status = 'approved'
            else:
                self.approval_status = 'pending'

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.machine.name} → {self.employee.employee_name} ({self.approval_status})"

    @classmethod
    def update_pending_allocations(cls):
        """
        Method to update pending allocations when employee levels change
        Call this when SkillMatrix levels are updated
        """
        pending_allocations = cls.objects.filter(approval_status='pending')
        for allocation in pending_allocations:
            # Fix: Compare actual level values
            employee_level_value = allocation.employee.level.level_id # or level.level_name
            if employee_level_value >= allocation.machine.level:
                allocation.approval_status = 'approved'
                allocation.save()

class TrainingAttendance(models.Model):
    """ Stores daily attendance for each user in a batch. """
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]
    
    user = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, related_name='attendances')
    batch = models.ForeignKey(TrainingBatch, on_delete=models.CASCADE, related_name='attendances', to_field='batch_id')
    day_number = models.ForeignKey(Days, on_delete=models.CASCADE, related_name='day_attendances')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES,default='Absent')
    
    # --- NEW FIELD ---
    # This field will store the actual calendar date the attendance was marked on.
    attendance_date = models.DateField(help_text="The calendar date this attendance was recorded" ,null=True, blank= True)
    
    date_marked = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['batch', 'user', 'day_number']
        # A user can only have one attendance status per day in a given batch.
        unique_together = ('user', 'batch', 'day_number')

    def _str_(self):
        return f"{self.user.first_name} - {self.batch.batch_id} - Day {self.day_number}: {self.status}"
    

class SkillMatrixFeatureFlag(models.Model):
    FEATURE_CHOICES = [
        ("ojt_evaluation", "OJT + Evaluation"),
        ("cycle_evaluation", "10 Cycle + Evaluation"),
        ("quantity_ojt_evaluation", "Quantity OJT + Evaluation"),
    ]

    feature_name = models.CharField(max_length=100, choices=FEATURE_CHOICES, unique=True)
    enabled = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.get_feature_name_display()} → {'ON' if self.enabled else 'OFF'}"


# ================== Station Manager =================================


from django.db import models

# Define choices for minimum_level_required
LEVEL_CHOICES = [
    ('Beginner', 'Beginner'),
    ('Intermediate', 'Intermediate'),
    ('Advanced', 'Advanced'),
    ('Expert', 'Expert'),
]

class StationManager(models.Model):
    department = models.ForeignKey(
        'HierarchyStructure',
        on_delete=models.CASCADE,
        related_name='station_managers_as_department',
        null=True,
        blank=True,
    )
    station = models.ForeignKey(
        'HierarchyStructure',
        on_delete=models.CASCADE,
        related_name='station_managers_as_station',
        null=True,
        blank=True,
    )
    minimum_level_required = models.CharField(max_length=20, choices=LEVEL_CHOICES, null=True, blank=True)
    minimum_operators = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        if self.station:
            return f"Station Manager for {self.station.structure_name}"
        elif self.department:
            return f"Department Manager for {self.department.structure_name}"
        return "Station Manager - Unknown"
    
   

    class Meta:
        db_table = "station_manager"

# ================== Station Manager End =================================


# ================== Biometric Realtime ==================================

class BioUser(models.Model):
    employeeid = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.employeeid} - {self.first_name} {self.last_name}"
    
# ================== Biometric Realtime End ==================================


#================== BiometricAttendance ==================#

from django.db import models

from django.db import models


from django.db import models

class BiometricAttendance(models.Model):
    attendance_date = models.DateField(verbose_name="Attendance Date", null=True, blank=True)

    sr_no = models.IntegerField(verbose_name="Sr.No.", null=True, blank=True)
    pay_code = models.CharField(max_length=50, verbose_name="PayCode", null=True, blank=True)
    card_no = models.CharField(max_length=50, verbose_name="Card No")
    employee_name = models.CharField(max_length=100, verbose_name="Employee Name", null=True, blank=True)
    department = models.CharField(max_length=100, verbose_name="Department", null=True, blank=True)
    designation = models.CharField(max_length=100, verbose_name="Designation", null=True, blank=True)
    shift = models.CharField(max_length=20, verbose_name="Shift", null=True, blank=True)
    
    # Time fields (Start, In, Out look like standard time in the image)
    start = models.TimeField(verbose_name="Start", null=True, blank=True)
    in_time = models.TimeField(verbose_name="In", null=True, blank=True)
    out_time = models.TimeField(verbose_name="Out", null=True, blank=True)
    
    # Changed to CharField because image shows "11.37" (decimal), not "11:37:00" (Time)
    hrs_works = models.CharField(max_length=20, null=True, blank=True, verbose_name="Hrs Works")
    
    status = models.CharField(max_length=20, verbose_name="Status", null=True, blank=True)
    
    # Keeping these as CharField to handle flexible Excel data (floats or strings) safely
    early_arrival = models.CharField(max_length=50, null=True, blank=True, verbose_name="Early Arriv.")
    late_arrival = models.CharField(max_length=50, null=True, blank=True, verbose_name="Late Arriv.")
    shift_early = models.CharField(max_length=50, null=True, blank=True, verbose_name="Shift Early")
    excess_lunch = models.CharField(max_length=50, null=True, blank=True, verbose_name="Excess Lunch")
    ot = models.CharField(max_length=50, null=True, blank=True, verbose_name="Ot")
    ot_amount = models.CharField(max_length=50, null=True, blank=True, verbose_name="Ot Amount")
    
    # --- NEW FIELD ---
    os = models.CharField(max_length=50, null=True, blank=True, verbose_name="Os") 
    
    manual = models.CharField(max_length=100, null=True, blank=True, verbose_name="Manual")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Adjusted unique constraint if needed, otherwise keep as is
        unique_together = ('card_no', 'attendance_date') 

    def __str__(self):
        return f"{self.employee_name} - {self.attendance_date}"
    
    

class SystemSettings(models.Model):
    excel_source_path = models.CharField(
        max_length=500, 
        verbose_name="Excel Source Path",
        help_text="Folder path where biometric Excel files are placed",
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"

    def __str__(self):
        return f"System Settings (ID: {self.id})"
    
    @property
    def processed_folder_path(self):
        """Returns the Processed folder path based on source path"""
        if self.excel_source_path:
            import os
            return os.path.join(self.excel_source_path, "Processed")
        return None
    
#================== BiometricAttendance End ==================#


#---------------------------------- Method Enable disable  ---------------------------------------#



class StationSheetConfig(models.Model):
    # Configuration identifiers (using IDs instead of names)
    level_id = models.IntegerField(blank=True, null=True)
    department_id = models.IntegerField(blank=True, null=True)
    line_id = models.IntegerField(blank=True, null=True)
    subline_id = models.IntegerField(blank=True, null=True)

    # Station details
    station_id = models.IntegerField()
    
    # Sheet enable flags
    ojt_enabled = models.BooleanField(default=False)
    ten_cycle_enabled = models.BooleanField(default=False)
    skill_evaluation_enabled = models.BooleanField(default=False)
    others_enabled = models.BooleanField(default=False)
    evaluation_enabled = models.BooleanField(default=False)
    maru_a_enabled = models.BooleanField(default=False)

    created_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ("level_id", "department_id", "line_id", "subline_id", "station_id")
        indexes = [
            models.Index(
                fields=["level_id", "department_id", "line_id", "subline_id", "station_id"],
                name="station_config_idx",
            ),
        ]

    def __str__(self):
        return f"Level:{self.level_id} - Dept:{self.department_id} - Line:{self.line_id or '-'} - Subline:{self.subline_id or '-'} - Station:{self.station_id}"

#================== Method Enable disable End ==================#



# STANDARD_A0001(level1revision)
#start  level1revision model
from django.db import models

class Question(models.Model):
    subtopiccontent = models.ForeignKey(
        'SubtopicContent',  # Replace with your actual app name if needed, e.g., 'myapp.SubtopicContent'
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_text = models.TextField(blank=True, null=True)      # Text is optional if image is used
    question_image = models.ImageField(
        upload_to='questions/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.question_text:
            return self.question_text[:50]
        return f"Question {self.id} (Image-based)"


class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )
    option_text = models.CharField(max_length=255, blank=True, null=True)
    option_image = models.ImageField(
        upload_to='options/',
        blank=True,
        null=True
    )
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        text = self.option_text or "Image Option"
        return f"{text} ({'Correct' if self.is_correct else 'Incorrect'})"

# end levelrevision



# ========== notification for handover =============

# models.py
from django.db import models
from django.conf import settings

class HandoverNotification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='handover_alerts')
    message = models.CharField(max_length=255)
    handover_sheet = models.ForeignKey('HandoverSheet', on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient}: {self.message}"




# ========================================================skill evaluation ==================================

class EvaluationLevel2(models.Model):
    """
    Represents a single Skill Evaluation Level 2 event for an employee.
    """

    # --- Status Choices ---
    # Defining choices as class constants is a Django best practice.
    STATUS_PASS = 'Pass'
    STATUS_FAIL = 'Fail'
    STATUS_RE_EVAL_PASS = 'Re-evaluation Pass'
    STATUS_RE_EVAL_FAIL = 'Re-evaluation Fail'
    STATUS_PENDING = 'Pending'

    STATUS_CHOICES = [
        (STATUS_PASS, 'Pass'),
        (STATUS_FAIL, 'Fail'),
        (STATUS_RE_EVAL_PASS, 'Re-evaluation Pass'),
        (STATUS_RE_EVAL_FAIL, 'Re-evaluation Fail'),
        (STATUS_PENDING, 'Pending'),
    ]

    employee = models.ForeignKey(
        MasterTable, 
        on_delete=models.CASCADE,
        related_name='level_two_evaluations'
    )


    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name='skillevaluations',
        default=1
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='skill_evaluations_in_department', # A unique related_name
        null=True,
        blank=True 
    )


    snapshot_full_name = models.CharField(max_length=200, editable=False)
    snapshot_department = models.CharField(max_length=100, editable=False)
    snapshot_designation = models.CharField(max_length=100, editable=False)
    snapshot_date_of_joining = models.DateField(editable=False)

    station_name = models.CharField(max_length=150)
    evaluation_date = models.DateField()
    dojo_incharge_name = models.CharField(max_length=200)
    area_incharge_name = models.CharField(max_length=200)

    total_marks = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

   
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
    )


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def save(self, *args, **kwargs):

        if not self.pk and self.employee:
            self.snapshot_full_name = f"{self.employee.first_name} {self.employee.last_name}"
            self.snapshot_designation = self.employee.designation or 'N/A'
            self.snapshot_date_of_joining = self.employee.date_of_joining
            if self.department:
                self.snapshot_department = self.department.department_name

        super().save(*args, **kwargs)




    class Meta:
        # Enforces that one employee can only have one evaluation per station.
        unique_together = ['employee','department', 'station_name', 'level']
        verbose_name = "Skill Evaluation (Level 2)"
        verbose_name_plural = "Skill Evaluations (Level 2)"

    def __str__(self):
        return f"Evaluation for {self.employee.emp_id} at {self.station_name} on {self.evaluation_date}"


# --- Evaluation Scores Model ---

class EvaluationScore(models.Model):
    """
    Represents a single line item (a single criterion score) within an EvaluationLevel2.
    """

    SCORE_OK = 'O'
    SCORE_NG = 'X'
    SCORE_CHOICES = [
        (SCORE_OK, 'OK'),
        (SCORE_NG, 'Not OK (NG)'),
    ]

    # The link back to the parent evaluation.
    # on_delete=models.CASCADE means if the main evaluation is deleted,
    # all of its associated scores will be deleted as well.
    evaluation = models.ForeignKey(
        EvaluationLevel2,
        on_delete=models.CASCADE,
        related_name='scores' # Allows access via `evaluation.scores.all()`
    )

    # Storing the criteria text here makes the score record self-contained.
    criteria_text = models.TextField()

    initial_score = models.CharField(
        max_length=1,
        choices=SCORE_CHOICES,
        null=True, # Allows the score to be blank
        blank=True
    )

    reevaluation_score = models.CharField(
        max_length=1,
        choices=SCORE_CHOICES,
        null=True,
        blank=True
    )
    
    class Meta:
        verbose_name = "Evaluation Score"
        verbose_name_plural = "Evaluation Scores"

    def __str__(self):
        return f"Score for '{self.criteria_text[:40]}...' on evaluation {self.evaluation.id}"
    
class EvaluationCriterion(models.Model):
    """
    Stores a single evaluation criterion (a question) and links it
    to a specific evaluation level.
    """
    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name='criteria',
        help_text="The evaluation level this criterion belongs to."
    )
    
    # You could also link it to a Department if criteria are
    # department-specific within a level.
    # department = models.ForeignKey(Department, on_delete=models.CASCADE, ...)

    criteria_text = models.TextField(
        help_text="The actual text of the criterion/question."
    )

    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls the order in which criteria appear on the form."
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck this to hide the criterion without deleting it."
    )

    class Meta:
        verbose_name = "Evaluation Criterion"
        verbose_name_plural = "Evaluation Criteria"
        # Order by the level, then by the custom display order
        ordering = ['level', 'display_order']

    def __str__(self):
        # We access the level_name from the related Level object.
        return f"{self.level}: {self.criteria_text[:50]}..."



# ========================================================skill evaluation ==================================




# ======================== ACTION PLAN =======================
# app/models.py
from django.db import models

class ActionItem(models.Model):
    topic = models.CharField(max_length=255)
    subtopic = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()  # Stores the date
    
    def __str__(self):
        return f"{self.topic} - {self.subtopic}"



class ActionItemRejection(models.Model):
    topic = models.CharField(max_length=255)
    subtopic = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()  # Stores the date
    
    def __str__(self):
        return f"{self.topic} - {self.subtopic}"
    
# ============================= END ===================


from django.db import models
import os

class ExamToolFile(models.Model):
    file = models.FileField(upload_to='tool_uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):
        # Auto-delete physical file when DB record is deleted
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)

    def filename(self):
        return os.path.basename(self.file.name)
# ====================minimum level setting for multiskilling ====================

class MultiSkillingConfig(models.Model):
    """Configuration for multiskilling minimum level requirement"""
    minimum_level = models.ForeignKey(
        'Level',  # Use string reference
        on_delete=models.CASCADE,
        to_field='level_id',  # Reference the actual primary key field
        db_column='minimum_level_id',  # Specify the database column name
        help_text="Minimum skill level required for multiskilling eligibility"
    )
    updated_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "MultiSkilling Configuration"
        verbose_name_plural = "MultiSkilling Configurations"
    
    def __str__(self):
        return f"Min Level: {self.minimum_level.level_name}"
    
    @classmethod
    def get_current_config(cls):
        """Get the most recent configuration"""
        return cls.objects.select_related('minimum_level').order_by('-updated_at').first()



# multiskilling time interval setting==================================================================================================

class GlobalSkillTimeInterval(models.Model):
    """Global time interval configuration for all skills"""
    time_interval_days = models.PositiveIntegerField(
        help_text="Time interval in days required before an employee can be assigned a new skill"
    )
    
    is_enabled = models.BooleanField(
        default=True,
        help_text="Whether time interval checking is enabled globally"
    )
    
    updated_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Global Skill Time Interval"
        verbose_name_plural = "Global Skill Time Intervals"
    
    def __str__(self):
        status = "Enabled" if self.is_enabled else "Disabled"
        return f"Global Interval: {self.time_interval_days} days ({status})"
    
    @classmethod
    def get_current_config(cls):
        """Get the most recent configuration"""
        return cls.objects.order_by('-updated_at').first()



class AnimationVideo(models.Model):
    topic = models.CharField(max_length=200)
    video_file = models.FileField(upload_to='videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.topic
