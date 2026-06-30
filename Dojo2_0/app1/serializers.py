
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import CTQandPDIdepartment, DailyProductionData, HumanBodyCheckSession, HumanBodyCheckSheet, HumanBodyQuestions, Level2QuantityOJTEvaluation, LevelColour, ManagementReviewCTQandPDI, MasterTable, OJTLevel2Quantity, RefresherBatch, User, UserRegistration
from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from .models import Hq, Factory, Department, Line, SubLine, Station
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser



# serializers.py
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User, Role

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        if not identifier or not password:
            raise ValidationError({'error': _('Email or employee ID and password are required.')})

        user = (
            User.objects.select_related('role')
            .filter(Q(email__iexact=identifier) | Q(employeeid__iexact=identifier))
            .first()
        )

        if user is None or not user.check_password(password):
            raise ValidationError({'error': _('Invalid email or password.')})

        if not user.is_active:
            raise ValidationError({'error': _('This account is inactive. Please contact support.')})

        # IMPORTANT: only store JSON-serializable primitives in validated_data
        attrs['user_id'] = user.pk
        attrs['email'] = user.email
        attrs['login_identifier'] = identifier
        # store role name instead of Role model instance
        attrs['role_name'] = getattr(user.role, 'name', None)
        return attrs



class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate_refresh_token(self, value):
        if not value:
            raise serializers.ValidationError("Refresh token is required for logout.")
        return value

from rest_framework import serializers
from django.contrib.auth.models import Permission
from .models import PermissionModule, Role, User
from .rbac import RBAC_ACTIONS, RBAC_MODULES, build_permission_codename, normalize_module_slug

class RoleSerializer(serializers.ModelSerializer):
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )
    permissions = serializers.SerializerMethodField(read_only=True)
    user_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'is_active', 'created_at', 'updated_at', 'permissions', 'permission_ids', 'user_count']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_permissions(self, obj):
        role_permissions = {
            permission.codename: permission
            for permission in obj.permissions.filter(content_type__app_label='app1').select_related('content_type')
        }
        serialized_permissions = []

        for module_slug, config in RBAC_MODULES.items():
            item = {
                'module_slug': module_slug,
                'module_name': config['name'],
            }
            for action in RBAC_ACTIONS.keys():
                item[action] = build_permission_codename(module_slug, action) in role_permissions
            serialized_permissions.append(item)

        return serialized_permissions

    def get_user_count(self, obj):
        return obj.users.count()

    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        role = super().create(validated_data)
        if permission_ids:
            role.permissions.set(Permission.objects.filter(id__in=permission_ids))
        return role

    def update(self, instance, validated_data):
        permission_ids = validated_data.pop('permission_ids', None)
        role = super().update(instance, validated_data)
        if permission_ids is not None:
            role.permissions.set(Permission.objects.filter(id__in=permission_ids))
        return role


class PermissionModuleSerializer(serializers.ModelSerializer):
    available_permissions = serializers.SerializerMethodField()

    class Meta:
        model = PermissionModule
        fields = ['id', 'slug', 'name', 'description', 'sort_order', 'is_active', 'available_permissions']

    def get_available_permissions(self, obj):
        module_slug = normalize_module_slug(obj.slug)
        codenames = [build_permission_codename(module_slug, action) for action in RBAC_ACTIONS.keys()]
        permissions = Permission.objects.filter(
            content_type__app_label='app1',
            codename__in=codenames,
        ).order_by('codename')
        return [
            {
                'id': permission.id,
                'codename': permission.codename,
                'name': permission.name,
            }
            for permission in permissions
        ]


class UserRBACSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='role.name', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'employeeid', 'first_name', 'last_name',
            'role', 'designation', 'business_unit', 'department',
            'section', 'hq', 'line', 'subline', 'factory', 'status',
            'is_active', 'permissions',
        ]

    def get_permissions(self, obj):
        return obj.get_accessible_modules()


# import threading  # <--- THIS WAS MISSING. YOU MUST ADD THIS LINE.
# class RegisterSerializer(serializers.ModelSerializer):
#     # Field definitions
#     role = serializers.CharField(required=True, error_messages={'blank': 'System Role is required.'})
#     password = serializers.CharField(write_only=True, required=True)
#     designation = serializers.CharField(required=False, allow_blank=True)
#     department = serializers.CharField(required=True, error_messages={'blank': 'Department is required.'})
#     section = serializers.CharField(required=False, allow_blank=True)
#     last_name = serializers.CharField(required=False, allow_blank=True)
#     business_unit = serializers.CharField(required=True, error_messages={'blank': 'Business Unit is required.'})
#     hq = serializers.CharField(required=True, error_messages={'required': 'HQ Location is mandatory.', 'blank': 'HQ Location cannot be blank.'})

#     # Validation Logic
#     def validate_role(self, value):
#         try:
#             role = Role.objects.get(name=value, is_active=True)
#         except Role.DoesNotExist:
#             raise ValidationError(f"Role '{value}' does not exist or is not active.")
#         return value
    
    
#     def validate(self, data):
#         # 1. Custom Check: Ensure Business Unit is not empty string
#         if not data.get('business_unit'):
#              raise serializers.ValidationError({"business_unit": "Business Unit cannot be empty."})

#         # 2. Custom Check: Ensure Department is not empty string
#         if not data.get('department'):
#              raise serializers.ValidationError({"department": "Department cannot be empty."})
    
#     def validate(self, data):
#         line = data.get('line')
#         subline = data.get('subline')
#         if subline and not line:
#             raise serializers.ValidationError({
#                 "line": "You must select a Line before assigning a Subline."
#             })
#         return data

#     # === THE EMAIL LOGIC IS HERE ===
#     def create(self, validated_data):
#         # 1. Extract Role and Password
#         role_name = validated_data.pop('role')
#         role = Role.objects.get(name=role_name, is_active=True)
        
#         raw_password = validated_data.pop('password')
        
#         # 2. Create User
#         user = User.objects.create_user(
#             role=role,
#             password=raw_password,
#             **validated_data
#         )

#         # 3. Define the Email Task
#         def send_welcome_email():
#             try:
#                 subject = 'Account Created - Dojo LMS Login Details'
#                 email_body = f"""
# Hello {user.first_name},

# Welcome to the VTrain LMS Platform. Your account has been created by the administrator.

# Here are your login credentials:
# --------------------------------------------------
# Username: {user.email}
# Password: {raw_password}
# --------------------------------------------------

# Best Regards,
# Admin Team
#                 """
#                 print(f"--- [Background] Sending email to {user.email} ---")
#                 send_mail(
#                     subject,
#                     email_body,
#                     settings.DEFAULT_FROM_EMAIL,
#                     [user.email], 
#                     fail_silently=False,
#                 )
#                 print("--- [Background] Email Sent Successfully ---")
#             except Exception as e:
#                 print(f"!!! EMAIL ERROR: {str(e)}")

#         # 4. Start the Email Task in a Background Thread
#         # This allows the API to return "Success" IMMEDIATELY without waiting for email
#         email_thread = threading.Thread(target=send_welcome_email)
#         email_thread.start()

#         return user

#     class Meta:
#         model = User
#         fields = [
#             'email', 'employeeid', 'first_name', 'last_name', 
#             'role', 'password', 'hq', 'business_unit', 'department', 
#             'section', 'designation', 'line', 'subline', 'factory'
#         ]

import threading
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings
from .models import Role, User

class RegisterSerializer(serializers.ModelSerializer):
    # --- Field Definitions ---
    role = serializers.CharField(required=True, error_messages={'blank': 'System Role is required.'})
    password = serializers.CharField(write_only=True, required=True)
    designation = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=True, error_messages={'blank': 'Department is required.'})
    section = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    business_unit = serializers.CharField(required=True, error_messages={'blank': 'Business Unit is required.'})
    hq = serializers.CharField(required=True, error_messages={'required': 'HQ Location is mandatory.', 'blank': 'HQ Location cannot be blank.'})

    class Meta:
        model = User
        fields = [
            'id', 'email', 'employeeid', 'first_name', 'last_name', 
            'role', 'password', 'hq', 'business_unit', 'department', 
            'section', 'designation', 'line', 'subline', 'factory'
        ]

    # --- Validation Logic ---
    def validate_role(self, value):
        try:
            Role.objects.get(name=value, is_active=True)
        except Role.DoesNotExist:
            raise ValidationError(f"Role '{value}' does not exist or is not active.")
        return value

    def validate_email(self, value):
        return value.strip().lower()
    
    def validate(self, data):
        if not data.get('business_unit'):
             raise serializers.ValidationError({"business_unit": "Business Unit cannot be empty."})
        if not data.get('department'):
             raise serializers.ValidationError({"department": "Department cannot be empty."})
        
        # Line/Subline Logic
        line = data.get('line')
        subline = data.get('subline')
        if subline and not line:
            raise serializers.ValidationError({
                "line": "You must select a Line before assigning a Subline."
            })
        return data

    # --- Background Email Task ---
    @staticmethod
    def send_welcome_email_task(email, first_name, raw_password):
        """
        Runs in a background thread.
        Uses fail_silently=True to ensure the thread doesn't crash 
        if the SMTP server is slow or unreachable.
        """
        try:
            subject = 'Account Created - Dojo LMS Login Details'
            email_body = f"""
Hello {first_name},

Welcome to the VTrain LMS Platform. Your account has been created by the administrator.

Here are your login credentials:
--------------------------------------------------
Username: {email}
Password: {raw_password}
--------------------------------------------------

Best Regards,
Admin Team
            """
            # fail_silently=True is crucial for speed/stability in threads
            send_mail(
                subject,
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [email], 
                fail_silently=True, 
            )
        except Exception as e:
            # Log error internally, do not expose to user
            print(f"!!! EMAIL BACKGROUND ERROR: {str(e)}")

    # --- Create Method ---
    def create(self, validated_data):
        # 1. Extract Role and Password
        role_name = validated_data.pop('role')
        role = Role.objects.get(name=role_name, is_active=True)
        
        raw_password = validated_data.pop('password')
        
        # 2. Create User (Database Operation)
        user = User.objects.create_user(
            role=role,
            password=raw_password,
            **validated_data
        )

        # 3. Trigger Background Email after commit
        def trigger_welcome_email():
            try:
                from .tasks import send_welcome_email_task

                send_welcome_email_task.delay(user.email, user.first_name, raw_password)
            except Exception:
                email_thread = threading.Thread(
                    target=RegisterSerializer.send_welcome_email_task,
                    args=(user.email, user.first_name, raw_password)
                )
                email_thread.daemon = True
                email_thread.start()

        transaction.on_commit(trigger_welcome_email)

        return user
    
from rest_framework import serializers
from .models import Level, Days, SubTopic, SubTopicContent, TrainingContent, Evaluation


class UserRegistrationSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=False, allow_blank=True, allow_null=True)
    lastName = serializers.CharField(source='last_name', required=False, allow_blank=True, allow_null=True)
    phoneNumber = serializers.CharField(source='phone_number', required=False, allow_blank=True, allow_null=True)
    emergency_phone_number = serializers.CharField(required=False)

    tempId = serializers.CharField(source='temp_id', read_only=True)
    aadharNumber = serializers.CharField(source='aadhar_number', required=False, allow_null=True, allow_blank=True)
    hasExperience = serializers.BooleanField(source='experience', default=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False, allow_null=True)
    companyOfExperience = serializers.CharField(source='company_of_experience', required=False, allow_null=True, allow_blank=True)
    dateOfBirth = serializers.DateField(source='date_of_birth', required=False, allow_null=True)


    dateOfJoining = serializers.DateField(source='date_of_joining', required=False, allow_null=True)
    employeeId = serializers.CharField(source='employee_Id', required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = UserRegistration
        fields = [
            'id', 'firstName', 'lastName', 'tempId', 'email', 'phoneNumber','emergency_phone_number', 'sex',
            'created_at', 'updated_at', 'is_active', 'photo','aadharNumber', 'employment_type', 'hasExperience',
            'experienceYears', 'companyOfExperience', 'dateOfJoining', 'employeeId', 'dateOfBirth'
        ]

        read_only_fields = ('id', 'tempId', 'batch_id', 'created_at', 'updated_at', 'is_active')
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True},
            'email': {'required': False, 'allow_null': True},
            'employment_type': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def _handle_empty_strings(self, validated_data):
        """Helper to convert empty strings to None for optional fields."""
        for field in ['email', 'aadhar_number', 'employment_type', 'company_of_experience']:
            if field in validated_data and validated_data[field] == '':
                validated_data[field] = None
        return validated_data

    def create(self, validated_data):
        """Handle creation, ensuring empty strings are converted to None."""
        validated_data = self._handle_empty_strings(validated_data)
        return UserRegistration.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """Handle update, ensuring empty strings are converted to None."""
        validated_data = self._handle_empty_strings(validated_data)
        # Use the default update logic from the parent class
        return super().update(instance, validated_data)

    
    def validate(self, data):
        """
        Custom validation for cross-field dependencies.
        This runs on both create and update.
        """
        # Get the current value of 'experience' from the incoming data, or from the
        # existing model instance if this is a partial update (PATCH).
        experience = data.get('experience', getattr(self.instance, 'experience', False))
        
        # We need the values for experienceYears and companyOfExperience from the incoming data
        experience_years = data.get('experience_years')
        company_of_experience = data.get('company_of_experience')

        if experience:
            # If experience is true, we need to check the related fields.
            # On PATCH, a user might not be sending these fields, so we also check the existing instance.
            final_experience_years = experience_years or getattr(self.instance, 'experience_years', None)
            final_company_of_experience = company_of_experience or getattr(self.instance, 'company_of_experience', None)

            if not final_experience_years:
                raise serializers.ValidationError({
                    'experienceYears': 'Experience years is required when hasExperience is true.'
                })
            if not final_company_of_experience:
                raise serializers.ValidationError({
                    'companyOfExperience': 'Company of experience is required when hasExperience is true.'
                })
        
        # All model-level validators (for name, phone, aadhar) will be run automatically.
        return data



# STANDARD DOJO J0001(DATEOFJOINING AND EMPLOYEEID)

class UserUpdateSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    phoneNumber = serializers.CharField(source='phone_number')
    emergency_phone_number = serializers.CharField(required=False)
    tempId = serializers.CharField(source='temp_id')  
    aadharNumber = serializers.CharField(source='aadhar_number', required=False, allow_null=True, allow_blank=True)
    hasExperience = serializers.BooleanField(source='experience', required=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False, allow_null=True)
    companyOfExperience = serializers.CharField(source='company_of_experience', required=False, allow_null=True, allow_blank=True)


    dateOfJoining = serializers.DateField(source='date_of_joining', required=False, allow_null=True)
    employeeId = serializers.CharField(source='employee_Id', required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = UserRegistration
        fields = [
            'id', 'firstName', 'lastName', 'tempId', 'email', 'phoneNumber','emergency_phone_number', 'sex',
            'created_at', 'updated_at', 'is_active', 'photo',
            'aadharNumber', 'employment_type', 'hasExperience',
            'experienceYears', 'companyOfExperience'
        ]
        extra_kwargs = {
            'email': {'required': False, 'allow_null': True},
            'department': {'required': False, 'allow_null': True, 'allow_blank': True},
            'phoneNumber': {'required': False},
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'is_active': {'read_only': True},
        }

    def validate(self, data):
        """
        Validate that experience fields are provided when experience is True
        """
        experience = data.get('experience', self.instance.experience if self.instance else False)
        experience_years = data.get('experience_years', self.instance.experience_years if self.instance else None)
        company_of_experience = data.get('company_of_experience', self.instance.company_of_experience if self.instance else None)

        if experience:
            if not experience_years:
                raise serializers.ValidationError({
                    'experienceYears': 'Experience years is required when experience is selected.'
                })
            if not company_of_experience:
                raise serializers.ValidationError({
                    'companyOfExperience': 'Company of experience is required when experience is selected.'
                })

        # Validate Aadhar number format if provided
        aadhar_number = data.get('aadhar_number')
        if aadhar_number and len(aadhar_number) != 12:
            raise serializers.ValidationError({
                'aadharNumber': 'Aadhar number must be exactly 12 digits.'
            })

        return data


# Level 0

class HumanBodyQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumanBodyQuestions
        fields = '__all__'


class HumanBodyCheckSheetSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    
    class Meta:
        model = HumanBodyCheckSheet
        fields = ['id', 'question', 'question_text', 'answer']


class HumanBodyCheckSessionSerializer(serializers.ModelSerializer):
    sheet_answers = HumanBodyCheckSheetSerializer(many=True, read_only=True)
    overall_status = serializers.ReadOnlyField()

    class Meta:
        model = HumanBodyCheckSession
        fields = ['id', 'temp_id', 'created_at', 'sheet_answers', 'overall_status','remarks']
        


class UserWithBodyCheckSerializer(serializers.ModelSerializer):
    body_checks = serializers.SerializerMethodField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()
    emergency_phone_number = serializers.CharField() 
    # ... other fields remain the same ...
    aadharNumber = serializers.CharField(source='aadhar_number', required=False, allow_null=True, allow_blank=True)
    hasExperience = serializers.BooleanField(source='experience', default=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False, allow_null=True)
    companyOfExperience = serializers.CharField(source='company_of_experience', required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = UserRegistration
        fields = [
            'first_name', 'last_name', 'temp_id', 'email', 'phone_number', 'emergency_phone_number',
            'sex', 'created_at', 'is_active', 'photo','aadharNumber', 'employment_type', 'hasExperience',
            'experienceYears', 'companyOfExperience', 'body_checks','is_added_to_master', 'added_to_master_at'
        ]

    def get_body_checks(self, obj):
        latest_session = HumanBodyCheckSession.objects.filter(user=obj).order_by('-created_at').first()
        if not latest_session:
            latest_session = HumanBodyCheckSession.objects.filter(temp_id=obj.temp_id).order_by('-created_at').first()
        
        if not latest_session:
            return []

        # --- LOGIC CHANGE START ---
        # Determine the final status to send to frontend
        final_status = latest_session.overall_status

        # If user is added to master, override the status to 'added'
        if obj.is_added_to_master:
            final_status = 'added'
        # --- LOGIC CHANGE END ---
        
        return [{
            'id': latest_session.id,
            'temp_id': obj.temp_id,
            'check_date': latest_session.created_at,
            'overall_status': final_status, # Use the computed status here
        }]




# ------------------ TrainingContent Serializer ------------------
from rest_framework import serializers
from .models import Level, Days, SubTopic, SubTopicContent, TrainingContent, Evaluation

class TrainingContentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="trainingcontent_id", read_only=True)
    training_file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = TrainingContent
        fields = [
            "id",
            "trainingcontent_id",
            "subtopiccontent",
            "description",
            "training_file",
            "url_link",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.training_file:
            request = self.context.get("request")
            url = instance.training_file.url
            rep["training_file"] = request.build_absolute_uri(url) if request else url
        else:
            rep["training_file"] = None
        return rep

    def validate(self, attrs):
        if self.instance is None and not (attrs.get("training_file") or attrs.get("url_link")):
            raise serializers.ValidationError("Provide either training_file or url_link.")
        return attrs

class SubTopicContentSerializer(serializers.ModelSerializer):
    training_contents = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SubTopicContent
        fields = ["subtopiccontent_id", "subtopic", "content", "training_contents"]

    def get_training_contents(self, obj):
        request = self.context.get("request")
        return TrainingContentSerializer(obj.training_contents.all(), many=True, context={"request": request}).data

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ["evaluation_id", "evaluation_text"]

class SubTopicSerializer(serializers.ModelSerializer):
    contents = SubTopicContentSerializer(many=True)
    evaluations = EvaluationSerializer(many=True)
    days_id = serializers.IntegerField(write_only=True)  # Accept days_id in JSON
    level_id = serializers.IntegerField(write_only=True)  # Accept level_id in JSON
     
    class Meta:
        model = SubTopic
        fields = ["subtopic_id", "subtopic_name", "days_id", "level_id", "contents", "evaluations"]
     
    def create(self, validated_data):
        contents_data = validated_data.pop("contents", [])
        evaluations_data = validated_data.pop("evaluations", [])
        days_id = validated_data.pop("days_id")
        level_id = validated_data.pop("level_id")
                 
        # Get the Days and Level objects
        days_obj = Days.objects.get(days_id=days_id)
        level_obj = Level.objects.get(level_id=level_id)
        subtopic = SubTopic.objects.create(days=days_obj, level=level_obj, **validated_data)
         
        for content_data in contents_data:
            training_contents_data = content_data.pop("training_contents", [])
            subtopic_content = SubTopicContent.objects.create(subtopic=subtopic, **content_data)
            for tc_data in training_contents_data:
                TrainingContent.objects.create(subtopiccontent=subtopic_content, **tc_data)
         
        for eval_data in evaluations_data:
            Evaluation.objects.create(subtopic=subtopic, **eval_data)
         
        return subtopic

class SubTopicListSerializer(serializers.ModelSerializer):
    """Read-only serializer for listing subtopics with related info"""
    id = serializers.IntegerField(source='subtopic_id', read_only=True)
    title = serializers.CharField(source='subtopic_name', read_only=True)
    day = serializers.IntegerField(source='days.days_id', read_only=True)
    day_name = serializers.CharField(source='days.day', read_only=True)
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    
    class Meta:
        model = SubTopic
        fields = ["id", "title", "day", "day_name", "level_name"]

class SubTopicAdminSerializer(serializers.ModelSerializer):
    """Write serializer for admin operations"""
    subtopic_id = serializers.IntegerField(read_only=True)
    days = serializers.PrimaryKeyRelatedField(queryset=Days.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = SubTopic
        fields = ["subtopic_id", "subtopic_name", "days", "level"]

class DaysSerializer(serializers.ModelSerializer):
    subtopics = SubTopicListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Days
        fields = ["days_id", "day", "subtopics"]

class DaysWriteSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), write_only=True)
    days_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Days
        fields = ["days_id", "day", "level"]

class LevelSerializer(serializers.ModelSerializer):
    days = DaysSerializer(many=True, read_only=True)
    subtopics = SubTopicListSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ["level_id", "level_name", "days", "subtopics"]

    def create(self, validated_data):
        days_data = validated_data.pop("days", [])
        subtopics_data = validated_data.pop("subtopics", [])

        # Create Level
        level = Level.objects.create(**validated_data)

        # Create Days first
        created_days = []
        for day_data in days_data:
            day_obj = Days.objects.create(level=level, **day_data)
            created_days.append(day_obj)

        # Create SubTopics directly under level
        for st_data in subtopics_data:
            contents_data = st_data.pop("contents", [])
            evaluations_data = st_data.pop("evaluations", [])
            days_id = st_data.pop("days_id", None)

            # Find the days object from created_days
            days_obj = None
            if days_id:
                days_obj = next((d for d in created_days if d.days_id == days_id), None)
            if not days_obj and created_days:
                days_obj = created_days[0]  # Fallback to first day

            subtopic = SubTopic.objects.create(level=level, days=days_obj, **st_data)

            # SubTopicContents
            for content_data in contents_data:
                training_contents_data = content_data.pop("training_contents", [])
                subtopic_content = SubTopicContent.objects.create(subtopic=subtopic, **content_data)
                for tc_data in training_contents_data:
                    TrainingContent.objects.create(subtopiccontent=subtopic_content, **tc_data)

            # Evaluations
            for eval_data in evaluations_data:
                Evaluation.objects.create(subtopic=subtopic, **eval_data)

        return level



# ------------------ Master Table Serializer ------------------
class MasterTableSerializer(serializers.ModelSerializer):
    # Read-only field to show department name in GET responses
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = MasterTable
        fields = [
            'emp_id',
            'first_name',
            'last_name',
            'department',        # Use the department ID for POST/PUT
            'department_name',   # Show name in GET
            'date_of_joining',
            'birth_date',
            'sex',
            'email',
            'phone'
        ]



from rest_framework import serializers
from .models import ProductionPlan

class ProductionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlan
        fields = '__all__'

from .models import QuestionPaper, Department, Line, SubLine, Station, Level, TemplateQuestion

# A simple serializer for displaying names in nested objects
class SimpleNameSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        # Dynamically get the 'name' field (e.g., department_name, line_name)
        name_field = [f for f in instance._meta.fields if f.name.endswith('_name')][0].name
        id_field = instance._meta.pk.name
        return {
            'id': getattr(instance, id_field),
            'name': getattr(instance, name_field)
        }

class DepartmentNameSerializer(SimpleNameSerializer):
    class Meta:
        model = Department
        fields = []

class LineNameSerializer(SimpleNameSerializer):
    class Meta:
        model = Line
        fields = []

class SubLineNameSerializer(SimpleNameSerializer):
    class Meta:
        model = SubLine
        fields = []

class StationNameSerializer(SimpleNameSerializer):
    class Meta:
        model = Station
        fields = []
        
class LevelNameSerializer(SimpleNameSerializer):
    class Meta:
        model = Level
        fields = []


# =====================================question paper settings===========================


# The main serializer for the list/detail views
class QuestionPaperSerializer(serializers.ModelSerializer):
    # Use the simple serializers for read-only nested representation
    department = DepartmentNameSerializer(read_only=True)
    line = LineNameSerializer(read_only=True)
    subline = SubLineNameSerializer(read_only=True)
    station = StationNameSerializer(read_only=True)
    level = LevelNameSerializer(read_only=True)

    # Add writable fields for the foreign keys for POST/PUT requests
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True, required=False, allow_null=True
    )
    line_id = serializers.PrimaryKeyRelatedField(
        queryset=Line.objects.all(), source='line', write_only=True, required=False, allow_null=True
    )
    subline_id = serializers.PrimaryKeyRelatedField(
        queryset=SubLine.objects.all(), source='subline', write_only=True, required=False, allow_null=True
    )
    station_id = serializers.PrimaryKeyRelatedField(
        queryset=Station.objects.all(), source='station', write_only=True, required=False, allow_null=True
    )
    level_id = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), source='level', write_only=True
    )

    class Meta:
        model = QuestionPaper
        fields = [
            "question_paper_id",
            "question_paper_name",
            "department",
            "line",
            "subline",
            "station",
            "level",
            "file",
            "created_at",
            "updated_at",
            # Writable FK fields
            "department_id",
            "line_id",
            "subline_id",
            "station_id",
            "level_id",
            # === NEW TIMER FIELDS ===
            "is_timer_enabled",
            "question_duration",
        ]




from rest_framework import serializers
from .models import  StationLevelQuestionPaper


class StationLevelQuestionPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = StationLevelQuestionPaper
        fields = "__all__"


# serializers.py (or wherever TemplateQuestionSerializer lives)

from rest_framework import serializers
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
import base64
import time

from .models import TemplateQuestion
# app1/serializers.py

from rest_framework import serializers
from django.conf import settings
from django.core.files.base import ContentFile
import base64, time

from .models import TemplateQuestion

class TemplateQuestionSerializer(serializers.ModelSerializer):
    # Image fields uploaded as base64 (optional)
    option_a_image_b64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    option_b_image_b64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    option_c_image_b64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    option_d_image_b64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    question_image_b64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    # Read-only image URLs for frontend
    option_a_image_url = serializers.SerializerMethodField(read_only=True)
    option_b_image_url = serializers.SerializerMethodField(read_only=True)
    option_c_image_url = serializers.SerializerMethodField(read_only=True)
    option_d_image_url = serializers.SerializerMethodField(read_only=True)
    question_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TemplateQuestion
        fields = [
            'id',
            'question_paper',

            # L1
            'question',
            'option_a', 'option_a_image', 'option_a_image_url',
            'option_b', 'option_b_image', 'option_b_image_url',
            'option_c', 'option_c_image', 'option_c_image_url',
            'option_d', 'option_d_image', 'option_d_image_url',

            # L2
            'question_lang2',
            'option_a_lang2',
            'option_b_lang2',
            'option_c_lang2',
            'option_d_lang2',

            # Answer
            'correct_answer',
            'correct_index',

            # Question image
            'question_image', 'question_image_url',

            # NEW: archive + order
            'is_active',
            'order',

            # base64 uploads
            'option_a_image_b64',
            'option_b_image_b64',
            'option_c_image_b64',
            'option_d_image_b64',
            'question_image_b64',
        ]
        read_only_fields = ['id']

    # --- image URL helpers (relative URLs) ---
    def _relative_url(self, image_field):
        if not image_field:
            return None
        try:
            return image_field.url
        except Exception:
            return None

    def get_option_a_image_url(self, obj):
        return self._relative_url(obj.option_a_image)

    def get_option_b_image_url(self, obj):
        return self._relative_url(obj.option_b_image)

    def get_option_c_image_url(self, obj):
        return self._relative_url(obj.option_c_image)

    def get_option_d_image_url(self, obj):
        return self._relative_url(obj.option_d_image)

    def get_question_image_url(self, obj):
        return self._relative_url(obj.question_image)

    # --- validation: correct_answer must match one of options ---
    def validate(self, data):
        correct_answer = data.get("correct_answer")
        options = [
            data.get("option_a"),
            data.get("option_b"),
            data.get("option_c"),
            data.get("option_d"),
        ]
        if correct_answer and correct_answer not in options:
            raise serializers.ValidationError(
                {"correct_answer": "Correct answer must match one of the text options."}
            )
        return data

    def _ensure_correct_index(self, validated_data):
        """
        Ensure correct_index is set and consistent with correct_answer.
        Keeps old clients working if they only send correct_answer.
        """
        opts = [
            validated_data.get("option_a"),
            validated_data.get("option_b"),
            validated_data.get("option_c"),
            validated_data.get("option_d"),
        ]
        correct_answer = validated_data.get("correct_answer", None)
        correct_index = validated_data.get("correct_index", None)

        # Derive index from answer if not provided
        if correct_index is None:
            if correct_answer in opts:
                validated_data["correct_index"] = opts.index(correct_answer)
            else:
                validated_data["correct_index"] = 0
        else:
            # If index provided but no answer, derive answer from options
            if not correct_answer and 0 <= correct_index < len(opts):
                validated_data["correct_answer"] = opts[correct_index]

        return validated_data

    def create(self, validated_data):
        validated_data = self._handle_image_uploads(validated_data)
        validated_data = self._ensure_correct_index(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._handle_image_uploads(validated_data)
        validated_data = self._ensure_correct_index(validated_data)
        return super().update(instance, validated_data)

    def _handle_image_uploads(self, validated_data):
        """
        Convert base64 strings into file objects if provided.
        """
        image_fields = {
            'option_a_image_b64': 'option_a_image',
            'option_b_image_b64': 'option_b_image',
            'option_c_image_b64': 'option_c_image',
            'option_d_image_b64': 'option_d_image',
            'question_image_b64': 'question_image'
        }

        for b64_field, image_field in image_fields.items():
            if b64_field in validated_data and validated_data[b64_field]:
                b64_string = validated_data.pop(b64_field)

                try:
                    format, imgstr = b64_string.split(';base64,')
                    ext = format.split('/')[-1]
                    image_data = base64.b64decode(imgstr)

                    filename = f"template_{int(time.time())}_{hash(imgstr) % 10000}.{ext}"
                    file_obj = ContentFile(image_data, name=filename)

                    validated_data[image_field] = file_obj
                except Exception as e:
                    raise serializers.ValidationError(
                        {b64_field: f"Invalid image format: {str(e)}"}
                    )

        return validated_data

    def to_representation(self, instance):
        """
        Optionally turn the raw ImageField paths into absolute URLs in the base fields
        (question_image, option_a_image, etc.) while *_image_url remain relative.
        """
        representation = super().to_representation(instance)
        request = self.context.get('request')
        base_url = (
          request.build_absolute_uri('/')[:-1]
          if request else getattr(settings, 'BACKEND_BASE_URL', '').rstrip('/')
        )

        for field in ['question_image', 'option_a_image', 'option_b_image', 'option_c_image', 'option_d_image']:
            if representation.get(field) and not str(representation[field]).startswith('http'):
                representation[field] = f"{base_url}{representation[field]}"

        return representation


# =====================================question paper settings===========================


from rest_framework import serializers
from .models import Hq, Factory, Department, Line, SubLine, Station

class HqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hq
        fields = ['hq_id', 'hq_name']

class FactorySerializer(serializers.ModelSerializer):
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Factory
        fields = ['factory_id', 'factory_name', 'hq', 'hq_name']

class DepartmentSerializer(serializers.ModelSerializer):
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']

class LineSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Line
        fields = ['line_id', 'line_name', 'department', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']

class SubLineSerializer(serializers.ModelSerializer):
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = SubLine
        fields = ['subline_id', 'subline_name', 'line', 'line_name', 'department', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']

class StationSerializer(serializers.ModelSerializer):
    subline_name = serializers.CharField(source='subline.subline_name', read_only=True)
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Station
        fields = ['station_id', 'station_name', 'subline', 'subline_name', 'line', 'line_name', 'department', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']



from rest_framework import serializers
from .models import HierarchyStructure

# from rest_framework import serializers
# from .models import HierarchyStructure

# class HierarchyStructureSerializer(serializers.ModelSerializer):
#     hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
#     factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
#     department_name = serializers.CharField(source='department.department_name', read_only=True)
#     line_name = serializers.CharField(source='line.line_name', read_only=True)
#     subline_name = serializers.CharField(source='subline.subline_name', read_only=True)
#     station_name = serializers.CharField(source='station.station_name', read_only=True)

#     class Meta:
#         model = HierarchyStructure
#         fields = [
#             'structure_id', 
#             'structure_name', 
#             'hq', 'hq_name',
#             'factory', 'factory_name',
#             'department', 'department_name',
#             'line', 'line_name',
#             'subline', 'subline_name',
#             'station', 'station_name',
#         ]
from rest_framework import serializers
from .models import HierarchyStructure, StationType, Hq, Factory, Department, Line, SubLine, Station

# ... (Include your basic HqSerializer, FactorySerializer, etc. here) ...

class StationTypeSerializer(serializers.ModelSerializer):
    icon_url = serializers.SerializerMethodField()
    class Meta:
        model = StationType
        fields = ['type_id', 'code', 'name','icon', 'icon_url','color']
    def get_icon_url(self, obj):
        request = self.context.get('request')
        if obj.icon:
            return request.build_absolute_uri(obj.icon.url)
        return None


class HierarchyStructureSerializer(serializers.ModelSerializer):
    # Read-only names for display
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    subline_name = serializers.CharField(source='subline.subline_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)
    
    # Station type as CharField (stores 'CTQ', 'PDI', etc.)
    station_type = serializers.CharField(max_length=20, allow_null=True, required=False)
    
    # Station type name for display (read-only)
    station_type_name = serializers.SerializerMethodField(read_only=True)
    station_type_icon = serializers.SerializerMethodField()

    class Meta:
        model = HierarchyStructure
        fields = [
            'structure_id', 'structure_name',
            'hq', 'hq_name',
            'factory', 'factory_name',
            'department', 'department_name',
            'line', 'line_name',
            'subline', 'subline_name',
            'station', 'station_name',
            'station_type',        # CharField - stores code
            'station_type_name',    # Read-only - displays name
            'station_type_icon'
        ]
    
    def get_station_type_name(self, obj):
        """Get the station type name from the code"""
        if obj.station_type:
            try:
                station_type = StationType.objects.get(code=obj.station_type)
                return station_type.name
            except StationType.DoesNotExist:
                return obj.station_type
        return None
    
    def validate_structure_data(self, value):
        """Validate that structure_data is a valid JSON object"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("structure_data must be a JSON object")
        return value
    
    def create(self, validated_data):
        """Create a new HierarchyStructure instance"""
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError({
                'error': 'Failed to create hierarchy structure',
                'details': str(e)
            })
    
    def update(self, instance, validated_data):
        """Update an existing HierarchyStructure instance"""
        try:
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError({
                'error': 'Failed to update hierarchy structure',
                'details': str(e)
            })
    def get_station_type_icon(self, obj):
        """Get the station type icon URL from the code"""
        if obj.station_type:
            try:
                request = self.context.get('request')
                station_type = StationType.objects.get(code=obj.station_type)
                if station_type.icon:
                    return request.build_absolute_uri(station_type.icon.url)
            except StationType.DoesNotExist:
                return None
        return None
#---------------------AR/VR------------------------
from rest_framework import serializers
from .models import ARVRTrainingContent

class ARVRTrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ARVRTrainingContent
        fields='__all__'

# --------------------------
# Level 2 Process Dojo
# --------------------------


from rest_framework import serializers
from .models import LevelWiseTrainingContent

class LevelWiseTrainingContentSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.name", read_only=True)
    station_name = serializers.CharField(source="station.station_name", read_only=True)

    class Meta:
        model = LevelWiseTrainingContent
        fields = [
            "id",
            "level",
            "level_name",
            "station",
            "station_name",
            "content_name",
            "file",
            "url",
            "updated_at",
        ]



# ===================== Hanchou & Shokuchou ====================#

from rest_framework import serializers
from .models import HanchouExamQuestion

class HanchouExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HanchouExamQuestion
        fields = '__all__'

from rest_framework import serializers
from django.utils import timezone
from .models import HanchouExamResult, MasterTable
# IMPORTANT: adjust this import to where your EmployeeSerializer actually lives
# from .serializers import EmployeeSerializer  # or from .employee_serializers import EmployeeSerializer
from .serializers import MasterTableSerializer 

class HanchouExamResultSerializer(serializers.ModelSerializer):
    """
    Handles serialization for Hanchou Exam Results.
    - Expects `employee_id`, `started_at`, `submitted_at`, `total_questions`, and `score` from the client.
    - Calculates `duration_seconds` automatically.
    - The model's `save` method handles calculating `passed`.
    - Returns the full result object, including nested employee details, on read.
    """

    # --- Fields for Reading Data (Output) ---
    # Use your EmployeeSerializer to show nested employee details when retrieving results.
    # employee = EmployeeSerializer(read_only=True)
    employee = MasterTableSerializer(read_only=True)
    # A custom read-only field to show the calculated percentage.
    percentage = serializers.FloatField(read_only=True)


    # --- Field for Writing Data (Input) ---
    # This field accepts the primary key (the ID) of an employee from the frontend.
    # `source='employee'` tells DRF to use this ID to populate the 'employee' model field.
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=MasterTable.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = HanchouExamResult
        # List ALL fields that should be part of the API representation.
        # We removed 'attempt_id' and 'exam_date' as they are not in your model.
        fields = [
            'id',
            'employee',           # For reading (nested object)
            'employee_id',        # For writing (just the ID)
            'exam_name',
            'started_at',
            'submitted_at',
            'total_questions',
            'score',
            'duration_seconds',
            'pass_mark_percent',
            'passed',
            'percentage',
            'remarks'
        ]
        # Fields that are calculated or set by the server and should not be accepted from the client.
        read_only_fields = (
            'id', 
            'exam_name', 
            'duration_seconds', 
            'passed', 
            'percentage'
        )

    def validate(self, attrs):
        """
        Perform cross-field validation.
        """
        # Ensure submitted_at is not earlier than started_at.
        if attrs.get('started_at') and attrs.get('submitted_at'):
            if attrs['submitted_at'] < attrs['started_at']:
                raise serializers.ValidationError({"submitted_at": "Submission time cannot be earlier than start time."})

        # Ensure score is not greater than total_questions.
        if attrs.get('score') is not None and attrs.get('total_questions') is not None:
            if attrs['score'] > attrs['total_questions']:
                raise serializers.ValidationError({"score": "Score cannot be greater than total questions."})

        return attrs

    def create(self, validated_data):
        """
        Override the create method to add custom logic.
        """
        started_at = validated_data.get('started_at')
        submitted_at = validated_data.get('submitted_at')

        # Automatically calculate the duration if timestamps are provided.
        if started_at and submitted_at:
            duration = submitted_at - started_at
            validated_data['duration_seconds'] = int(duration.total_seconds())

        # Create the HanchouExamResult instance using the validated data.
        # The model's save() method will handle setting the `passed` field.
        return HanchouExamResult.objects.create(**validated_data)


from rest_framework import serializers
from .models import ShokuchouExamQuestion, ShokuchouExamResult, MasterTable
# IMPORTANT: adjust import path to wherever EmployeeSerializer is defined
# from .serializers import EmployeeSerializer  
from .serializers import MasterTableSerializer  


# --- SHO QUESTION SERIALIZER ---
class ShokuchouExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShokuchouExamQuestion
        fields = '__all__'


# --- SHO RESULT SERIALIZER ---
class ShokuchouExamResultSerializer(serializers.ModelSerializer):
    """
    Handles serialization for Shokuchou Exam Results.
    - Expects `employee_id`, `sho_started_at`, `sho_submitted_at`, `sho_total_questions`, and `sho_score` from the client.
    - Calculates `sho_duration_seconds` automatically.
    - The model's `save` method handles calculating `sho_passed`.
    - Returns the full result object, including nested employee details, on read.
    """

    # --- Output fields ---
    # employee = EmployeeSerializer(read_only=True)
    employee = MasterTableSerializer(read_only=True)
    sho_percentage = serializers.FloatField(read_only=True)

    # --- Input field ---
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=MasterTable.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = ShokuchouExamResult
        fields = [
            'id',
            'employee',             # read
            'employee_id',          # write
            'sho_exam_name',
            'sho_started_at',
            'sho_submitted_at',
            'sho_total_questions',
            'sho_score',
            'sho_duration_seconds',
            'sho_pass_mark_percent',
            'sho_passed',
            'sho_percentage',
            'sho_remarks'
        ]
        read_only_fields = (
            'id',
            'sho_exam_name',
            'sho_duration_seconds',
            'sho_passed',
            'sho_percentage'
        )

    def validate(self, attrs):
        """
        Cross-field validation for Shokuchou Exam.
        """
        if attrs.get('sho_started_at') and attrs.get('sho_submitted_at'):
            if attrs['sho_submitted_at'] < attrs['sho_started_at']:
                raise serializers.ValidationError(
                    {"sho_submitted_at": "Submission time cannot be earlier than start time."}
                )

        if attrs.get('sho_score') is not None and attrs.get('sho_total_questions') is not None:
            if attrs['sho_score'] > attrs['sho_total_questions']:
                raise serializers.ValidationError(
                    {"sho_score": "Score cannot be greater than total questions."}
                )

        return attrs

    def create(self, validated_data):
        """
        Automatically calculate sho_duration_seconds before saving.
        """
        started_at = validated_data.get('sho_started_at')
        submitted_at = validated_data.get('sho_submitted_at')

        if started_at and submitted_at:
            duration = submitted_at - started_at
            validated_data['sho_duration_seconds'] = int(duration.total_seconds())

        return ShokuchouExamResult.objects.create(**validated_data)


# your_app/serializers.py
class CardShokuchouExamResultSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for Shokuchou results, formatted for the Employee Card view.
    """
    exam_name = serializers.CharField(source='sho_exam_name')
    score = serializers.IntegerField(source='sho_score')
    total_questions = serializers.IntegerField(source='sho_total_questions')
    percentage = serializers.FloatField(source='sho_percentage')
    passed = serializers.BooleanField(source='sho_passed')
    submitted_at = serializers.DateTimeField(source='sho_submitted_at')

    class Meta:
        model = ShokuchouExamResult
        fields = (
            'id',
            'exam_name',
            'score',
            'total_questions',
            'percentage',
            'passed',
            'submitted_at',
        )



# yourapp/serializers.py

# ... other imports ...
from .models import HanchouExamResult # Make sure to import the model

# ... other serializers ...

# ★★★ NEW SERIALIZER FOR THE EMPLOYEE HISTORY CARD ★★★
class CardHanchouExamResultSerializer(serializers.ModelSerializer):
    """
    A read-only serializer to format Hanchou exam results for the employee card view.
    It provides a clean, flat structure.
    """
    # The 'percentage' field is a @property on the model, so we declare it here
    # to ensure it's included in the serialization.
    percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = HanchouExamResult
        # List the specific fields you want to show in "Card 6" of your React component.
        fields = [
            'id',
            'exam_name',
            'score',
            'total_questions',
            'percentage',
            'passed',
            'submitted_at',
        ]


from .models import HanContent,ShoContent,ShoTrainingContent,ShoSubtopic
from .models import HanTrainingContent

# your_app/serializers.py

from rest_framework import serializers
from .models import HanContent, HanSubtopic, HanTrainingContent

from django.urls import reverse # <-- IMPORT reverse


# --- THIS IS THE CORRECTED HAN SERIALIZER ---
class HanTrainingContentSerializer(serializers.ModelSerializer):
    # This field accepts the file during an upload (POST/PUT).
    # It won't be included in the response (GET).
    training_file = serializers.FileField(write_only=True, required=False)

    # This field is what your React frontend will receive.
    # It's read-only because it's generated by the method below.
    training_file_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = HanTrainingContent
        # FIX #1: Added 'training_file_url' to this list.
        fields = [
            'id',
            'description',
            'training_file',       # For uploads
            'training_file_url',   # For downloads
            'url_link',
            'han_subtopic'
        ]
        # This part is correct, it hides the subtopic object from the response.
        extra_kwargs = {'han_subtopic': {'write_only': True}}

    # FIX #2: Renamed this method from get_training_file to get_training_file_url
    # The name MUST match the field it's for: get_<field_name>
    def get_training_file_url(self, obj):
        """
        This method is called by DRF to populate the 'training_file_url' field.
        """
        if obj.training_file and hasattr(obj.training_file, 'url'):
            request = self.context.get('request')
            # This part is correct, it looks up your named URL
            serve_url = reverse('serve-han-material-file', kwargs={'pk': obj.pk})
            # This part is correct, it builds the full URL
            return request.build_absolute_uri(serve_url)
        return None



# --- MODIFIED SUBTOPIC SERIALIZER ---
class HanSubtopicSerializer(serializers.ModelSerializer):
    materials = HanTrainingContentSerializer(many=True, read_only=True)

    class Meta:
        model = HanSubtopic
        # We must include 'han_content' so it can be sent in a POST request.
        fields = ['id', 'title', 'materials', 'han_content']
        extra_kwargs = {'han_content': {'write_only': True}}



#  Main Topic Serializers ---

class HanContentDetailSerializer(serializers.ModelSerializer):
    """
    Serializes a SINGLE Main Topic with its full nested structure of subtopics and materials.
    This is used for the "detail" view (e.g., GET /api/han-content/1/).
    """
    # The 'subtopics' field matches the `related_name` in the HanSubtopic model.
    subtopics = HanSubtopicSerializer(many=True, read_only=True)

    class Meta:
        model = HanContent
        fields = ['id', 'title', 'subtopics']


class HanContentListSerializer(serializers.ModelSerializer):
    """
    Serializes a Main Topic for a list view.
    It's lightweight and only includes the essential info.
    This is used for the "list" view (e.g., GET /api/han-content/).
    """
    class Meta:
        model = HanContent
        fields = ['id', 'title']





from django.urls import reverse
from rest_framework import serializers
from .models import ShoContent, ShoSubtopic, ShoTrainingContent


# --- THIS IS THE CORRECTED SHO SERIALIZER ---
class ShoTrainingContentSerializer(serializers.ModelSerializer):
    # This field accepts the file during an upload (POST/PUT).
    training_file = serializers.FileField(write_only=True, required=False)

    # This field is what your React frontend will receive.
    training_file_url = serializers.SerializerMethodField(read_only=True)

    # RENAMED for consistency with the Han serializer and the React frontend.
    # The frontend expects 'description', not 'sho_description'.
    description = serializers.CharField(source='sho_description')

    class Meta:
        model = ShoTrainingContent
        # Updated the fields list to be consistent and correct.
        fields = [
            'id',
            'description',          # Using the renamed field
            'training_file',        # For uploads
            'training_file_url',    # For downloads
            'url_link',
            'sho_subtopic'
        ]
        extra_kwargs = {'sho_subtopic': {'write_only': True}}

    # The method to generate the URL for the 'training_file_url' field.
    def get_training_file_url(self, obj):
        """
        Populates the 'training_file_url' field.
        """
        if obj.training_file and hasattr(obj.training_file, 'url'):
            request = self.context.get('request')
            # This correctly looks up the specific URL for Shokuchou files.
            serve_url = reverse('serve-sho-material-file', kwargs={'pk': obj.pk})
            return request.build_absolute_uri(serve_url)
        return None




# --- SHO SUBTOPIC SERIALIZER ---
class ShoSubtopicSerializer(serializers.ModelSerializer):
    sho_materials = ShoTrainingContentSerializer(many=True, read_only=True)

    class Meta:
        model = ShoSubtopic
        fields = ['id', 'title', 'sho_materials', 'sho_content']
        extra_kwargs = {'sho_content': {'write_only': True}}


# --- SHO CONTENT DETAIL SERIALIZER ---
class ShoContentDetailSerializer(serializers.ModelSerializer):
    # Nested subtopics with materials
    sho_subtopics = ShoSubtopicSerializer(many=True, read_only=True)

    class Meta:
        model = ShoContent
        fields = ['id', 'title', 'sho_subtopics']


# --- SHO CONTENT LIST SERIALIZER ---
class ShoContentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoContent
        fields = ['id', 'title']



#====================== hanchouend ===============================#

#=======================10 cycle starts ==========================================#
        
from rest_framework import serializers
from django.core.validators import MinValueValidator
from .models import (
    TenCycleDayConfiguration,
    TenCycleTopics,
    TenCycleSubTopic,
    TenCyclePassingCriteria,
    OperatorPerformanceEvaluation,
    EvaluationSubTopicMarks
)
from .models import Station, Department, Level, MasterTable

from app1.serializers import (
    StationSerializer,
    DepartmentSerializer,
    LevelSerializer,
    MasterTableSerializer
)

class TenCycleDayConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenCycleDayConfiguration
        fields = ['id', 'level', 'department', 'station', 'day_name', 'sequence_order', 'is_active', 'created_at']


class TenCycleSubTopicSerializer(serializers.ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(queryset=TenCycleTopics.objects.all())

    class Meta:
        model = TenCycleSubTopic
        fields = '__all__' 


class TenCycleTopicsSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all(), allow_null=True, required=False)

    class Meta:
        model = TenCycleTopics
        fields = ['id', 'level', 'department', 'station', 'slno', 'cycle_topics', 'is_active', 'created_at']


class TenCyclePassingCriteriaSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all(), allow_null=True, required=False)

    class Meta:
        model = TenCyclePassingCriteria
        fields = '__all__' 

class EvaluationSubMarksSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=OperatorPerformanceEvaluation.objects.all())
    subtopic = serializers.PrimaryKeyRelatedField(queryset=TenCycleSubTopic.objects.all())
    day = serializers.PrimaryKeyRelatedField(queryset=TenCycleDayConfiguration.objects.all())

    class Meta:
        model = EvaluationSubTopicMarks
        fields = [
            'id', 'employee', 'subtopic', 'day',
            'mark_1', 'mark_2', 'mark_3', 'mark_4', 'mark_5',
            'mark_6', 'mark_7', 'mark_8', 'mark_9', 'mark_10',
            'total_score', 'max_possible_score'
        ]
        read_only_fields = ['total_score', 'max_possible_score']

    def validate(self, data):
        # Validate marks don't exceed subtopic score_required
        subtopic = data['subtopic']
        marks = [data.get(f'mark_{i}', 0) or 0 for i in range(1, 11)]
        max_score = subtopic.score_required
        for mark in marks:
            if mark > max_score:
                raise serializers.ValidationError(f"Mark {mark} exceeds maximum allowed per question {max_score}.")
        return data

#=======================10 cycle end ==========================================#

# ====================== Machine Allocation Approval =========================== #

from rest_framework import serializers
from .models import MachineAllocation

class MachineAllocationApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineAllocation
        fields = ['id', 'approval_status']



from rest_framework import serializers
from .models import MasterTable, MachineAllocation

class EmployeeWithStatusSerializer(serializers.ModelSerializer):
    approval_status = serializers.SerializerMethodField()

    class Meta:
        model = MasterTable
        fields = ['id', 'name', 'approval_status']  # include fields as needed

    def get_approval_status(self, obj):
        machine_id = self.context.get('machine_id')
        if machine_id:
            allocation = MachineAllocation.objects.filter(machine_id=machine_id, employee=obj).first()
            if allocation:
                return allocation.approval_status
        return None
    
# =========================== Machine Allocation Approval end ============================ #
#OJT serializers

# ------------------ OJT Topic ------------------

from rest_framework import serializers
from .models import OJTTopic

class OJTTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTTopic
        fields =  "__all__"




# ------------------ OJT Days ------------------
from rest_framework import serializers
from .models import OJTDay

class OJTDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTDay
        fields =  "__all__"





from rest_framework import serializers
from .models import OJTScoreRange

class OJTScoreRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTScoreRange
        fields =  "__all__"






from rest_framework import serializers
from .models import OJTScore


class OJTScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTScore
        fields =  "__all__"   # includes topic, day, trainee, score

    def validate(self, data):
        """
        Run the same validation you put in the model.clean().
        This ensures API users also get proper error responses.
        """
        instance = OJTScore(**data)  # build a temporary instance
        instance.clean()             # calls your model clean() method
        return data





from rest_framework import serializers
from .models import OJTPassingCriteria


class OJTPassingCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTPassingCriteria
        fields = "__all__"







from rest_framework import serializers
from .models import TraineeInfo, OJTScore


from rest_framework import serializers
from .models import TraineeInfo, OJTScore, Station, Level


class OJTScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTScore
        fields = ['topic', 'day', 'score']


class TraineeInfoSerializer(serializers.ModelSerializer):
    scores = OJTScoreSerializer(many=True, write_only=True)
    scores_data = OJTScoreSerializer(source='scores', many=True, read_only=True)

    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())
    station_name = serializers.CharField(source='station.station_name', read_only=True)

    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    level_name = serializers.CharField(source='level.level_name', read_only=True)

    class Meta:
        model = TraineeInfo
        fields = [
            'id', 'trainee_name', 'trainer_id', 'emp_id',
            'line', 'subline', 'station', 'station_name',
            'process_name', 'revision_date', 'doj', 'trainer_name', 'status',
            'scores', 'scores_data', 'level', 'level_name'
        ]
        # ✅ Disable automatic unique_together validation
        validators = []

    def validate(self, data):
        if 'emp_id' in data and (not data['emp_id'] or data['emp_id'].strip() == ''):
            raise serializers.ValidationError({"emp_id": "This field is required and cannot be empty."})
        return data

    def create(self, validated_data):
        scores_data = validated_data.pop('scores', [])
        trainee = TraineeInfo.objects.create(**validated_data)
        for score in scores_data:
            OJTScore.objects.create(trainee=trainee, **score)
        return trainee

    def update(self, instance, validated_data):
        scores_data = validated_data.pop('scores', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.scores.all().delete()
        for score in scores_data:
            OJTScore.objects.create(trainee=instance, **score)
        return instance

from rest_framework import serializers
from .models import QuantityOJTScoreRange, QuantityPassingCriteria
from app1.models import Department, Level  # ✅ import your related models


class QuantityOJTScoreRangeSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = QuantityOJTScoreRange
        fields = [
            "id",
            "department", "level",
            "production_min_score", "production_max_score",
            "rejection_min_score", "rejection_max_score",
        ]


class QuantityPassingCriteriaSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = QuantityPassingCriteria
        fields = [
            "id",
            "department", "level",
            "production_passing_percentage",
            "rejection_passing_percentage",
        ]






from rest_framework import serializers
from .models import QuantityOJTScoreRange, QuantityPassingCriteria
from app1.models import Department, Level  # ✅ import your related models


class QuantityOJTScoreRangeSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = QuantityOJTScoreRange
        fields = [
            "id",
            "department", "level",
            "production_min_score", "production_max_score",
            "rejection_min_score", "rejection_max_score",
        ]


class QuantityPassingCriteriaSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = QuantityPassingCriteria
        fields = [
            "id",
            "department", "level",
            "production_passing_percentage",
            "rejection_passing_percentage",
        ]



from rest_framework import serializers
from .models import OJTLevel2Quantity, Level2QuantityOJTEvaluation, Level


# class Level2QuantityOJTEvaluationSerializer(serializers.ModelSerializer):
#     percentage = serializers.ReadOnlyField()  # ✅ auto-calculated field

#     class Meta:
#         model = Level2QuantityOJTEvaluation
#         fields = [
#             "id", "day", "date", "plan", "production_actual",
#             "production_marks", "rejection_marks",
#             "number_of_rejections", "percentage"  # ✅ removed production_total & rejection_total
#         ]


# # class OJTLevel2QuantitySerializer(serializers.ModelSerializer):
# #     evaluations = Level2QuantityOJTEvaluationSerializer(many=True, write_only=True)
# #     evaluations_data = Level2QuantityOJTEvaluationSerializer(source="evaluations", many=True, read_only=True)
# #     level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

# #     class Meta:
# #         model = OJTLevel2Quantity
# #         fields = [
# #             "id", "level", "trainee_name", "trainee_id", "emp_id",
# #             "station_name", "line_name", "process_name",
# #             "revision_date", "doj", "trainer_name",
# #             "evaluations", "evaluations_data",
# #             "engineer_judge", "status"
# #         ]

# #     def create(self, validated_data):
# #         evaluations_data = validated_data.pop("evaluations", [])
# #         trainee = OJTLevel2Quantity.objects.create(**validated_data)
# #         for eval_data in evaluations_data:
# #             Level2QuantityOJTEvaluation.objects.create(ojt_record=trainee, **eval_data)
# #         return trainee

# #     def update(self, instance, validated_data):
# #         evaluations_data = validated_data.pop("evaluations", [])
# #         # update trainee fields
# #         for attr, value in validated_data.items():
# #             setattr(instance, attr, value)
# #         instance.save()
# #         # replace evaluations
# #         instance.evaluations.all().delete()
# #         for eval_data in evaluations_data:
# #             Level2QuantityOJTEvaluation.objects.create(ojt_record=instance, **eval_data)
# #         return instance

# class OJTLevel2QuantitySerializer(serializers.ModelSerializer):
#     evaluations = Level2QuantityOJTEvaluationSerializer(many=True, write_only=True)
#     evaluations_data = Level2QuantityOJTEvaluationSerializer(
#         source="evaluations", many=True, read_only=True
#     )
#     level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
#     department_id = serializers.PrimaryKeyRelatedField(
#     source="department",
#     queryset=Department.objects.all(),
#     write_only=True
#     )
#     department = serializers.StringRelatedField(read_only=True)
#     class Meta:
#         model = OJTLevel2Quantity
#         fields = [
#             "id", "department_id", "department", "level", "trainee_name", "trainee_id", "emp_id",
#             "station_name", "station", "line_name", "process_name",
#             "revision_date", "doj", "trainer_name",
#             "evaluations", "evaluations_data",
#             "engineer_judge", "status"
#         ]
#         extra_kwargs = {
#             "station": {"write_only": True, "required": False}  # ✅ keep station FK hidden
#         }

#     def create(self, validated_data):
#         evaluations_data = validated_data.pop("evaluations", [])

#         # ✅ Ensure station is set from request
#         station_id = self.initial_data.get("station_id")
#         if station_id:
#             validated_data["station"] = Station.objects.get(pk=station_id)
#         else:
#             raise serializers.ValidationError({"station_id": "This field is required."})
        
        

#         trainee = OJTLevel2Quantity.objects.create(**validated_data)

#         # create nested evaluations
#         for eval_data in evaluations_data:
#             Level2QuantityOJTEvaluation.objects.create(
#                 ojt_record=trainee, **eval_data
#             )
#         return trainee

#     def update(self, instance, validated_data):
#         evaluations_data = validated_data.pop("evaluations", [])

#         # ✅ Update station if provided
#         station_id = self.initial_data.get("station_id")
#         if station_id:
#             validated_data["station"] = Station.objects.get(pk=station_id)
            
        

#         # update trainee fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         # replace evaluations
#         instance.evaluations.all().delete()
#         for eval_data in evaluations_data:
#             Level2QuantityOJTEvaluation.objects.create(
#                 ojt_record=instance, **eval_data
#             )
#         return instance
from .models import Level, LevelDayRequirement
# class LevelDayRequirementSerializer(serializers.ModelSerializer):
#     level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

#     class Meta:
#         model = LevelDayRequirement
#         fields = ["id", "level", "required_days"]



class LevelDayRequirementSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(),
        # This will show/send the actual PK value → level_id
    )

    class Meta:
        model = LevelDayRequirement
        fields = ["id", "level", "required_days"]
        read_only_fields = ["created_at", "updated_at"]
        # Optional: show level name in response
        extra_kwargs = {
            "level": {"help_text": "The level_id of the Level (not auto-generated id)"}
        }

    # Optional: nicer representation with level name
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["level"] = {
            "level_id": instance.level.level_id,
            "level_name": instance.level.level_name
        }
        return ret

# serializers.py
from rest_framework import serializers
from .models import OJTLevel2Quantity, Level2QuantityOJTEvaluation, Level, Station, Department

class Level2QuantityOJTEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level2QuantityOJTEvaluation
        fields = ['day', 'date', 'plan', 'production_actual', 'number_of_rejections']

# class OJTLevel2QuantitySerializer(serializers.ModelSerializer):
#     evaluations = Level2QuantityOJTEvaluationSerializer(many=True, write_only=True)
#     evaluations_data = Level2QuantityOJTEvaluationSerializer(source='evaluations', many=True, read_only=True)

#     level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
#     station_id = serializers.IntegerField(write_only=True)
#     department_id = serializers.IntegerField(write_only=True, allow_null=True, required=False)

#     station = serializers.StringRelatedField(read_only=True)
#     department = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = OJTLevel2Quantity
#         fields = [
#             'id', 'trainee_id', 'trainee_name', 'emp_id',
#             'level', 'station_id', 'station', 'department_id', 'department',
#             'line_name', 'process_name', 'revision_date', 'doj', 'trainer_name',
#             'engineer_judge', 'status',
#             'evaluations', 'evaluations_data',
#         ]

#     def validate(self, data):
#         station_id = data.get('station_id')
#         if not station_id:
#             raise serializers.ValidationError({"station_id": "This field is required."})
#         if not Station.objects.filter(pk=station_id).exists():
#             raise serializers.ValidationError({"station_id": "Invalid station ID."})
#         return data

#     def create(self, validated_data):
#         evaluations_data = validated_data.pop('evaluations', [])
#         station_id = validated_data.pop('station_id')
#         department_id = validated_data.pop('department_id', None)

#         validated_data['station_id'] = station_id
#         if department_id is not None:
#             validated_data['department_id'] = department_id

#         instance = OJTLevel2Quantity.objects.create(**validated_data)
#         for eval_data in evaluations_data:
#             Level2QuantityOJTEvaluation.objects.create(ojt_record=instance, **eval_data)
#         return instance

#     def update(self, instance, validated_data):
#         evaluations_data = validated_data.pop('evaluations', [])
#         station_id = validated_data.pop('station_id', None)
#         department_id = validated_data.pop('department_id', None)

#         if station_id is not None:
#             instance.station_id = station_id
#         if department_id is not None:
#             instance.department_id = department_id

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         instance.evaluations.all().delete()
#         for eval_data in evaluations_data:
#             Level2QuantityOJTEvaluation.objects.create(ojt_record=instance, **eval_data)
#         return instance
#     def validate(self, data):
#         station_id = data.get('station_id')
#         if not station_id:
#             raise serializers.ValidationError({"station_id": "This field is required."})
#         if not Station.objects.filter(pk=station_id).exists():
#             raise serializers.ValidationError({"station_id": "Invalid station ID."})
#         return data

class OJTLevel2QuantitySerializer(serializers.ModelSerializer):
    evaluations = Level2QuantityOJTEvaluationSerializer(many=True, write_only=True)
    evaluations_data = Level2QuantityOJTEvaluationSerializer(source='evaluations', many=True, read_only=True)

    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    station_id = serializers.IntegerField(write_only=True)
    department_id = serializers.IntegerField(write_only=True, allow_null=True, required=False)

    station = serializers.StringRelatedField(read_only=True)
    department = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = OJTLevel2Quantity
        fields = [
            'id', 'trainee_id', 'trainee_name', 'emp_id',
            'level', 'station_id', 'station', 'department_id', 'department',
            'line_name', 'process_name', 'revision_date', 'doj', 'trainer_name',
            'engineer_judge', 'status',
            'evaluations', 'evaluations_data',
        ]

    def validate(self, data):
        station_id = data.get('station_id')
        if not station_id:
            raise serializers.ValidationError({"station_id": "This field is required."})
        if not Station.objects.filter(pk=station_id).exists():
            raise serializers.ValidationError({"station_id": "Invalid station ID."})
        return data

    def create(self, validated_data):
        evaluations_data = validated_data.pop('evaluations', [])
        station_id = validated_data.pop('station_id')
        department_id = validated_data.pop('department_id', None)

        validated_data['station_id'] = station_id
        if department_id is not None:
            validated_data['department_id'] = department_id

        instance = OJTLevel2Quantity.objects.create(**validated_data)
        
        # Create evaluations
        for eval_data in evaluations_data:
            Level2QuantityOJTEvaluation.objects.create(ojt_record=instance, **eval_data)
        
        return instance

    def update(self, instance, validated_data):
        evaluations_data = validated_data.pop('evaluations', [])
        station_id = validated_data.pop('station_id', None)
        department_id = validated_data.pop('department_id', None)

        if station_id is not None:
            instance.station_id = station_id
        if department_id is not None:
            instance.department_id = department_id

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace evaluations
        instance.evaluations.all().delete()
        for eval_data in evaluations_data:
            Level2QuantityOJTEvaluation.objects.create(ojt_record=instance, **eval_data)
        
        return instance
 

# ==================================end ojt=========================================#



# =================== Refreshment Training ============================= #


from rest_framework import serializers
from .models import Training_category, Curriculum, CurriculumContent, Trainer_name, Venues, Schedule, MasterTable,EmployeeAttendance,RescheduleLog,RescheduleHistory

# class RecurrenceIntervalSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RecurrenceInterval
#         fields = ['id', 'interval_months', 'is_active', 'created_at', 'updated_at']
#         read_only_fields = ['created_at', 'updated_at']
class Training_categorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Training_category
        fields = '__all__'

class CurriculumSerializer(serializers.ModelSerializer):
    category = Training_categorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Training_category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Curriculum
        fields = ['id', 'category', 'category_id', 'topic', 'description']

class CurriculumContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumContent
        fields = '__all__'

class Trainer_nameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer_name
        fields = '__all__'

class VenuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venues
        fields = '__all__'

class RefresherOperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterTable
        # fields = ['id', 'employee_code', 'full_name']
        fields = ['emp_id', 'first_name', 'last_name']

# class ScheduleSerializer(serializers.ModelSerializer):
#     training_category = Training_categorySerializer(read_only=True)
#     training_category_id = serializers.PrimaryKeyRelatedField(queryset=Training_category.objects.all(), source='training_category', write_only=True)

#     training_name = CurriculumSerializer(read_only=True)
#     training_name_id = serializers.PrimaryKeyRelatedField(queryset=Curriculum.objects.all(), source='training_name', write_only=True)

#     trainer = Trainer_nameSerializer(read_only=True)
#     trainer_id = serializers.PrimaryKeyRelatedField(queryset=Trainer_name.objects.all(), source='trainer', write_only=True)

#     venue = VenuesSerializer(read_only=True)
#     venue_id = serializers.PrimaryKeyRelatedField(queryset=Venues.objects.all(), source='venue', write_only=True)

#     employees = RefresherOperatorMasterSerializer(many=True, read_only=True)
#     employee_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=MasterTable.objects.all(), write_only=True, source='employees')
#     recurrence_interval = RecurrenceIntervalSerializer(read_only=True)
#     recurrence_interval_id = serializers.PrimaryKeyRelatedField(
#         queryset=RecurrenceInterval.objects.all(),
#         source='recurrence_interval',
#         write_only=True,
#         required=False,
#         allow_null=True
#     )
#     next_training_date = serializers.SerializerMethodField()
#     next_training_creation_date = serializers.SerializerMethodField()
#     class Meta:
#         model = Schedule
#         fields = ['id', 'training_category', 'training_category_id', 'training_name', 'training_name_id',
#                   'trainer', 'trainer_id', 'venue', 'venue_id', 'status', 'date', 'time',
#                   'employees','employee_ids','recurrence_interval','recurrence_interval_id','is_recurring', 'parent_schedule','next_training_date','next_training_creation_date']
        
#     def get_next_training_date(self, obj):
#         """Calculate when the next training will occur"""
#         if obj.is_recurring and obj.recurrence_interval and obj.status == 'completed':
#             from dateutil.relativedelta import relativedelta
#             return obj.date + relativedelta(months=obj.recurrence_interval.interval_months)
#         return None
    
#     def get_next_training_creation_date(self, obj):
#         """Calculate when the next training schedule will be created (7 days before)"""
#         next_training = self.get_next_training_date(obj)
#         if next_training:
#             from datetime import timedelta
#             return next_training - timedelta(days=7)
#         return None

# app1/serializers.py

class ScheduleSerializer(serializers.ModelSerializer):
    training_category = Training_categorySerializer(read_only=True)
    training_category_id = serializers.PrimaryKeyRelatedField(
        queryset=Training_category.objects.all(), 
        source='training_category', 
        write_only=True
    )

    # CHANGED: Handle multiple topics
    topics = CurriculumSerializer(many=True, read_only=True)
    topic_ids = serializers.PrimaryKeyRelatedField(
        queryset=Curriculum.objects.all(), 
        source='topics', 
        write_only=True,
        many=True
    )

    trainer = Trainer_nameSerializer(read_only=True)
    trainer_id = serializers.PrimaryKeyRelatedField(
        queryset=Trainer_name.objects.all(), 
        source='trainer', 
        write_only=True
    )

    venue = VenuesSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        queryset=Venues.objects.all(), 
        source='venue', 
        write_only=True
    )

    employees = RefresherOperatorMasterSerializer(many=True, read_only=True)
    employee_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=MasterTable.objects.all(), 
        write_only=True, 
        source='employees'
    )
    
    next_training_date = serializers.SerializerMethodField()
    next_training_creation_date = serializers.SerializerMethodField()
    
    class Meta:
        model = Schedule
        fields = [
            'id', 'training_category', 'training_category_id', 
            'topics', 'topic_ids', # UPDATED
            'trainer', 'trainer_id', 'venue', 'venue_id', 
            'status', 'date', 'time',
            'employees', 'employee_ids', 
            'recurrence_months', 'is_recurring', 'parent_schedule',
            'recurring_schedule_created', 'completed_date',
            'next_training_date', 'next_training_creation_date',
            'next_training_date_override','training_stage'
        ]
        
    def get_next_training_date(self, obj):
        return obj.get_next_training_date()
    
    def get_next_training_creation_date(self, obj):
        return obj.get_next_creation_date()
    
    def validate_recurrence_months(self, value):
        if value is not None and (value < 1 or value > 10):
            raise serializers.ValidationError(
                "Recurrence months must be between 1 and 10"
            )
        return value


class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    """
    Complete serializer for EmployeeAttendance with all nested data
    This ensures employee and schedule details are fully populated
    """
    # Nested serializers for related objects
    schedule = ScheduleSerializer(read_only=True)
    employee = MasterTableSerializer(read_only=True)
    
    # Write-only fields for creating/updating
    schedule_id = serializers.PrimaryKeyRelatedField(
        queryset=Schedule.objects.all(), 
        source='schedule', 
        write_only=True,
        required=False
    )
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=MasterTable.objects.all(), 
        source='employee', 
        write_only=True,
        required=False
    )

    class Meta:
        model = EmployeeAttendance
        fields = [
            'id',
            'schedule',
            'schedule_id',
            'employee',
            'employee_id',
            'status',
            'notes',
            'reschedule_date',
            'reschedule_time',
            'reschedule_reason',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at', 'schedule', 'employee']

    def validate(self, data):
        """Validate the data"""
        if self.instance is None:  # On create
            if 'schedule' not in data or 'employee' not in data:
                raise serializers.ValidationError(
                    "Both 'schedule' and 'employee' are required"
                )
        
        return data

    def to_representation(self, instance):
        """
        Override to_representation to ensure nested data is always included
        """
        data = super().to_representation(instance)
        
        # Ensure schedule has full nested data
        if instance.schedule:
            data['schedule'] = ScheduleSerializer(instance.schedule).data
        
        # Ensure employee has full nested data
        if instance.employee:
            data['employee'] = MasterTableSerializer(instance.employee).data
        
        return data


class RescheduleLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RescheduleLog
        fields='__all__'

# new serializer
# app1/serializers.py

class RescheduleHistorySerializer(serializers.ModelSerializer):
    employee = MasterTableSerializer(read_only=True)
    original_schedule = ScheduleSerializer(read_only=True)
    
    class Meta:
        model = RescheduleHistory
        fields = [
            'id', 'employee', 'original_schedule',
            'original_date', 'original_time', 'original_venue', 'original_trainer',
            'original_status', 'rescheduled_date', 'rescheduled_time',
            'reschedule_reason', 'final_status', 'final_attendance_marked_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    class Meta:
        model = RescheduleHistory
        fields = [
            'id', 'employee', 'original_schedule',
            'original_date', 'original_time', 'original_venue', 'original_trainer',
            'original_status', 'rescheduled_date', 'rescheduled_time',
            'reschedule_reason', 'final_status', 'final_attendance_marked_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']



from rest_framework import serializers
from .models import (
    RefresherQuestionBank, RefresherQuestion,
    RefresherTestSession, RefresherAnswer
)

class RefresherQuestionSerializer(serializers.ModelSerializer):
    question_image_url = serializers.SerializerMethodField()
    option_a_image_url = serializers.SerializerMethodField()
    option_b_image_url = serializers.SerializerMethodField()
    option_c_image_url = serializers.SerializerMethodField()
    option_d_image_url = serializers.SerializerMethodField()

    class Meta:
        model = RefresherQuestion
        fields = '__all__'
        # IMPORTANT: 'bank' must be read_only because we set it in the view based on topic_id
        read_only_fields = ['bank'] 
        extra_kwargs = {
            'question_text': {'required': False},
            'option_a': {'required': False},
            'option_b': {'required': False},
            'option_c': {'required': False},
            'option_d': {'required': False},
            'question_image': {'required': False},
            'option_a_image': {'required': False},
            'option_b_image': {'required': False},
            'option_c_image': {'required': False},
            'option_d_image': {'required': False},
        }

    def validate(self, data):
        """
        Ensure that if text is missing, an image must be present.
        """
        # 1. Validate Question Content (Text OR Image)
        # We check if keys exist in data. For File uploads, empty field might not be in data.
        q_text = data.get('question_text', '')
        q_img = data.get('question_image', None)

        if not q_text and not q_img:
             # If strictly creating a new question
             if not self.instance: 
                 raise serializers.ValidationError("Question must have either text or an image.")

        return data

    # ... (Keep all your existing get_image_url methods below) ...
    def get_question_image_url(self, obj):
        if obj.question_image:
            return obj.question_image.url
        return None

    def get_option_a_image_url(self, obj):
        if obj.option_a_image:
            return obj.option_a_image.url
        return None

    def get_option_b_image_url(self, obj):
        if obj.option_b_image:
            return obj.option_b_image.url
        return None

    def get_option_c_image_url(self, obj):
        if obj.option_c_image:
            return obj.option_c_image.url
        return None

    def get_option_d_image_url(self, obj):
        if obj.option_d_image:
            return obj.option_d_image.url
        return None

# app1/serializers.py

class RefresherQuestionBankSerializer(serializers.ModelSerializer):
    questions = RefresherQuestionSerializer(many=True, read_only=True)
    # CHANGED: Link to category name directly
    category_name = serializers.CharField(source='category.name', read_only=True)
    total_questions = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = RefresherQuestionBank
        fields = [
            'id', 'category', 'category_name',
            'passing_score', 'time_limit_minutes',
            'total_questions', 'questions', 'created_at'
        ]

# app1/serializers.py

class RefresherTestSessionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    # CHANGED: Get Category Name instead of Topic Name
    topic_name = serializers.CharField(source='schedule.training_category.name', read_only=True)
    test_type_display = serializers.CharField(source='get_test_type_display', read_only=True)

    class Meta:
        model = RefresherTestSession
        fields = '__all__'
        read_only_fields = ['score', 'percentage', 'passed', 'started_at', 'submitted_at']

class RefresherBatchSerializer(serializers.ModelSerializer):
    # Use your existing MasterTableSerializer for employee details
    employees = MasterTableSerializer(many=True, read_only=True)

    class Meta:
        model = RefresherBatch
        fields = [
            'id',
            'schedule',
            'batch_number',
            'name',
            'created_at',
            'employees',
        ]
        read_only_fields = ['id', 'created_at']
# =================== Refreshment Training End ============================= #

from rest_framework import serializers
from .models import Department, Station, StationSetting

class DepartmentselectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['department_id', 'department_name']

class StationselectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['station_id', 'station_name']



from rest_framework import serializers
from .models import StationSetting, Department, Station

class StationSettingSerializer(serializers.Serializer):
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )
    station_id = serializers.PrimaryKeyRelatedField(
        queryset=Station.objects.all(), source='station', write_only=True
    )
    options = serializers.ListField(
        child=serializers.ChoiceField(choices=StationSetting.SETTING_CHOICES)
    )

    def create(self, validated_data):
        department = validated_data['department']
        station = validated_data['station']
        options = validated_data['options']
        
        # First, clear any existing settings for this specific station and department
        # to ensure the new settings are the only ones.
        StationSetting.objects.filter(station=station, department=department).delete()
        
        created = []
        for opt in options:
            setting = StationSetting.objects.create(
                department=department,
                station=station,
                option=opt
            )
            created.append(setting)
        return created

    # --- THIS IS THE FINAL, CORRECTED VALIDATION METHOD ---
    def validate(self, data):
        department = data.get('department')
        station = data.get('station')

        try:
            # Optimistically try to get the department through the hierarchy.
            station_department = station.subline.line.department
            
            # If the code above succeeded, the hierarchy exists.
            # In this case, we MUST validate it.
            if station_department != department:
                raise serializers.ValidationError(
                    "This station is assigned to a different department in the hierarchy."
                )

        except AttributeError:
            # This block runs if `station.subline` or `station.subline.line` is None.
            # Per your business logic, this is perfectly acceptable.
            # `pass` tells Python to do nothing and let the validation succeed.
            pass
        
        # If no error was raised, the data is valid.
        return data
    

# from rest_framework import serializers
from .models import (
    KeyEvent, ConnectEvent, VoteEvent,
    TestSession, Score, MasterTable, Level, Station  # Replaced Skill with Station
)


class KeyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyEvent
        fields = "__all__"


class ConnectEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectEvent
        fields = "__all__"


class VoteEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteEvent
        fields = "__all__"


class ScoreSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source="employee.emp_id", read_only=True)
    name = serializers.SerializerMethodField()
    section = serializers.CharField(source="employee.section", default="", read_only=True)
    department = serializers.SerializerMethodField()
    level_name = serializers.CharField(source="level.level_name", read_only=True, default="")
    skill = serializers.CharField(source="skill.station_name", read_only=True, default="")
    total_questions = serializers.SerializerMethodField()
    test_name = serializers.CharField(source="test.key_id", read_only=True)

    # ⭐ ADDED: Primary Keys (IDs) for Matrix Navigation ⭐
    level_id = serializers.IntegerField(source="level.level_id", read_only=True)
    station_id = serializers.IntegerField(source="skill.station_id", read_only=True) # Assuming Station PK is 'id'

    class Meta:
        model = Score
        fields = [
            "id",  # ⭐ ADDED: The unique primary key of the Score record
            "employee_id", "name", "section", "department",
            "marks", "percentage", "total_questions",
            "passed", "test_name", "created_at", "level_name", "skill",
            # ⭐ Include the new IDs in the fields list ⭐
            "level_id", 
            "station_id"
        ]

    def get_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    def get_department(self, obj):
        print(f"Score.department: {obj.department}")
        print(f"Employee.department: {obj.employee.department if obj.employee else None}")
        print(f"Test.department: {obj.test.department if obj.test else None}")
        if obj.department:
            return obj.department.department_name
        elif obj.employee and obj.employee.department:
            return obj.employee.department.department_name
        elif obj.test and obj.test.department:
            return obj.test.department.department_name
        return "N/A"

    def get_total_questions(self, obj):
        if obj.test and obj.test.question_paper:
            return obj.test.question_paper.template_questions.count()
        return 0



class TestSessionSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source="department.department_name", read_only=True, default="")
    employee_name = serializers.SerializerMethodField()
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    skill_name = serializers.CharField(source="skill.station_name", read_only=True, default="")  # Updated to skill.station_name

    class Meta:
        model = TestSession
        fields = [
            "id", "key_id", "employee", "employee_name","department",
            "level", "level_name", "skill", "skill_name"
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"


class SimpleScoreSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    name = serializers.CharField()
    marks = serializers.IntegerField()
    percentage = serializers.FloatField()
    level_name = serializers.CharField()
    skill_name = serializers.CharField()
    section = serializers.CharField()


from rest_framework import serializers
from .models import CompanyLogo

class CompanyLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLogo
        fields = ['id', 'name', 'logo', 'uploaded_at']
from rest_framework import viewsets
from .models import CompanyLogo
from .serializers import CompanyLogoSerializer

from .models import EvaluationPassingCriteria, Level, Department

class EvaluationPassingCriteriaSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = EvaluationPassingCriteria
        fields = ['id', 'level', 'department', 'percentage', 'level_name', 'department_name']

# =================== Retraining start ============================= #

from .models import RetrainingSession, RetrainingConfig, RetrainingSessionDetail

class RetrainingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetrainingConfig
        fields = "_all_"
      

class RetrainingSessionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetrainingSessionDetail
        fields = [
            'id', 'retraining_session', 'observations_failure_points', 
            'trainer_name', 'created_at', 'updated_at'
        ]

class RetrainingSessionSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)
    session_detail = RetrainingSessionDetailSerializer(read_only=True)

    class Meta:
        model = RetrainingSession
        fields = [
            'id', 'employee', 'employee_name', 'level', 'level_name', 'department', 'department_name',
            'station', 'station_name', 'evaluation_type', 'scheduled_date', 'scheduled_time', 'venue',
            'status', 'attempt_no', 'performance_percentage', 'required_percentage', 'created_at', 'session_detail'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name or ''} {obj.employee.last_name or ''}".strip()
    

class OperatorPerformanceEvaluationSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=MasterTable.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    
    passing_percentage = serializers.SerializerMethodField()  # newly added for retraining data

    class Meta:
        model = OperatorPerformanceEvaluation
        fields = [
            'id',
            'employee',
            'date',
            'shift',
            'department',
            'station',
            'level',
            'line',
            # 'process_name',
            'operation_no',
            'date_of_retraining_completed',
            'prepared_by',
            'checked_by',
            'approved_by',
            'is_completed',
            'final_percentage',
            'final_status',
            'created_at',
            'updated_at',
            'passing_percentage',
        ]
    def get_passing_percentage(self, obj):
        from .models import TenCyclePassingCriteria
        try:
            crit = TenCyclePassingCriteria.objects.get(
                level=obj.level,
                department=obj.department,
                station=obj.station
            )
            return crit.passing_percentage
        except TenCyclePassingCriteria.DoesNotExist:
            return 60.0  # fallback default

#=======================10 cycle end ==========================================#


from rest_framework import serializers
from .models import  QuantityPassingCriteria


from rest_framework import serializers
from .models import QuantityScoreSetup

class QuantityScoreSetupSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = QuantityScoreSetup
        fields = [
            "id",
            "department", "department_name",
            "level", "level_name",
            "score_type",
            "min_value", "max_value",
            "marks",
        ]



class QuantityPassingCriteriaSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = QuantityPassingCriteria
        fields = [
            "id",
            "department", "department_name",
            "level", "level_name",
            "production_passing_percentage",
            "rejection_passing_percentage"
        ]

# =================== Retraining end ============================= #
from rest_framework import serializers
from .models import AssessmentMode

class AssessmentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentMode
        fields = ['mode', 'updated_at']


class LevelColourSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    level_id = serializers.IntegerField(source='level.level_id', read_only=True)
    level_number = serializers.IntegerField(source='level.level_id', read_only=True)  # Use level_id as level_number
    
    class Meta:
        model = LevelColour
        fields = ['id', 'colour_code', 'level', 'level_name', 'level_id', 'level_number']


class LevelSerializer(serializers.ModelSerializer):
    days = DaysSerializer(many=True, read_only=True)
    subtopics = SubTopicListSerializer(many=True, read_only=True)
    colours = LevelColourSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ["level_id", "level_name", "days", "subtopics","colours"]

    def create(self, validated_data):
        days_data = validated_data.pop("days", [])
        subtopics_data = validated_data.pop("subtopics", [])

        # Create Level
        level = Level.objects.create(**validated_data)

        # Create Days first
        created_days = []
        for day_data in days_data:
            day_obj = Days.objects.create(level=level, **day_data)
            created_days.append(day_obj)

        # Create SubTopics directly under level
        for st_data in subtopics_data:
            contents_data = st_data.pop("contents", [])
            evaluations_data = st_data.pop("evaluations", [])
            days_id = st_data.pop("days_id", None)

            # Find the days object from created_days
            days_obj = None
            if days_id:
                days_obj = next((d for d in created_days if d.days_id == days_id), None)
            if not days_obj and created_days:
                days_obj = created_days[0]  # Fallback to first day

            subtopic = SubTopic.objects.create(level=level, days=days_obj, **st_data)

            # SubTopicContents
            for content_data in contents_data:
                training_contents_data = content_data.pop("training_contents", [])
                subtopic_content = SubTopicContent.objects.create(subtopic=subtopic, **content_data)
                for tc_data in training_contents_data:
                    TrainingContent.objects.create(subtopiccontent=subtopic_content, **tc_data)

            # Evaluations
            for eval_data in evaluations_data:
                Evaluation.objects.create(subtopic=subtopic, **eval_data)

        return level

from rest_framework import serializers
from .models import SkillMatrixDisplaySetting

class SkillMatrixDisplaySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMatrixDisplaySetting
        fields = ['display_shape']




class DepartmentReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'department_id', 
            'department_name', 
        ]
class LineReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = [
            'line_id', 
            'line_name', 
        ]
class SubLineReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubLine
        fields = [
            'subline_id', 
            'subline_name', 
        ]

class StationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = [
            'station_id', 
            'station_name', 
        ]





from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()
    level_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    is_recent = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 'recipient',
            'recipient_name', 'recipient_email', 'employee', 'employee_name',
            'level', 'level_name', 'training_schedule', 'machine_allocation',
            'test_session', 'retraining_session', 'human_body_check_session',
            'is_read', 'is_sent', 'read_at', 'created_at', 'sent_at', 'metadata',
            'priority', 'time_ago', 'is_recent'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'time_ago', 'is_recent']

    def get_recipient_name(self, obj):
        """Get recipient's full name"""
        if obj.recipient:
            return f"{obj.recipient.first_name} {obj.recipient.last_name}".strip()
        return None

    def get_employee_name(self, obj):
        """Get employee's name from MasterTable"""
        if obj.employee:
            return f"{obj.employee.first_name} {obj.employee.last_name}".strip()
        return None

    def get_level_name(self, obj):
        """Get level name from Level model"""
        if obj.level:
            return obj.level.level_name
        return None

    def get_time_ago(self, obj):
        """Get human-readable time difference"""
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.created_at

        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"

    def get_is_recent(self, obj):
        """Check if notification is recent (within last 24 hours)"""
        from django.utils import timezone
        from datetime import timedelta
        return obj.created_at > timezone.now() - timedelta(hours=24)


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'title', 'message', 'notification_type', 'recipient',
            'recipient_email', 'employee', 'level', 'training_schedule',
            'machine_allocation', 'test_session', 'retraining_session',
            'human_body_check_session', 'priority', 'metadata'
        ]

    def validate(self, data):
        if not data.get('recipient') and not data.get('recipient_email'):
            raise serializers.ValidationError(
                "Either recipient or recipient_email must be specified."
            )
        return data


class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read', 'read_at']

    def update(self, instance, validated_data):
        if 'is_read' in validated_data:
            if validated_data['is_read'] and not instance.is_read:
                instance.mark_as_read()
            elif not validated_data['is_read'] and instance.is_read:
                instance.mark_as_unread()
        return instance


class NotificationStatsSerializer(serializers.Serializer):
    total_count = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    read_count = serializers.IntegerField()
    recent_count = serializers.IntegerField()
    by_type = serializers.DictField()
    by_priority = serializers.DictField()


# In app1/serializers.py

from rest_framework import serializers
from .models import Score, MasterTable # Make sure models are imported

# ... your other serializers like the original ScoreSerializer can stay here untouched ...


# ADD THIS NEW SERIALIZER CLASS
from rest_framework import serializers
from .models import Score # Make sure Score model is imported

# ... other imports ...

# CORRECTED SERIALIZER CLASS
class LevelOnePassedScoreSerializer(serializers.ModelSerializer):
    """
    A lightweight serializer specifically for listing scores of users who
    have passed an assessment. It includes readable employee and skill names.
    """
    # CHANGE 1: Use SerializerMethodField for custom fields not on the model.
    employee_details = serializers.SerializerMethodField()
    skill_name = serializers.SerializerMethodField()

    class Meta:
        model = Score
        # The fields list remains the same, as this is the desired output.
        fields = [
            'id',
            'employee_details',
            'skill_name',
            'marks',
            'percentage',
            'created_at'
        ]

    # NEW METHOD 1: This function provides the value for 'employee_details'.
    # The name must be get_<field_name>.
    def get_employee_details(self, obj):
        # 'obj' is the Score instance being serialized.
        # We assume your Score model has a ForeignKey to MasterTable named 'employee'.
        if obj.employee:
            return obj.employee.__str__()  # This calls the "FirstName LastName (EMP_ID)" method
        return "Unknown Employee"

    # NEW METHOD 2: This function provides the value for 'skill_name'.
    def get_skill_name(self, obj):
        # We assume your Score model has a ForeignKey to your Skill/Station model named 'skill'.
        if obj.skill:
            # We also assume the skill model has a field called 'station_name'.
            return obj.skill.station_name
        return "Unknown Skill"







from django.core.mail import send_mail
from django.conf import settings

from rest_framework import serializers
from .models import HandoverSheet, MasterTable, Department, Line, Station, SubLine # <--- Import Subline
from django.contrib.auth import get_user_model

User = get_user_model()

class HandoverSheetCreateSerializer(serializers.ModelSerializer):
    emp_id = serializers.CharField(write_only=True)
    distributed_department_name = serializers.CharField(write_only=True)
    
    # IDs for relations
    line_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    subline_id = serializers.IntegerField(write_only=True, required=False, allow_null=True) # <--- NEW
    station_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        required=False, 
        allow_null=True
    )
    
    class Meta:
        model = HandoverSheet
        fields = [
            'emp_id',
            'required_department_at_handover',
            'distributed_department_name',
            'line_id',
            'subline_id', # <--- NEW
            'station_id',
            'assigned_to',
            'handover_date',
            'is_training_completed',
            'gojo_incharge_name',
        ]

    def _get_related_objects(self, validated_data):
        emp_id = validated_data.pop("emp_id", None)
        dept_name = validated_data.pop("distributed_department_name", None)

        employee = None
        if emp_id:
            try:
                employee = MasterTable.objects.get(emp_id=emp_id)
            except MasterTable.DoesNotExist:
                raise serializers.ValidationError(f"Employee with ID '{emp_id}' not found.")
        
        department = None
        if dept_name:
            try:
                department = Department.objects.get(department_name=dept_name)
            except Department.DoesNotExist:
                raise serializers.ValidationError(f"Department '{dept_name}' not found.")
            
        return employee, department

    def create(self, validated_data):
        employee, department = self._get_related_objects(validated_data)
        if not employee:
            raise serializers.ValidationError("emp_id is required.")

        # Pop IDs
        line_id = validated_data.pop('line_id', None)
        subline_id = validated_data.pop('subline_id', None) # <--- NEW
        station_id = validated_data.pop('station_id', None)

          # --- FIX START ---
        # WE USE 'pk' (Primary Key) INSTEAD OF 'id'
        # 'pk' works regardless of whether your column is named 'id', 'line_id', or 'station_id'
        
        line = None
        if line_id:
            try:
                line = Line.objects.get(pk=line_id)
            except Line.DoesNotExist:
                raise serializers.ValidationError(f"Line with ID {line_id} not found.")

        subline = None
        if subline_id:
            try:
                subline = SubLine.objects.get(pk=subline_id)
            except SubLine.DoesNotExist:
                raise serializers.ValidationError(f"SubLine with ID {subline_id} not found.")

        station = None
        if station_id:
            try:
                station = Station.objects.get(pk=station_id)
            except Station.DoesNotExist:
                raise serializers.ValidationError(f"Station with ID {station_id} not found.")
        # --- FIX END ---
        
        
        defaults = {
            "distributed_department_after_dojo": department,
            "allocated_line": line,
            "allocated_subline": subline, # <--- NEW
            "allocated_station": station,
            **validated_data
        }

        handover, created = HandoverSheet.objects.update_or_create(
            employee=employee,
            defaults=defaults
        )

        # Update MasterTable 
        # (Assuming MasterTable also has a 'current_subline' field based on your pattern)
        employee.department = department
        employee.current_line = line
        if hasattr(employee, 'current_subline'): # Safety check
            employee.current_subline = subline
        employee.current_station = station
        employee.save()

         # --- NEW: Create Database Notification ---
        if handover.assigned_to:
            emp_name = f"{handover.employee.first_name} {handover.employee.last_name}"
            Notification.objects.create(
                recipient=handover.assigned_to,
                # I removed the line below because the model doesn't have this field
                # handover_sheet=handover, 
                message=f"New Employee Assigned: {emp_name}"
            )
        # -----------------------------------------

        self._send_email_notification(handover)
        
        return handover

    def update(self, instance, validated_data):
        new_dept_name = validated_data.get('distributed_department_name')
        
        if new_dept_name:
            department_name = validated_data.pop('distributed_department_name')
            try:
                # Assuming Department might also use a custom ID, using 'department_name' lookup is safer here as written
                new_department = Department.objects.get(department_name=department_name)
                instance.distributed_department_after_dojo = new_department
                instance.employee.department = new_department
            except Department.DoesNotExist:
                raise serializers.ValidationError(f"Department {department_name} not found")

        # Handle Line
        if 'line_id' in validated_data:
            line_id = validated_data.pop('line_id')
            # FIX: changed id= to pk=
            new_line = Line.objects.get(pk=line_id) if line_id else None
            instance.allocated_line = new_line
            instance.employee.current_line = new_line

        # Handle Subline 
        if 'subline_id' in validated_data:
            subline_id = validated_data.pop('subline_id')
            # FIX: changed id= to pk=
            new_subline = SubLine.objects.get(pk=subline_id) if subline_id else None
            instance.allocated_subline = new_subline
            if hasattr(instance.employee, 'current_subline'):
                instance.employee.current_subline = new_subline

        # Handle Station
        if 'station_id' in validated_data:
            station_id = validated_data.pop('station_id')
            # FIX: changed id= to pk=
            new_station = Station.objects.get(pk=station_id) if station_id else None
            instance.allocated_station = new_station
            instance.employee.current_station = new_station
        
        instance.employee.save()

        validated_data.pop('emp_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()


        self._send_email_notification(instance)
        return instance
    

 

    # --- ADD THIS METHOD AT THE BOTTOM OF THE CLASS ---
    def to_representation(self, instance):
        """
        This method controls what data is sent TO the frontend.
        We overwrite it to ensure the frontend gets exactly what it needs
        to pre-fill the form and identifying the employee.
        """
        data = super().to_representation(instance)
        
        # 1. Fix the Employee ID for the "Create/Edit" button logic
        # Returns "EMP001" instead of the database ID (e.g., 15)
        data['employee'] = instance.employee.emp_id 
        
        # 2. Ensure Foreign Keys return their IDs so Dropdowns pre-select correctly
        # (This handles cases where your settings might be returning objects instead of IDs)
        data['allocated_line'] = instance.allocated_line.pk if instance.allocated_line else None
        data['allocated_subline'] = instance.allocated_subline.pk if instance.allocated_subline else None
        data['allocated_station'] = instance.allocated_station.pk if instance.allocated_station else None
        data['assigned_to'] = instance.assigned_to.pk if instance.assigned_to else None
        
        return data
    

         # --- EMAIL NOTIFICATION FUNCTION (DEBUG VERSION) ---
    def _send_email_notification(self, handover_instance):
        print(f"🕵️‍♂️ DEBUG: Starting Email Process for {handover_instance.employee.emp_id}...")
        
        supervisor = handover_instance.assigned_to
        print(f"🕵️‍♂️ DEBUG: Supervisor Object: {supervisor}")

        if not supervisor:
            print("❌ STOP: No Supervisor assigned to this handover.")
            return

        print(f"🕵️‍♂️ DEBUG: Supervisor Email: '{supervisor.email}'")

        if not supervisor.email:
            print("❌ STOP: Supervisor exists, but has NO EMAIL ADDRESS in the database.")
            return

        # If we get here, we have a user and an email. Proceed.
        emp_name = f"{handover_instance.employee.first_name} {handover_instance.employee.last_name}"
        emp_id = handover_instance.employee.emp_id
        sup_name = f"{supervisor.first_name} {supervisor.last_name}"
        
        subline_text = ""
        if handover_instance.allocated_subline:
            subline_text = f"Allocated Subline: {handover_instance.allocated_subline.subline_name}\n"

        subject = f"New Employee Allocation: {emp_name} ({emp_id})"
        
        message = (
            f"Hello {sup_name},\n\n"
            f"This is an automated notification from the Dojo System.\n\n"
            f"The following employee has successfully passed Dojo Training and has been assigned to you:\n"
            f"------------------------------------------------\n"
            f"Name: {emp_name}\n"
            f"Employee ID: {emp_id}\n"
            f"Department: {handover_instance.distributed_department_after_dojo.department_name}\n"
            f"Allocated Line: {handover_instance.allocated_line.line_name if handover_instance.allocated_line else 'N/A'}\n"
            f"{subline_text}"
            f"Allocated Station: {handover_instance.allocated_station.station_name if handover_instance.allocated_station else 'N/A'}\n"
            f"------------------------------------------------\n\n"
            f"Please take the necessary actions to integrate them into your team.\n\n"
            f"Best Regards,\nDojo Management Team"
        )

        try:
            print("🕵️‍♂️ DEBUG: Attempting to send mail now...")
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [supervisor.email],
                fail_silently=False,
            )
            print(f"✅ SUCCESS: Email sent successfully to {supervisor.email}")
        except Exception as e:
            print(f"❌ FAILURE: Error sending email: {str(e)}")


           




class MasterTableHandoverDetailSerializer(serializers.ModelSerializer):
    """
    A dedicated serializer that provides the full, nested details needed
    ONLY for the Handover Modal. It is safe and isolated.
    """
    # These will now return nested objects {id, name} instead of just an ID
    department = DepartmentSerializer(read_only=True)
    current_line = LineSerializer(read_only=True)
    current_station = StationSerializer(read_only=True)

    class Meta:
        model = MasterTable
        # Add the new fields to the list
        fields = [
            'emp_id',
            'first_name',
            'last_name',
            'department',       # This will be the nested department object
            'current_line',     # This will be the nested line object
            'current_station',  # This will be the nested station object
            'date_of_joining',
            'birth_date',
            'sex',
            'email',
            'phone',
            'photo'
        ]




    

    from rest_framework import serializers
from .models import LevelWiseTrainingContent, TrainingTopic

class LevelWiseTrainingContentSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    station_name = serializers.CharField(source="station.station_name", read_only=True)
    topic_name = serializers.CharField(source="topic.topic_name", read_only=True)  # show topic name

    class Meta:
        model = LevelWiseTrainingContent
        fields = [
            "id",
            "topic",        # FK id for create/update
            "topic_name",   # read-only name of topic
            "level",
            "level_name",
            "station",
            "station_name",
            "content_name",
            "file",
            "url",
            "updated_at",
        ]

from rest_framework import serializers
from .models import TrainingTopic

class TrainingTopicSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    station_name = serializers.CharField(source="station.station_name", read_only=True)
    
    class Meta:
        model = TrainingTopic
        fields = [
            "id",
            "topic_name",
            "level",        # FK id for create/update
            "level_name",   # read-only name of level
            "station",      # FK id for create/update
            "station_name", # read-only name of station
        ]


    



class DailyProductionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyProductionData
        fields = '__all__'


from rest_framework import serializers
from .models import SkillMatrix

class SkillMatrixSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    station_name = serializers.CharField(source="hierarchy.station.station_name", read_only=True)
    department_name = serializers.CharField(source="hierarchy.department.department_name", read_only=True)
    station_id = serializers.IntegerField(source="hierarchy.station.station_id", read_only=True)
    
    class Meta:
        model = SkillMatrix
        fields = [
            "id",
            "employee_name",
            "emp_id",
            "doj",
            "level",
            "level_name",
            "hierarchy",
            "station_name",
            "station_id",
            "department_name",
            "updated_at",
]

from .models import UserManualdocs

class UserManualdocsSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserManualdocs
        fields = [
            'id', 
            'name', 
            'file', 
            'uploaded_at', 
            'updated_at',
            'file_url',
            'file_name',
            'file_extension'
        ]
        read_only_fields = ['uploaded_at', 'updated_at']

    def get_file_url(self, obj):
        """Get the full URL for the file"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_file_name(self, obj):
        """Get the original filename"""
        if obj.file:
            return obj.file.name.split('/')[-1]  # Get just the filename
        return None

    def validate(self, data):
        """Custom validation to ensure file is provided"""
        file_data = data.get('file')
        
        if not file_data:
            raise serializers.ValidationError(
                "File is required."
            )
        
        return data
    
from .models import EvaluationPassingCriteria, Level, Department

class EvaluationPassingCriteriaSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = EvaluationPassingCriteria
        fields = ['id', 'level', 'department', 'percentage', 'level_name', 'department_name']


# STANDARD_A0002(trainingattendance)
# =================== TrainingAttendance ============================= #


from .models import TrainingBatch,TrainingAttendance

class TrainingBatchSerializer(serializers.ModelSerializer):
    """ Serializer for the TrainingBatch model. """
    class Meta:
        model = TrainingBatch
        fields = ['batch_id', 'is_active', 'created_at']
        read_only_fields = ['batch_id', 'created_at']


class TrainingAttendanceSerializer(serializers.ModelSerializer):
    """ Serializer for creating/updating individual attendance records. """
    user = serializers.PrimaryKeyRelatedField(queryset=UserRegistration.objects.all())
    # The attendance_date is set by the server, so it's read-only for clients.
    attendance_date = serializers.DateField(read_only=True) 

    class Meta:
        model = TrainingAttendance
        fields = ['user', 'batch', 'day_number', 'status', 'attendance_date']


class CardTrainingAttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for showing attendance in the Employee Card view.
    """
    # Get the batch_id string directly instead of the related object ID
    batch = serializers.CharField(source='batch.batch_id', read_only=True)

    class Meta:
        model = TrainingAttendance
        # These fields match what your React interface expects
        fields = ['id', 'batch', 'day_number', 'status', 'attendance_date']

# serializers.py
# serializers.py
from rest_framework import serializers
from .models import RescheduledSession  # adjust import path

class CardRescheduledSessionSerializer(serializers.ModelSerializer):
    batch_id = serializers.CharField(source='batch.batch_id', read_only=True)
    original_day_number = serializers.IntegerField(source='original_day.days_id', read_only=True)
    original_day_name = serializers.CharField(source='original_day.day_name', read_only=True)
    subtopic_name = serializers.CharField(source='training_subtopic.subtopic_name', read_only=True, allow_null=True)
    
    # This was the problem — you used source= but didn't add to fields!
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)

    class Meta:
        model = RescheduledSession
        fields = [
            'id',
            'batch_id',
            'original_day_number',
            'original_day_name',
            'original_date',
            'rescheduled_date',
            'rescheduled_time',
            'training_name',
            'subtopic_name',
            'status',
            'attendance_status',
            'attendance_marked',
            'notes',
            'created_at',
            'employee_name',        # ← MUST BE HERE!
        ]

class UserForAttendanceSerializer(serializers.ModelSerializer):
    """ A simplified User serializer for nesting inside the attendance detail view. """
    attendances = serializers.SerializerMethodField()

    class Meta:
        model = UserRegistration
        fields = ['id', 'first_name', 'temp_id', 'attendances','last_name']

    def get_attendances(self, obj):
        batch_id = self.context.get('batch_id')
        if not batch_id:
            return {}
        attendances = TrainingAttendance.objects.filter(user=obj, batch=batch_id)
        return {att.day_number.days_id: att.status for att in attendances}
    

class BatchAttendanceDetailSerializer(serializers.Serializer):
    """
    Custom serializer for the main attendance page response.
    Combines batch info, the next day to mark, and the list of users.
    """
    batch_id = serializers.CharField()
    next_training_day_to_mark = serializers.IntegerField(allow_null=True)
    is_completed = serializers.BooleanField()
    users = UserForAttendanceSerializer(many=True)
    

class BatchAttendanceDetailSerializer(serializers.Serializer):
    """
    Custom serializer for the main attendance page response.
    Combines batch info, the next day to mark, and the list of users.
    """
    batch_id = serializers.CharField()
    next_training_day_to_mark = serializers.IntegerField(allow_null=True)
    is_completed = serializers.BooleanField()
    users = UserForAttendanceSerializer(many=True)




from rest_framework import serializers
from .models import RescheduledSession, SubTopic, Days, UserRegistration

class SubTopicSimpleSerializer(serializers.ModelSerializer):
    """Simple serializer for SubTopic dropdown"""
    day_name = serializers.CharField(source='days.day', read_only=True)
    
    class Meta:
        model = SubTopic
        fields = ['subtopic_id', 'subtopic_name', 'day_name']


class RescheduledSessionSerializer(serializers.ModelSerializer):
    """Full serializer for RescheduledSession with nested data"""
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    employee_last_name = serializers.CharField(source='employee.last_name', read_only=True)
    employee_email = serializers.CharField(source='employee.email', read_only=True)
    employee_temp_id = serializers.CharField(source='employee.temp_id', read_only=True)
    batch_id = serializers.CharField(source='batch.batch_id', read_only=True)
    original_day_number = serializers.IntegerField(source='original_day.days_id', read_only=True)
    training_subtopic_name = serializers.CharField(
        source='training_subtopic.subtopic_name', 
        read_only=True,
        allow_null=True
    )
    
    # Write fields
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=UserRegistration.objects.all(),
        source='employee',
        write_only=True
    )
    batch_id_write = serializers.CharField(
        source='batch',
        write_only=True
    )
    original_day_id = serializers.PrimaryKeyRelatedField(
        queryset=Days.objects.all(),
        source='original_day',
        write_only=True
    )
    training_subtopic_id = serializers.PrimaryKeyRelatedField(
        queryset=SubTopic.objects.all(),
        source='training_subtopic',
        write_only=True,
        required=False,
        allow_null=True
    )
    attendance_photo_url = serializers.SerializerMethodField()
    def get_attendance_photo_url(self, obj):
        if obj.attendance_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attendance_photo.url)
            return obj.attendance_photo.url
        return None
    class Meta:
        model = RescheduledSession
        fields = [
            'id',
            'employee_id',
            'employee_name',
            'employee_last_name',
            'employee_email',
            'employee_temp_id',
            'batch_id',
            'batch_id_write',
            'original_day_id',
            'original_day_number',
            'original_date',
            'rescheduled_date',
            'rescheduled_time',
            'training_subtopic_id',
            'training_subtopic_name',
            'training_name',
            'notes',
            'status',
            'attendance_marked',
            'attendance_status',
            'attendance_marked_at',
            'created_at',
            'updated_at',
            'attendance_photo_url'
        ]
        read_only_fields = [
            'id',
            'attendance_marked',
            'attendance_marked_at',
            'created_at',
            'updated_at'
        ]


class RescheduledSessionCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating rescheduled sessions"""
    
    class Meta:
        model = RescheduledSession
        fields = [
            'employee',
            'batch',
            'original_day',
            'original_date',
            'rescheduled_date',
            'rescheduled_time',
            'training_subtopic',
            'training_name',
            'notes'
        ]
    
    def validate(self, data):
        """Validate that rescheduled date is in the future"""
        if data['rescheduled_date'] < timezone.now().date():
            raise serializers.ValidationError({
                'rescheduled_date': 'Rescheduled date must be in the future.'
            })
        return data


# class MarkRescheduledAttendanceSerializer(serializers.Serializer):
#     """Serializer for marking attendance on rescheduled sessions"""
#     session_id = serializers.IntegerField()
#     attendance_status = serializers.ChoiceField(
#         choices=['present', 'absent'],
#         default='present'
#     )
#     marked_by = serializers.CharField(required=False, allow_blank=True)
#     photo = serializers.ImageField(required=False, allow_null=True)
    
#     def validate_session_id(self, value):
#         """Check that session exists and is not already completed"""
#         try:
#             session = RescheduledSession.objects.get(id=value)
#             if session.attendance_marked:
#                 raise serializers.ValidationError(
#                     'Attendance already marked for this session.'
#                 )
#             return value
#         except RescheduledSession.DoesNotExist:
#             raise serializers.ValidationError('Session not found.')

# serializers.py
class MarkRescheduledAttendanceSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    attendance_status = serializers.ChoiceField(choices=['present', 'absent'], default='present')
    marked_by = serializers.CharField(required=False, allow_blank=True, default='Admin')
    photo = serializers.ImageField(required=False, allow_null=True)

    def validate_session_id(self, value):
        try:
            session = RescheduledSession.objects.get(id=value)
            if session.attendance_marked:
                raise serializers.ValidationError("Attendance already marked.")
            if session.status != 'scheduled':
                raise serializers.ValidationError("Only scheduled sessions can be marked.")
            # Attach session to context
            self.context['session'] = session
            return value
        except RescheduledSession.DoesNotExist:
            raise serializers.ValidationError("Session not found.")

# =================== TrainingAttendance End ============================= #



from rest_framework import serializers
from .models import AdvanceManpowerDashboard

class AdvanceManpowerDashboardSerializer(serializers.ModelSerializer):
    # Read-only fields to show names in responses (optional but helpful for debugging/display)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    subline_name = serializers.CharField(source='subline.subline_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)

    class Meta:
        model = AdvanceManpowerDashboard
        fields = '__all__'


# serializers.py (CORRECTED)

from rest_framework import serializers
from .models import ManagementReview

# No changes needed here, this one is fine.
class ManagementReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementReview
        fields = "__all__"



class BaseManagementReviewSerializer(serializers.ModelSerializer):
    """A base serializer to provide the 'month_year' field."""
    month_year = serializers.SerializerMethodField()

    class Meta:
        model = ManagementReview
        abstract = True 

    def get_month_year(self, obj):
        return f"{obj.year}-{str(obj.month).zfill(2)}"


# --- Now, we use the base serializer to build the others ---

class TrainingDataSerializer(BaseManagementReviewSerializer):
    class Meta:
        model = ManagementReview
        # FIX: Replaced non-existent 'month_year' with the one from our base serializer
        fields = ['month_year', 'new_operators_joined', 'new_operators_trained', 
                  'total_training_plans', 'total_trainings_actual']

class DefectsDataSerializer(BaseManagementReviewSerializer):
    class Meta:
        model = ManagementReview
        # FIX: Replaced non-existent 'month_year'
        fields = ['month_year', 'total_defects_msil', 'ctq_defects_msil', 
                  'total_defects_tier1', 'ctq_defects_tier1', 
                  'total_internal_rejection', 'ctq_internal_rejection']

class OperatorsChartSerializer(BaseManagementReviewSerializer):
    # We can rename fields directly from the model using the 'source' argument
    operators_joined = serializers.IntegerField(source='new_operators_joined')
    operators_trained = serializers.IntegerField(source='new_operators_trained')
    
    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'operators_joined', 'operators_trained']

class TrainingPlansChartSerializer(BaseManagementReviewSerializer):
    training_plans = serializers.IntegerField(source='total_training_plans')
    trainings_actual = serializers.IntegerField(source='total_trainings_actual')
    
    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'training_plans', 'trainings_actual']

class DefectsChartSerializer(BaseManagementReviewSerializer):
    defects_msil = serializers.IntegerField(source='total_defects_msil')

    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'defects_msil', 'ctq_defects_msil']

# ================ Emp History Card ===============================


from rest_framework import serializers
from .models import MasterTable

class CardEmployeeMasterSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.department_name', read_only=True)
    class Meta:
        model = MasterTable
        # fields = [
        #     'id', 'pay_code', 'card_no', 'name', 'guardian_name', 'sex', 'birth_date',
        #     'department', 'section', 'desig_category', 'joining_date',
        #     'auth_shift', 'shift_type', 'shift_pattern',
        #     'first_weekly_off', 'second_weekly_off', 'second_weekly_off_fh',
        #     'ot_allowed_rate', 'round_the_clock'
        # ]
        fields = [
            'emp_id','first_name','last_name','department','date_of_joining','birth_date',
            'sex','email','phone',
        ]



class OperatorCardSkillSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    station_name = serializers.CharField(source='hierarchy.station.station_name', read_only=True)
    level_name = serializers.CharField(source='level.level_name', read_only=True)

    class Meta:
        model = SkillMatrix
        fields = ['id', 'employee_name', 'station_name', 'level_name', 'updated_at']  
        # fields = ['id', 'operator_name', 'station_name', 'level_name', 'sequence']  



from rest_framework import serializers
from .models import Score

class CardScoreSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    test_name = serializers.CharField(source='test.test_name', read_only=True)

    class Meta:
        model = Score
        fields = [
            'id',
            'employee_name',
            'test_name',     # just use directly if it's a model field
            'marks',
            'percentage',    # must exist in model
            'passed',        # must exist in model
            'created_at'
        ]




from rest_framework import serializers
from .models import MultiSkilling

class CardMultiSkillingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    # station_number = serializers.IntegerField(source='station.station_number', read_only=True)
    # skill_level_value = serializers.CharField(source='skill_level', read_only=True)
    # skill = serializers.CharField(source='station.skill', read_only=True, allow_null=True)
    skill = serializers.CharField(source='hierarchy.station.station_name', read_only=True, allow_null=True)

    class Meta:
        model = MultiSkilling
        fields = [
            'id',
            'employee_name',
            # 'station_number',
            'skill',
            # 'skill_level_value',
            'skill_level',
            'start_date',
            # 'end_date',
            # 'notes',
            'status',
            # 'reason',
            # 'refreshment_date'
        ]



#not understand the model 
# from rest_framework import serializers
# from .models import RefreshmentTraining

# class CardRefreshmentTrainingSerializer(serializers.ModelSerializer):
#     employee_name = serializers.CharField(source='employee.name', read_only=True)
#     card_no = serializers.CharField(source='employee.card_no', read_only=True)
#     station_number = serializers.IntegerField(source='station.station_number', read_only=True)
#     skill_name = serializers.CharField(source='skill.skill', read_only=True)
#     skill_level_value = serializers.CharField(source='skill_level.skill_level', read_only=True)

#     class Meta:
#         model = RefreshmentTraining
#         fields = [
#             'id',
#             'employee_name',
#             'card_no',
#             'station_number',
#             'skill_name',
#             'skill_level_value',
#             'start_date',
#             'end_date',
#             'reason_for_refreshment',
#         ]

# THIS IS THE UPDATED VERSION
class CardScheduleSerializer(serializers.ModelSerializer):
    """
    This serializer takes a Schedule object and formats it for the
    employee history card.
    """
    
    # ★ GET related names instead of IDs
    trainer_name = serializers.CharField(source='trainer.name', read_only=True, allow_null=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True, allow_null=True)

    # ★ RENAME 'training_name.topic' to be more descriptive
    topic = serializers.CharField(source='training_name.topic', read_only=True)
    
    # ★ GET the category name
    category_name = serializers.CharField(source='training_category.name', read_only=True)

    class Meta:
        model = Schedule
        # ★ UPDATE the fields list with the new data
        fields = [
            'id',
            'topic',
            'category_name',
            'trainer_name',
            'venue_name',
            'status',
            # 'created_at',
            'date'
            # 'time',  # Let's add time as well, it's useful!
        ]
    # --- ★ START: ADD THESE MISSING METHODS ★ ---


#955
# # ★★★ NEW SERIALIZER FOR THE EMPLOYEE HISTORY CARD ★★★
# class CardHanchouExamResultSerializer(serializers.ModelSerializer):
#     """
#     A read-only serializer to format Hanchou exam results for the employee card view.
#     It provides a clean, flat structure.
#     """
#     # The 'percentage' field is a @property on the model, so we declare it here
#     # to ensure it's included in the serialization.
#     percentage = serializers.FloatField(read_only=True)

#     class Meta:
#         model = HanchouExamResult
#         # List the specific fields you want to show in "Card 6" of your React component.
#         fields = [
#             'id',
#             'exam_name',
#             'score',
#             'total_questions',
#             'percentage',
#             'passed',
#             'submitted_at',
#         ]



#2331
# class CardTrainingAttendanceSerializer(serializers.ModelSerializer):
#     """
#     Serializer specifically for showing attendance in the Employee Card view.
#     """
#     # Get the batch_id string directly instead of the related object ID
#     batch = serializers.CharField(source='batch.batch_id', read_only=True)

#     class Meta:
#         model = TrainingAttendance
#         # These fields match what your React interface expects
#         fields = ['id', 'batch', 'day_number', 'status', 'attendance_date']


# ================ Emp History Card End ===============================



# ==================== MultiSkilling Start ======================== #


from rest_framework import serializers
from .models import MultiSkilling, SkillMatrix


class MultiSkillingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(read_only=True)
    emp_id = serializers.CharField(read_only=True)
    department_name = serializers.CharField(read_only=True)   # snapshot from MasterTable
    current_status = serializers.SerializerMethodField()

    station_name = serializers.CharField(source="station.station_name", read_only=True)
    department_display = serializers.CharField(
        source="department.department_name", read_only=True
    )

    class Meta:
        model = MultiSkilling
        fields = [
            "id", "employee", "emp_id", "employee_name", "department_name", "date_of_joining",
            "department", "station", "station_name", "department_display",
            "skill_level",
            "start_date", "remarks", "status", "current_status",
            "created_at", "updated_at",
        ]

    def get_current_status(self, obj):
        """
        1. If scheduled and date <= today → in-progress
        2. If a matching SkillMatrix row exists for this employee & station with >= skill_level → completed
        """
        # today = obj.start_date
        # Default property status logic
        status_val = obj.current_status

        # Check completion in SkillMatrix
        skill_exists = SkillMatrix.objects.filter(
            employee=obj.employee,
            hierarchy__station=obj.station,
             level__level_name=obj.skill_level.level_name  # compare with required level
        ).exists()

        if skill_exists:
            return "completed"

        return status_val

# ==================== MultiSkilling End ======================== #



from .models import Machine, MachineAllocation,SkillMatrix

class MachineSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    class Meta:
        model = Machine
        fields = "__all__"

    def create(self, validated_data):
        return Machine.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def delete(self, instance):
        # Custom delete if you want control
        instance.delete()
        return instance





class MachineAllocationSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.name', read_only=True)
    machine_level = serializers.IntegerField(source='machine.level', read_only=True)
    employee_name = serializers.CharField(source='employee.employee_name', read_only=True)
    employee_level = serializers.IntegerField(source='employee.level.level_id', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = MachineAllocation
        fields = "__all__"
        read_only_fields = ('approval_status', 'allocated_at')  # These are auto-determined

    def create(self, validated_data):
        # The approval_status will be automatically set in the model's save method
        return MachineAllocation.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()  # This will trigger the auto-approval logic
        return instance

    def validate(self, data):
        """
        Check if the allocation already exists
        """
        machine = data.get('machine')
        employee = data.get('employee')
        
        # If this is an update, exclude current instance
        if self.instance:
            existing = MachineAllocation.objects.filter(
                machine=machine, 
                employee=employee
            ).exclude(id=self.instance.id)
        else:
            existing = MachineAllocation.objects.filter(
                machine=machine, 
                employee=employee
            )
        
        if existing.exists():
            raise serializers.ValidationError(
                "This employee is already allocated to this machine."
            )
        
        return data

    def validate_employee(self, value):
            """
            Ensure the employee ID exists in SkillMatrix
            """
            try:
                SkillMatrix.objects.get(id=value.id if hasattr(value, 'id') else value)
            except SkillMatrix.DoesNotExist:
                raise serializers.ValidationError("Employee not found in skill matrix.")
            return value

# For the eligible employees endpoint
class EligibleEmployeeSerializer(serializers.ModelSerializer):
    level_value = serializers.IntegerField(source='level.level_id', read_only=True)
    is_eligible = serializers.SerializerMethodField()
    department_id = serializers.IntegerField(source='hierarchy.department.department_id', read_only=True)
    
    class Meta:
        model = SkillMatrix
        fields = ['id', 'employee_name', 'emp_id', 'level_value', 'is_eligible', 'department_id']
    
    def get_is_eligible(self, obj):
        machine_level = self.context.get('machine_level', 0)
        return obj.level.level_id >= machine_level



from rest_framework import serializers
from .models import SkillMatrixFeatureFlag

class FeatureFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMatrixFeatureFlag
        fields = ["id", "feature_name", "enabled"]

    

# ====================== Station Manager ==========================

# serializers.py

from rest_framework import serializers
from .models import StationManager, HierarchyStructure
import logging

logger = logging.getLogger(__name__)

class StationManagerSerializer(serializers.ModelSerializer):
    # Read-only names for display
    department_name = serializers.SerializerMethodField(read_only=True)
    station_name = serializers.SerializerMethodField(read_only=True)
    
    # Write-only IDs from frontend
    department_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    station_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    # Add these to prevent errors if frontend sends them, even if model doesn't use them yet
    line_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    subline_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = StationManager
        fields = [
            'id',
            'department_name',
            'station_name',
            'department_id',
            'station_id',
            'line_id',    # Added
            'subline_id', # Added
            'minimum_level_required',
            'minimum_operators'
        ]

    # --- READ LOGIC ---

    def get_department_name(self, obj):
        if obj.department:
            # Check if linked to actual Department model or just use Structure name
            if hasattr(obj.department, 'department') and obj.department.department:
                return obj.department.department.department_name
            return obj.department.structure_name
        return None

    def get_station_name(self, obj):
        if obj.station:
            if hasattr(obj.station, 'station') and obj.station.station:
                return obj.station.station.station_name
            return obj.station.structure_name
        return None

    # --- HELPER: Hierarchy Lookup ---

    def _get_hierarchy_object(self, pk, type_field):
        """
        Finds the HierarchyStructure object based on the specific entity PK.
        e.g., Finds HierarchyStructure where department__pk == pk
        """
        if pk is None:
            return None
            
        try:
            # Dynamic lookup: department__pk, station__pk, etc.
            lookup = {f"{type_field}__pk": pk}
            hierarchy_obj = HierarchyStructure.objects.filter(**lookup).first()
            
            if not hierarchy_obj:
                raise serializers.ValidationError(
                    f"Hierarchy structure not found for {type_field} ID: {pk}"
                )
            return hierarchy_obj
        except Exception as e:
            logger.error(f"Error looking up hierarchy for {type_field} {pk}: {e}")
            raise serializers.ValidationError(f"Invalid {type_field} ID provided.")

    # --- CREATE ---

    def create(self, validated_data):
        # Extract IDs
        dept_pk = validated_data.pop('department_id', None)
        station_pk = validated_data.pop('station_id', None)
        
        # Remove unused fields from validated_data before creating model
        validated_data.pop('line_id', None)
        validated_data.pop('subline_id', None)

        # Lookup Hierarchy Objects
        department_hierarchy = self._get_hierarchy_object(dept_pk, 'department')
        station_hierarchy = self._get_hierarchy_object(station_pk, 'station')

        # Create
        station_manager = StationManager.objects.create(
            department=department_hierarchy,
            station=station_hierarchy,
            **validated_data
        )
        return station_manager

    # --- UPDATE (This was missing!) ---

    def update(self, instance, validated_data):
        # 1. Extract IDs (if provided in the PUT request)
        dept_pk = validated_data.pop('department_id', None)
        station_pk = validated_data.pop('station_id', None)
        
        # Remove unused fields
        validated_data.pop('line_id', None)
        validated_data.pop('subline_id', None)

        # 2. Update Standard Fields
        instance.minimum_operators = validated_data.get('minimum_operators', instance.minimum_operators)
        instance.minimum_level_required = validated_data.get('minimum_level_required', instance.minimum_level_required)

        # 3. Update Relationships (with translation logic)
        
        # Only update department if the key was actually sent in the request
        # (Check keys in self.initial_data to distinguish between "not sent" and "sent as null")
        if 'department_id' in self.initial_data:
            instance.department = self._get_hierarchy_object(dept_pk, 'department')
            
        if 'station_id' in self.initial_data:
            instance.station = self._get_hierarchy_object(station_pk, 'station')

        instance.save()
        return instance
# ====================== Station Manager End ==========================


class CTQandPDIdepartmentSerializer(serializers.ModelSerializer):
    # Add a read-only field to show the factory's full string representation in API responses
    # This makes the API much more readable.
    factory_details = serializers.CharField(source='factory.__str__', read_only=True)

    class Meta:
        model = CTQandPDIdepartment
        # 'factory' is used for writing (it expects a factory ID)
        # 'factory_details' is used for reading (it shows the name)
        fields = ['CtqPdi_id', 'CtqPdi_name', 'factory', 'factory_details']


class StationSettingReadSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)
    option_display = serializers.CharField(source='get_option_display', read_only=True)

    class Meta:
        model = StationSetting
        # These are the fields for a SINGLE StationSetting object.
        fields = [
            'id', 
            'department', 
            'station', 
            'option', 
            'department_name', 
            'station_name',
            'option_display'
        ]

# your_app/serializers.py

from rest_framework import serializers
from .models import ManagementReviewCTQandPDI, Department

class ManagementReviewCTQandPDISerializer(serializers.ModelSerializer):
    # This makes the API response more readable by showing the department name
    # instead of just its ID. `read_only=True` means it's used for output, not input.
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    # This displays the human-readable choice name (e.g., "CTQ")
    review_type_display = serializers.CharField(source='get_review_type_display', read_only=True)

    class Meta:
        model = ManagementReviewCTQandPDI
        fields = [
            'id',
            'department', # Use the ID for creating/updating
            'department_name', # Use the name for displaying
            'review_type',
            'review_type_display',
            'month_year',
            'new_operators_joined',
            'new_operators_trained',
            'defects_msil',
            'defects_tier1',
            'internal_rejection',
            'training_actual',
            'training_plan'
        ]
        # The 'department' field will be used for writing (POST/PUT requests)
        # It expects the Department's primary key (ID).
        read_only_fields = ['department_name', 'review_type_display']

    def validate_review_type(self, value):
        """
        Prevents users from manually creating or updating a record to be of type 'TOTAL'.
        This is our API-level protection.
        """
        if value == 'TOTAL':
            raise serializers.ValidationError("Cannot manually create a 'TOTAL' review type. It is auto-generated.")
        return value

# ======================== Biometric Realtime ==========================

#Bio user test demo


# serializers.py
from .models import BioUser

class BioUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BioUser
        fields = '__all__'
        # fields = ['employeeid', 'first_name', 'last_name']
        
# ======================== Biometric Realtime End ==========================



#================== BiometricAttendance ==================#

from rest_framework import serializers
from .models import BiometricAttendance

class BiometricAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiometricAttendance
        fields = '__all__'

from .models import SystemSettings

class SystemSettingsSerializer(serializers.ModelSerializer):
    processed_folder_path = serializers.ReadOnlyField()
    path_exists = serializers.SerializerMethodField()
    processed_folder_exists = serializers.SerializerMethodField()

    class Meta:
        model = SystemSettings
        fields = [
            'id', 
            'excel_source_path', 
            'processed_folder_path',
            'path_exists',
            'processed_folder_exists',
            'updated_at'
        ]

    def get_path_exists(self, obj):
        import os
        if obj.excel_source_path:
            return os.path.exists(obj.excel_source_path)
        return False

    def get_processed_folder_exists(self, obj):
        import os
        if obj.processed_folder_path:
            return os.path.exists(obj.processed_folder_path)
        return False
    

#================== BiometricAttendance End ==================#


#--------------------------------------- Method Enable disable --------------------------------------#


from rest_framework import serializers
from .models import StationSheetConfig

class StationSheetConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = StationSheetConfig
        fields = [
            "id",
            "level_id",
            "department_id",
            "line_id",
            "subline_id",
            "station_id",
            "ojt_enabled",
            "ten_cycle_enabled",
            "skill_evaluation_enabled",
            "others_enabled",
            "evaluation_enabled",
            "maru_a_enabled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("created_at", "updated_at")
        
#================== Method Enable disable End ==================#



# STANDARD_A0001(level1revision)
# level1revision
# from rest_framework import serializers
# from .models import Question, Option # Import new models

# # ... your existing serializers ...

# class OptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Option
#         fields = ['id', 'option_text', 'is_correct']

# class QuestionSerializer(serializers.ModelSerializer):
#     # This field will be used for both reading existing options
#     # and accepting new options when creating a question.
#     options = OptionSerializer(many=True)

#     class Meta:
#         model = Question
#         fields = ['id', 'question_text', 'options', 'subtopiccontent']
#         # Make subtopiccontent write-only in this context,
#         # as it's needed for creation but not for display within the nested structure.
#         extra_kwargs = {
#             'subtopiccontent': {'write_only': True}
#         }

#     def create(self, validated_data):
#         """
#         This custom create method handles the nested options.
#         """
#         # Pop the nested options data from the validated data
#         options_data = validated_data.pop('options')
        
#         # Create the Question instance first
#         question = Question.objects.create(**validated_data)
        
#         # Now, loop through the options data and create each Option,
#         # linking it to the question we just created.
#         for option_data in options_data:
#             Option.objects.create(question=question, **option_data)
            
#         return question
    
#     def update(self, instance, validated_data):
#         # Update the question's text
#         instance.question_text = validated_data.get('question_text', instance.question_text)
#         instance.save()

#         # Get the new options data
#         options_data = validated_data.get('options')

#         # Delete old options
#         instance.options.all().delete()

#         # Create new options
#         for option_data in options_data:
#             Option.objects.create(question=instance, **option_data)

#         return instance


# from rest_framework import serializers
# from .models import Question, Option


# class OptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Option
#         fields = ['id', 'option_text', 'option_image', 'is_correct']
#         extra_kwargs = {
#             'option_image': {'required': False, 'allow_null': True}
#         }


# class QuestionSerializer(serializers.ModelSerializer):
#     options = OptionSerializer(many=True)
#     question_image = serializers.ImageField(required=False, allow_null=True, write_only=True)

#     class Meta:
#         model = Question
#         fields = [
#             'id',
#             'question_text',
#             'question_image',      # for upload
#             'question_image_url',  # for reading (added below)
#             'options',
#             'subtopiccontent',
#             'created_at'
#         ]
#         read_only_fields = ['created_at', 'question_image_url']
#         extra_kwargs = {
#             'subtopiccontent': {'write_only': True},
#         }

#     # This adds the image URL when reading (GET)
#     def to_representation(self, instance):
#         ret = super().to_representation(instance)
#         if instance.question_image:
#             ret['question_image_url'] = instance.question_image.url
#         else:
#             ret['question_image_url'] = None
#         return ret

#     def create(self, validated_data):
#         options_data = validated_data.pop('options')
#         question_image = validated_data.pop('question_image', None)

#         question = Question.objects.create(**validated_data)

#         if question_image:
#             question.question_image = question_image
#             question.save()

#         for option_data in options_data:
#             option_image = option_data.pop('option_image', None)
#             option = Option.objects.create(question=question, **option_data)
#             if option_image:
#                 option.option_image = option_image
#                 option.save()

#         return question

#     def update(self, instance, validated_data):
#         options_data = validated_data.pop('options', None)
#         question_image = validated_data.pop('question_image', None)

#         # Update question fields
#         instance.question_text = validated_data.get('question_text', instance.question_text)
#         if question_image is not None:  # Only update if sent
#             instance.question_image = question_image
#         instance.save()

#         # Replace all options (simple & safe approach)
#         if options_data is not None:
#             instance.options.all().delete()
#             for option_data in options_data:
#                 option_image = option_data.pop('option_image', None)
#                 option = Option.objects.create(question=instance, **option_data)
#                 if option_image:
#                     option.option_image = option_image
#                     option.save()

#         return instance

# serializers.py
# from rest_framework import serializers
# from .models import Question, Option


# class OptionSerializer(serializers.ModelSerializer):
#     # If you want the URL in GET responses
#     option_image_url = serializers.ImageField(source='option_image', read_only=True)

#     class Meta:
#         model = Option
#         fields = ['id', 'option_text', 'option_image', 'option_image_url', 'is_correct']


# class QuestionSerializer(serializers.ModelSerializer):
#     options = OptionSerializer(many=True)
    
#     # This is the correct way to expose the URL
#     question_image_url = serializers.ImageField(source='question_image', read_only=True)

#     class Meta:
#         model = Question
#         fields = [
#             'id',
#             'question_text',
#             'question_image',      # writable – for uploading
#             'question_image_url',  # read-only – the actual URL
#             'subtopiccontent',
#             'options'
#         ]

#     def create(self, validated_data):
#         options_data = validated_data.pop('options')
#         question = Question.objects.create(**validated_data)
#         for opt_data in options_data:
#             Option.objects.create(question=question, **opt_data)
#         return question

#     def update(self, instance, validated_data):
#         options_data = validated_data.pop('options', None)
        
#         instance.question_text = validated_data.get('question_text', instance.question_text)
#         if 'question_image' in validated_data:
#             instance.question_image = validated_data.get('question_image', instance.question_image)
#         instance.save()

#         if options_data is not None:
#             instance.options.all().delete()
#             for opt_data in options_data:
#                 Option.objects.create(question=instance, **opt_data)
#         return instance


# app1/serializers.py
from rest_framework import serializers
from .models import Question, Option

class OptionSerializer(serializers.ModelSerializer):
    option_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Option
        fields = ['id', 'option_text', 'option_image', 'option_image_url', 'is_correct']

    def get_option_image_url(self, obj):
        if obj.option_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.option_image.url)
        return None

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)
    question_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'subtopiccontent', 'question_text',
            'question_image', 'question_image_url', 'options', 'created_at'
        ]

    def get_question_image_url(self, obj):
        if obj.question_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.question_image.url)
        return None

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for opt_data in options_data:
            Option.objects.create(question=question, **opt_data)
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        instance.question_text = validated_data.get('question_text', instance.question_text)
        if 'question_image' in validated_data:
            instance.question_image = validated_data.get('question_image')
        instance.save()

        if options_data is not None:
            instance.options.all().delete()
            for opt_data in options_data:
                Option.objects.create(question=instance, **opt_data)
        return instance

# end revision






# serializers.py for viewing the superusers to assign the handover 

# Keep your existing RegisterSerializer as is, or just add 'id' to it. 
# But it is BETTER to use this dedicated serializer for the list:

class UserListSerializer(serializers.ModelSerializer):
    # We use the property from your User model for role_name
    role_name = serializers.ReadOnlyField() 
    
    class Meta:
        model = User
        # IMPORTANT: 'id' must be here!
        fields = ['id', 'employeeid', 'first_name', 'last_name', 'email', 'role_name']   

# ================== end ==================




# ============ for handover details view ==================


from rest_framework import serializers
from .models import HandoverSheet

class HandoverReportSerializer(serializers.ModelSerializer):
    # Flatten Employee Details
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    employee_lastname = serializers.CharField(source='employee.last_name', read_only=True)
    employee_id_card = serializers.CharField(source='employee.emp_id', read_only=True)
    
    # Flatten Supervisor Details
    supervisor_name = serializers.SerializerMethodField()
    supervisor_id = serializers.SerializerMethodField()
    
    # Flatten Allocation Details
    department_name = serializers.CharField(source='distributed_department_after_dojo.department_name', read_only=True)
    line_name = serializers.CharField(source='allocated_line.line_name', read_only=True)
    subline_name = serializers.CharField(source='allocated_subline.subline_name', read_only=True)
    station_name = serializers.CharField(source='allocated_station.station_name', read_only=True)

    class Meta:
        model = HandoverSheet
        fields = [
            'id',
            'employee_name',
            'employee_lastname',
            'employee_id_card',
            'supervisor_name',
            'supervisor_id',  # <--- 2. Add to fields list
            'department_name',
            'line_name',
            'subline_name',
            'station_name',
            'handover_date',
            'is_training_completed',
            'gojo_incharge_name'
        ]

    def get_supervisor_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
        return "Unassigned"
    
    def get_supervisor_id(self, obj):
        return obj.assigned_to.id if obj.assigned_to else None





# ==========================================ojt status start ================================#
# serializers.py
from rest_framework import serializers
from django.db.models import Sum, Count, Max
from .models import (
    TraineeInfo, OJTScore, OJTTopic, OJTDay,
    OJTScoreRange, OJTPassingCriteria
)


class OJTStatusScoreSerializer(serializers.ModelSerializer):
    """One score row – only the fields the UI needs."""
    topic = serializers.SerializerMethodField()

    class Meta:
        model = OJTScore
        fields = ["day", "topic", "score"]

    def get_topic(self, obj):
        return {
            "id": obj.topic.id,
            "department": obj.topic.department.department_name,
            "level": obj.topic.level_id,
        }


class OJTStatusListSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source="station.station_name", read_only=True)
    level_name   = serializers.CharField(source="level.level_name",   read_only=True)
    scores_data  = OJTStatusScoreSerializer(source="scores", many=True, read_only=True)

    # ---- NEW FIELDS -------------------------------------------------
    calculated_status = serializers.SerializerMethodField()   # Complete / Incomplete
    calculated_result = serializers.SerializerMethodField()   # Pass / Fail / N/A
    category          = serializers.SerializerMethodField()   # Production / Quality

    class Meta:
        model = TraineeInfo
        fields = [
            "id", "trainee_name", "trainer_name", "emp_id",
            "line", "subline", "station_name", "process_name",
            "status", "level", "level_name", "scores_data",
            "calculated_status", "calculated_result", "category",
        ]

    # -----------------------------------------------------------------
    def get_category(self, obj):
            """
            Return the department name (e.g. “Assembly”, “QC”, …)
            instead of Production/Quality.
            """
            # `obj` is a TraineeInfo instance.
            # The first score (if any) tells us the department.
            first_score = obj.scores.first()
            if first_score and first_score.topic and first_score.topic.department:
                return first_score.topic.department.department_name
            # Fallback – if no scores yet, try to read from the trainee’s level
            if obj.level and hasattr(obj.level, 'department'):
                return obj.level.department.department_name
            return "Unknown"
    # -----------------------------------------------------------------
    def get_calculated_status(self, obj):
        return self._compute(obj)["status"]

    def get_calculated_result(self, obj):
        return self._compute(obj)["result"]

    # -----------------------------------------------------------------
    def _compute(self, trainee: TraineeInfo):
        """
        Core logic – runs once per trainee.
        Returns {"status": "...", "result": "..."}
        """
        scores_qs = trainee.scores.select_related(
            "topic__department", "topic__level", "day"
        )
        if not scores_qs.exists():
            return {"status": "Incomplete", "result": "N/A"}

        # -------------------------------------------------------------
        # 1. Department & Level (same for every score of a trainee)
        # -------------------------------------------------------------
        first = scores_qs.first()
        dept = first.topic.department
        lvl  = first.topic.level

        # -------------------------------------------------------------
        # 2. Required days for this dept+level
        # -------------------------------------------------------------
        required_days = list(
            OJTDay.objects.filter(department=dept, level=lvl)
            .values_list("id", flat=True)
            .distinct()
        )
        if not required_days:
            return {"status": "Incomplete", "result": "N/A"}

        # -------------------------------------------------------------
        # 3. Max score per topic (same for the whole dept+level)
        # -------------------------------------------------------------
        try:
            max_per_topic = OJTScoreRange.objects.get(department=dept, level=lvl).max_score
        except OJTScoreRange.DoesNotExist:
            max_per_topic = 10   # fallback – you can change it

        # -------------------------------------------------------------
        # 4. All topics that belong to this dept+level
        # -------------------------------------------------------------
        all_topics = list(
            OJTTopic.objects.filter(department=dept, level=lvl)
            .values_list("id", flat=True)
        )
        total_topics = len(all_topics)

        # -------------------------------------------------------------
        # 5. Walk through every required day
        # -------------------------------------------------------------
        all_days_complete = True
        all_days_full     = True   # every topic == max_per_topic

        for day_id in required_days:
            day_scores = scores_qs.filter(day_id=day_id)

            # ---- a) missing topics → incomplete day -----------------
            if day_scores.count() < total_topics:
                all_days_complete = False
                # we can break early if you want to short-circuit
                # continue

            # ---- b) sum of scores -----------------------------------
            total_score = day_scores.aggregate(s=Sum("score"))["s"] or 0
            max_possible = total_topics * max_per_topic
            percentage   = (total_score / max_possible) * 100 if max_possible else 0

            # ---- c) required % for this day -------------------------
            crit = (
                OJTPassingCriteria.objects.filter(department=dept, level=lvl, day_id=day_id).first()
                or OJTPassingCriteria.objects.filter(department=dept, level=lvl, day__isnull=True).first()
            )
            required_pct = crit.percentage if crit else 80

            if percentage < required_pct:
                all_days_full = False

            # ---- d) every single topic must be == max_per_topic -----
            # (this is the “full mark” rule you asked for)
            if day_scores.filter(score__lt=max_per_topic).exists():
                all_days_full = False

        # -------------------------------------------------------------
        # 6. Final decision
        # -------------------------------------------------------------
        status = "Complete" if all_days_complete else "Incomplete"
        result = (
            "N/A"
            if status == "Incomplete"
            else ("Pass" if all_days_full else "Fail")
        )
        return {"status": status, "result": result}
    


#=====================================ojt status end ===============================#




# # serializers.py
# from rest_framework import serializers
# from .models import OperatorPerformanceEvaluation, TenCyclePassingCriteria, MasterTable, Department

# class TenCycleStatusSerializer(serializers.ModelSerializer):
#     employee_name = serializers.CharField(source='employee.name', read_only=True)
#     emp_id = serializers.CharField(source='employee.emp_id', read_only=True)
#     department_name = serializers.CharField(source='department.name', read_only=True)
#     station_name = serializers.CharField(source='station.name', read_only=True)
#     level_name = serializers.CharField(source='level.name', read_only=True)

#     passing_percentage = serializers.SerializerMethodField()
#     calculated_status = serializers.SerializerMethodField()
#     calculated_result = serializers.SerializerMethodField()

#     class Meta:
#         model = OperatorPerformanceEvaluation
#         fields = [
#             'id',
#             'emp_id',
#             'employee_name',
#             'date',
#             'shift',
#             'department_name',
#             'station_name',
#             'level_name',
#             'line',
#             'operation_no',
#             'final_percentage',
#             'final_status',
#             'is_completed',
#             'passing_percentage',
#             'calculated_status',
#             'calculated_result',
#         ]

#     def get_passing_percentage(self, obj):
#         try:
#             crit = TenCyclePassingCriteria.objects.get(
#                 level=obj.level,
#                 department=obj.department,
#                 station=obj.station
#             )
#             return crit.passing_percentage
#         except TenCyclePassingCriteria.DoesNotExist:
#             return 60.0

#     def get_calculated_status(self, obj):
#         # If evaluation is marked complete in DB
#         return "Complete" if obj.is_completed else "Incomplete"

#     def get_calculated_result(self, obj):
#         if not obj.is_completed:
#             return "N/A"
#         if obj.final_status == "Pass":
#             return "Pass"
#         elif obj.final_status == "Fail - Retraining Required":
#             return "Fail"
#         return "N/A"


# serializers.py
class TenCycleStatusSerializer(serializers.ModelSerializer):
    emp_id = serializers.CharField(source='employee.emp_id', read_only=True)
    
    # CORRECT WAY: Combine first_name + last_name
    employee_name = serializers.SerializerMethodField()

    department_name = serializers.CharField(source='department.department_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True, allow_null=True)
    level_name = serializers.CharField(source='level.level_name', read_only=True)

    line = serializers.CharField(allow_null=True, read_only=True)
    operation_no = serializers.CharField(allow_null=True, read_only=True)
    passing_percentage = serializers.SerializerMethodField()

    class Meta:
        model = OperatorPerformanceEvaluation
        fields = [
            'id',
            'emp_id',
            'employee_name',        # ← Now works!
            'date',
            'shift',
            'department_name',
            'station_name',
            'level_name',
            'line',
            'operation_no',
            'final_percentage',
            'final_status',
            'is_completed',
            'date_of_retraining_completed',
            'passing_percentage',
            'created_at',
        ]

    # This method combines first_name and last_name
    def get_employee_name(self, obj):
        if not obj.employee:
            return "Unknown Employee"
        first = (obj.employee.first_name or "").strip()
        last = (obj.employee.last_name or "").strip()
        if first and last:
            return f"{first} {last}"
        elif first:
            return first
        elif last:
            return last
        else:
            return f"Employee {obj.employee.emp_id}"  # fallback

    def get_passing_percentage(self, obj):
        from .models import TenCyclePassingCriteria
        try:
            criteria = TenCyclePassingCriteria.objects.get(
                level=obj.level,
                department=obj.department,
                station=obj.station
            )
            return criteria.passing_percentage
        except TenCyclePassingCriteria.DoesNotExist:
            return 60.0
        

# ========================skill evaluation===========================
from rest_framework import serializers
from .models import EvaluationLevel2, EvaluationScore, MasterTable
import django.db.transaction # Import transaction module



class EvaluationScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationScore
        fields = ['criteria_text', 'initial_score', 'reevaluation_score']



class EvaluationLevel2Serializer(serializers.ModelSerializer):
    scores = EvaluationScoreSerializer(many=True)
    employee = serializers.SlugRelatedField(
        slug_field='emp_id',
        queryset=MasterTable.objects.all()
    )
    employee_id_str = serializers.CharField(source='employee.emp_id', read_only=True)
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source='department.department_name', read_only=True)


    class Meta:
        model = EvaluationLevel2
        fields = [
            'id', 
            'employee',
            'department',
            'department_name',
            'level',
            'level_name',
            'employee_id_str', 
            'station_name', 
            'evaluation_date', 
            'dojo_incharge_name', 
            'area_incharge_name', 
            'total_marks', 
            'status', 
            'scores',
            'snapshot_full_name',
            'snapshot_department',
            'snapshot_designation',
            'snapshot_date_of_joining',
            'created_at'
        ]
        read_only_fields = [
            'status', 
            'snapshot_full_name', 
            'snapshot_department',
            'snapshot_designation',
            'snapshot_date_of_joining'
        ]

        extra_kwargs = {
            'employee': {'write_only': True}
        }

    def _calculate_status(self, scores_data):
        initial_fail = any(score.get('initial_score') == 'X' for score in scores_data)
        if not initial_fail:
            return EvaluationLevel2.STATUS_PASS

        re_eval_attempted = any(score.get('reevaluation_score') is not None for score in scores_data)
        if not re_eval_attempted:
            return EvaluationLevel2.STATUS_FAIL

        re_eval_fail = any(score.get('reevaluation_score') == EvaluationScore.SCORE_NG for score in scores_data)
        if re_eval_fail:
            return EvaluationLevel2.STATUS_RE_EVAL_FAIL
        else:
            return EvaluationLevel2.STATUS_RE_EVAL_PASS


    @django.db.transaction.atomic
    def create(self, validated_data):
        scores_data = validated_data.pop('scores')
        validated_data['status'] = self._calculate_status(scores_data)

        # --- ✅ CORRECTED LOGIC ---
        # 1. Create a model instance in memory, but don't hit the database yet.
        evaluation = EvaluationLevel2(**validated_data)

        # 2. Now, explicitly call the .save() method. 
        #    This will trigger your custom logic in models.py to populate the snapshot fields.
        evaluation.save()
        # --- END OF FIX ---

        # The rest of the code remains the same
        for score_data in scores_data:
            EvaluationScore.objects.create(evaluation=evaluation, **score_data)
        return evaluation

    def update(self, instance, validated_data):
        """
        Handle updates for the evaluation and its nested scores.
        """

        scores_data = validated_data.pop('scores', None)

        instance = super().update(instance, validated_data)

        if scores_data is not None:

            instance.scores.all().delete()
            

            for score_data in scores_data:
                EvaluationScore.objects.create(evaluation=instance, **score_data)

            instance.status = self._calculate_status(scores_data)
            instance.save()

        return instance


from rest_framework import serializers
from .models import EvaluationCriterion

class EvaluationCriterionSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    class Meta:
        model = EvaluationCriterion
        fields = ['id', 'level', 'level_name', 'criteria_text', 'display_order', 'is_active']

        # extra_kwargs = {
        #     'level': {'write_only': True}
        # }
        

# ========================skill evaluation===========================




# ======================== ACTION PLAN ================

# app/serializers.py
from rest_framework import serializers
from .models import ActionItem, ActionItemRejection

class ActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItem
        fields = ['id', 'topic', 'subtopic', 'date']



class ActionItemRejectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItemRejection
        fields = ['id', 'topic', 'subtopic', 'date']


# ========================== END =======================

# =================minimum level required for multiskilling ==============
from.models import MultiSkillingConfig
class MultiSkillingConfigSerializer(serializers.ModelSerializer):
    minimum_level_name = serializers.CharField(
        source="minimum_level.level_name", 
        read_only=True
    )
    # Send back the level_id that was saved
    minimum_level_value = serializers.IntegerField(
        source="minimum_level.level_id",
        read_only=True
    )
    
    class Meta:
        model = MultiSkillingConfig
        fields = [
            "id", 
            "minimum_level",  # This accepts level_id for input
            "minimum_level_value",  # This returns level_id for display
            "minimum_level_name", 
            "updated_by",
            "created_at", 
            "updated_at"
        ]
    
    def validate_minimum_level(self, value):
        """Ensure the level exists - value is a Level instance"""
        if not value:
            raise serializers.ValidationError("Minimum level is required")
        return value


# multiskilling time interval setting  =======================================================================================
from.models import GlobalSkillTimeInterval
class GlobalSkillTimeIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSkillTimeInterval
        fields = [
            "id",
            "time_interval_days",
            "is_enabled",
            "updated_by",
            "created_at",
            "updated_at"
        ]
    
    def validate_time_interval_days(self, value):
        """Ensure time interval is positive"""
        if value < 1:
            raise serializers.ValidationError("Time interval must be at least 1 day")
        return value


class EmployeeSkillCheckSerializer(serializers.Serializer):
    """Serializer for checking if employee can be assigned a new skill"""
    employee_id = serializers.CharField()


from rest_framework import serializers
from .models import ExamToolFile
import os

class ExamToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamToolFile
        fields = ['file', 'uploaded_at']

    def validate_file(self, value):
        # Define allowed extensions
        allowed_extensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso']
        
        # Get extension from uploaded file
        ext = os.path.splitext(value.name)[1].lower()
        
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        return value
    




from rest_framework import serializers
from .models import AnimationVideo

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnimationVideo
        fields = ['id', 'topic', 'video_file', 'uploaded_at']
