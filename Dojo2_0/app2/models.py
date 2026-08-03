from django.db import models
from django.db.models import Q
from django.conf import settings 
from django.core.validators import MinValueValidator, MaxValueValidator

# 1. LMS PROFILE (Formerly User)
# We kept firstName and userType here so you don't have to change your Frontend code.
class LMSProfile(models.Model):
    # LINK TO DOJO USER
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='lms_profile'
    )

    # We keep these fields so your LMS Frontend doesn't break
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=15, blank=True, null=True)
    
    # Kept for frontend compatibility, but now mirrors the assigned RBAC role.
    userType = models.CharField(max_length=50, blank=True, default='')
    designation = models.CharField(max_length=100, blank=True, null=True, default='Employee')
    department = models.CharField(max_length=100, blank=True, null=True, default='General')
    hq = models.CharField(max_length=100, blank=True, null=True, default='hq')
    bu = models.CharField(max_length=100, blank=True, null=True, default='bu')
    section = models.CharField(max_length=100, blank=True, null=True, default='section')



    
    bio = models.TextField(blank=True, null=True)
    companyName = models.CharField(max_length=100, blank=True, null=True)
    profileImage = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"LMS Profile: {self.firstName} {self.lastName}"

# ---------------------------------------------------------
# 2. OTHER MODELS (Updated to point to settings.AUTH_USER_MODEL)
# ---------------------------------------------------------

class Course(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=200)
    instructor_name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    duration = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='')
    introduction = models.TextField(blank=True, default='')
    tags = models.JSONField(default=list)
    questions = models.PositiveIntegerField(default=0)
    photo = models.ImageField(upload_to='course_photos/', blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    
    # Updated Foreign Key
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.CharField(
        max_length=100, 
        default='General', 
        blank=True, 
        help_text="The department this course belongs to (e.g., IT, Sales, HR)"
    )
    

    class Meta:
        ordering = ['-created']
    def __str__(self): return self.title

class CourseStats(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='stats')
    accuracy = models.PositiveIntegerField(default=0)
    completion = models.PositiveIntegerField(default=0)
    enrolled = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    duration = models.CharField(max_length=50)
    def __str__(self): return f"Stats for {self.course.title}"

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='roadmap')
    title = models.CharField(max_length=200)
    duration = models.CharField(max_length=20)
    completed = models.BooleanField(default=False)
    sample = models.BooleanField(default=False)
    content = models.TextField()
    video = models.FileField(upload_to='lesson_videos/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta: ordering = ['order']
    def __str__(self): return f"{self.course.title} - {self.title}"

class LessonVideo(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='videos')
    file = models.FileField(upload_to='lesson_videos/')
    name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video: {self.name} for {self.lesson.title}"



class Test(models.Model):    # Test Type Choices
    class TestType(models.TextChoices):
        PRE_TEST = 'pre', 'Pre Test'
        POST_TEST = 'post', 'Post Test'
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=200)
    test_type = models.CharField(
        max_length=10,
        choices=TestType.choices,
        default=TestType.PRE_TEST,
        help_text="Type of test: Pre-test (before course) or Post-test (after course)"
    )
    order = models.PositiveIntegerField(default=0, help_text="Determines position in the course content list.")
    passing_criteria = models.PositiveIntegerField(
        default=0, 
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    total_time = models.PositiveIntegerField(default=30, help_text="Time limit in minutes")
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.get_test_type_display()}: {self.title} for {self.course.title}"
    
    @property
    def is_pre_test(self):
        return self.test_type == self.TestType.PRE_TEST
    
    @property
    def is_post_test(self):
        return self.test_type == self.TestType.POST_TEST

class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    order = models.PositiveIntegerField(default=0)
    class Meta: ordering = ['order']
    def __str__(self): return self.question_text[:50]

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    def __str__(self): return self.text



class LessonProgress(models.Model):
    # Updated Foreign Key
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ('user', 'course', 'lesson')
    def __str__(self): return f"{self.user.email} - {self.lesson.title}"

class AnswerSubmission(models.Model):
    # Updated Foreign Key
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='submissions')
    answers = models.JSONField(default=dict)
    score = models.IntegerField(default=0)
    passed = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
    # class Meta:
        # unique_together = ('user', 'test')
        # verbose_name = "Answer Submission"
        # verbose_name_plural = "Answer Submissions"
    def __str__(self): return f"{self.user.email} - {self.test.title}"

class TestProgress(models.Model):
    # Updated Foreign Key
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    submission = models.OneToOneField(AnswerSubmission, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('user', 'test')
        verbose_name = "Test Progress"
        verbose_name_plural = "Test Progress"
    def __str__(self): return f"{self.user.email} - {self.test.title}"


class Group(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_groups")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='groups')
    description = models.TextField(blank=True, null=True)  
    
    # Here is the trick: We check the PROFILE userType, not the user model directly
    team_leaders = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='led_groups',
        limit_choices_to=Q(role__permissions__codename__in=['create_groups', 'update_groups', 'manage_groups']),
        blank=True
    )
    employees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='member_of_groups',
        limit_choices_to=Q(role__permissions__codename='view_courses') & ~Q(role__permissions__codename='manage_courses'),
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return self.name
    class Meta: ordering = ['-created_at']

class CourseAssignment(models.Model):
    
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='assigned_courses',
        limit_choices_to=Q(role__permissions__codename__in=['view_courses', 'create_courses', 'update_courses']) & ~Q(role__permissions__codename='manage_courses')
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='assignments_created')
    assigned_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    is_pretest_completed = models.BooleanField(default=False)
    assigned_level = models.CharField(max_length=20, blank=True, null=True) # Beginner/Inter/Advanced
    is_course_completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True) 

    STATUS_CHOICES = [
        ('pending_pretest', 'Pending Pre-test'),
        ('in_progress', 'Learning'),
        ('ready_for_posttest', 'Ready for Post-test'),
        ('completed', 'Completed'),
        ('failed_retaking', 'Failed - Retaking'),
    ]
    current_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_pretest')
    class Meta:
        unique_together = ('employee', 'course')
        ordering = ['-assigned_at']
    def __str__(self): return f"{self.course.title} assigned to {self.employee.email}"




class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Urgent'),
    ]

    # CHANGE 'related_name' HERE:
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='lms_notifications'  # <--- Was 'notifications'
    )
    related_object_id = models.IntegerField(null=True, blank=True) 

    
    # CHANGE 'related_name' HERE TOO (Just to be safe):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='lms_sent_notifications' # <--- Was default or 'sent_notifications'
    )

    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.email} - {self.title}"
    
# Add these to your existing models.py

class PreTestResult(models.Model):
    """Stores marks specifically for Pre-Tests"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='pre_test_results'
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='pre_test_results'
    )
    test = models.ForeignKey(
        Test, 
        on_delete=models.CASCADE, 
        related_name='pre_test_results',
        null=True,
        blank=True
    )
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    assigned_level = models.CharField(max_length=20, default='Beginner')
    time_taken = models.PositiveIntegerField(default=0, help_text="Time in seconds")
    answers_snapshot = models.JSONField(default=dict, blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')
        verbose_name = "Pre-Test Result"
        verbose_name_plural = "Pre-Test Results"
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.email} - {self.course.title} Pre-Test: {self.percentage}%"

    def save(self, *args, **kwargs):
        # Auto-calculate percentage
        if self.total_questions > 0:
            self.percentage = round((self.score / self.total_questions) * 100, 2)
        
        # Auto-assign level based on percentage
        if self.percentage >= 70:
            self.assigned_level = 'Advanced'
        elif self.percentage >= 40:
            self.assigned_level = 'Intermediate'
        else:
            self.assigned_level = 'Beginner'
        
        super().save(*args, **kwargs)



class PostTestResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='post_test_results'
    )
    course = models.ForeignKey(
        'Course', 
        on_delete=models.CASCADE,
        related_name='post_test_results'
    )
    test = models.ForeignKey(
        'Test', 
        on_delete=models.CASCADE,
        related_name='post_test_results',
        null=False,
        default=1 
    )
    attempt_number = models.PositiveIntegerField(default=1)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    passed = models.BooleanField(default=False)
    answers_snapshot = models.JSONField(default=dict)
    time_taken = models.IntegerField(default=0)  # in seconds
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']
        verbose_name = "Post Test Result"
        verbose_name_plural = "Post Test Results"

    def __str__(self):
        return f"{self.user.email} - {self.test.title} - Attempt {self.attempt_number}"

    def save(self, *args, **kwargs):
        # Auto-calculate percentage if not set
        if self.total_questions > 0 and self.percentage == 0:
            self.percentage = round((self.score / self.total_questions) * 100, 2)
        # Auto-determine passed status
        if self.test and self.percentage >= self.test.passing_criteria:
            self.passed = True
        super().save(*args, **kwargs)


class EmployeeGrowthReport(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='employeegrowthreport_set'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    pre_test_date = models.DateTimeField(null=True, blank=True)
    pre_test_score = models.IntegerField(null=True, blank=True) # Assuming score is an integer (e.g., number of correct answers)
    pre_test_total = models.IntegerField(null=True, blank=True) # Assuming this is the total possible score or total questions
    pre_test_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    post_test_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    score_improvement = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    growth_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    growth_status = models.CharField(max_length=50, null=True, blank=True) # e.g., 'exceptional', 'minimal'
    growth_status_display = models.CharField(max_length=50, null=True, blank=True) # e.g., 'Exceptional Growth'
    initial_level = models.CharField(max_length=100, null=True, blank=True)
    final_passed = models.BooleanField(default=False)
    total_attempts = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'course') 
        ordering = ['-updated_at']


class LessonAttachment(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="lesson_materials/", blank=True, null=True)
    url_link = models.URLField(max_length=2048, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name or 'File'} for {self.lesson.title}"


class TrainingSchedule(models.Model):
    STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('Actual', 'Actual'),
        ('Cancelled', 'Cancelled'),
    ]
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='schedules')
    date = models.DateField()
    topic = models.CharField(max_length=255) # "Training Topic"
    trainer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    trainer_name_text = models.CharField(max_length=255, blank=True, null=True) # Fallback if no user ID
    duration = models.CharField(max_length=50) # e.g. "2 Hours"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.date} - {self.topic}"
    
# app2/models.py


class GroupMessage(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender.email} in {self.group.name}: {self.content[:20]}"
    
from django.db import models
from django.conf import settings

# ... existing imports ...

class CourseEnrollmentRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollment_requests')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollment_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    requested_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user} -> {self.course} ({self.status})"
    

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

User = settings.AUTH_USER_MODEL

# =====================================================
# 1. COMPETENCY LIBRARY (Minimal)
# =====================================================

class CompetencyCategory(models.Model):
    """Category like Technical, Behavioral"""
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, default='layers') # frontend icon name
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Competency(models.Model):
    """Individual Skill (e.g., 'Advanced Python', 'Team Leadership')"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    # Questions will be linked here via Foreign Key
    category = models.ForeignKey(CompetencyCategory, on_delete=models.CASCADE, related_name='competencies')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class AssessmentQuestion(models.Model):
    """Stores the questions created in the 'Create Competency' screen"""
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, default='multiple_choice') # For future use
    points = models.PositiveIntegerField(default=10)

    def __str__(self):
        return self.question_text
    
class CompetencyLevel(models.Model):
    """Proficiency Levels (1-5)"""
    level = models.PositiveIntegerField(unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    color = models.CharField(max_length=50, default='text-gray-600') # Frontend color class

    def __str__(self):
        return f"Level {self.level}: {self.title}"


class CompetencyRule(models.Model):
    """
    Defines required skills for any combination of hierarchy levels.
    All fields are nullable to allow flexible rules (e.g., Rule for HQ only, or Rule for Designation only).
    """
    name = models.CharField(max_length=255)
    financial_year = models.CharField(max_length=20, default="FY 2024-25")
    
    # Hierarchy Fields (All Optional)
    hq = models.CharField(max_length=100, blank=True, null=True)
    business_unit = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True) 
    section = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name



class RuleCompetency(models.Model):
    """Links a Rule to a Competency with a target level"""
    rule = models.ForeignKey(CompetencyRule, on_delete=models.CASCADE, related_name='rule_competencies')
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    target_level = models.PositiveIntegerField(default=3)

    class Meta:
        unique_together = ['rule', 'competency']


# =====================================================
# 3. MATRIX (Employee Data)
# =====================================================

class EmployeeCompetencyMatrix(models.Model):
    """Stores the actual level of an employee for a competency"""
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='competency_matrix')
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    
    actual_level = models.PositiveIntegerField(default=1)
    target_level = models.PositiveIntegerField(default=3) # Copied from Rule or set manually
    
    source = models.CharField(max_length=50, default='Manual') # 'Manager', 'Assessment'
    assessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['employee', 'competency']

from django.db import models

class OrganizationNode(models.Model):
    ORG_TYPES = [
        ('hq', 'Headquarters'),
        ('bu', 'Business Units'),
        ('dept', 'Departments'),
        ('section', 'Sections'),
        ('designation', 'Designations'), 
    ]

    name = models.CharField(max_length=255)
    org_type = models.CharField(max_length=20, choices=ORG_TYPES)
    location = models.CharField(max_length=255, blank=True, null=True)
    

    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.name} ({self.get_org_type_display()})"


# app1/models.py

class CompetencyAssessmentLog(models.Model):
    """
    Stores every single assessment attempt.
    This allows us to show a history graph/log in the frontend.
    """
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessment_logs')
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    level = models.PositiveIntegerField() # 1 to 5
    score = models.IntegerField(default=0) # e.g., 80
    total_score = models.IntegerField(default=100) # e.g., 100
    assessed_at = models.DateTimeField(auto_now_add=True)
    assessed_by = models.CharField(max_length=150, default="System")

    class Meta:
        ordering = ['-assessed_at'] # Newest first

    def __str__(self):
        return f"{self.employee.email} - {self.competency.title} - {self.score}"
    

class ChatSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=255, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.title}"

class ChatMessage(models.Model):
    SENDER_CHOICES = [('user', 'User'), ('ai', 'AI')]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']




class GeneratedMedia(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('video', 'Video'),
        ('ppt', 'PowerPoint'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    url = models.URLField(max_length=500, null=True, blank=True)
    file = models.FileField(upload_to='ai_media/', null=True, blank=True)
    prompt = models.TextField(null=True, blank=True)
    model_used = models.CharField(max_length=50, default="Kling AI")
    duration = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Generated Media"

    def __str__(self):
        return f"{self.type.upper()}: {self.title}"
