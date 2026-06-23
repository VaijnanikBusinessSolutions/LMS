from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
import logging

# IMPORT YOUR NEW PROFILE MODEL
from .models import (
    Competency, CompetencyCategory, CompetencyLevel, CompetencyRule, EmployeeCompetencyMatrix, EmployeeGrowthReport, GeneratedMedia, LMSProfile, Course, CourseStats, Lesson, LessonAttachment, LessonVideo,PostTestResult, PreTestResult, RuleCompetency,
    Test, Question, Option, LessonProgress, 
    AnswerSubmission, TestProgress, Group, 
    CourseAssignment, Notification, TrainingSchedule
)

# Get the Standard Dojo User (The Master User)
User = get_user_model()
logger = logging.getLogger(__name__)

# =====================================================
# 1. USER / PROFILE SERIALIZER (Replaces old UserSerializer)
# =====================================================
class LMSProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    id = serializers.IntegerField(source='user.id', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    
    # ADD THESE TWO LINES:
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    is_superuser = serializers.BooleanField(source='user.is_superuser', read_only=True)

    class Meta:
        model = LMSProfile
        fields = [
            'id', 'email', 'firstName', 'lastName', 'userType',
            'phoneNumber', 'bio', 'companyName', 'profileImage',
            'is_active', 
            'is_staff',     
            'is_superuser',
            'designation', 'department','hq','bu','section', 
        ]


# =====================================================
# 2. COURSE & LESSON SERIALIZERS
# =====================================================

class CourseStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseStats
        fields = ['accuracy', 'completion', 'enrolled', 'rating', 'duration']

class LessonAttachmentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False, allow_null=True)
    course_title = serializers.CharField(source='lesson.course.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    
    class Meta:
        model = LessonAttachment
        fields = ['id', 'lesson', 'name', 'file', 'url_link', 'course_title','lesson_title', 'created_at']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.file:
            request = self.context.get("request")
            url = instance.file.url
            rep["file"] = request.build_absolute_uri(url) if request else url
        else:
            rep["file"] = None
        return rep

    def validate(self, attrs):
        if self.instance is None and not (attrs.get("file") or attrs.get("url_link")):
            raise serializers.ValidationError("Provide either a file or a url_link.")
        return attrs
    
class LessonVideoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = LessonVideo
        fields = ['id', 'name', 'file', 'url', 'created_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None
    

class LessonSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    videoUrl = serializers.SerializerMethodField()
    videos = LessonVideoSerializer(many=True, read_only=True)
    video = serializers.FileField(write_only=True, required=False, allow_null=True)
    attachments = LessonAttachmentSerializer(many=True, read_only=True) 
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'duration', 'completed', 'sample', 'content', 
            'order', 'video', 'videoUrl', 'attachments', 'videos',
        ]


    def get_videoUrl(self, obj):
        request = self.context.get('request')
        if obj.video and hasattr(obj.video, 'url'):
            return request.build_absolute_uri(obj.video.url) if request else obj.video.url
        return None

# =====================================================
# 3. TEST / QUESTIONS (Unchanged logic, just imports)
# =====================================================
class OptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    question = serializers.CharField(source='question_text')
    options = OptionSerializer(many=True, required=False)
    class Meta:
        model = Question
        fields = ['id', 'question', 'order', 'options']

class TestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    questions = QuestionSerializer(many=True, required=False)
    test_type_display = serializers.CharField(source='get_test_type_display', read_only=True)
    
    class Meta:
        model = Test
        fields = [
            'id', 
            'title', 
            'test_type',
            'test_type_display',  # Human-readable version
            'order', 
            'passing_criteria', 
            'total_time', 
            'questions'
        ]

    def _update_or_create_questions(self, test, questions_data):
        kept_q_ids = []
        for q_data in questions_data:
            q_id = q_data.pop('id', None)
            options_data = q_data.pop('options', [])
            if q_id:
                Question.objects.filter(id=q_id, test=test).update(**q_data)
                question = Question.objects.get(id=q_id)
                self._update_or_create_options(question, options_data)
                kept_q_ids.append(q_id)
            else:
                new_q = Question.objects.create(test=test, **q_data)
                self._update_or_create_options(new_q, options_data)
                kept_q_ids.append(new_q.id)
        test.questions.exclude(id__in=kept_q_ids).delete()

    def _update_or_create_options(self, question, options_data):
        kept_opt_ids = []
        for opt_data in options_data:
            opt_id = opt_data.pop('id', None)
            if opt_id:
                Option.objects.filter(id=opt_id, question=question).update(**opt_data)
                kept_opt_ids.append(opt_id)
            else:
                new_opt = Option.objects.create(question=question, **opt_data)
                kept_opt_ids.append(new_opt.id)
        question.options.exclude(id__in=kept_opt_ids).delete()

    @transaction.atomic
    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        test = Test.objects.create(**validated_data)
        self._update_or_create_questions(test, questions_data)
        return test
        
    @transaction.atomic
    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', None)
        
        # Update all fields
        instance.title = validated_data.get('title', instance.title)
        instance.test_type = validated_data.get('test_type', instance.test_type)
        instance.order = validated_data.get('order', instance.order)
        instance.passing_criteria = validated_data.get('passing_criteria', instance.passing_criteria)
        instance.total_time = validated_data.get('total_time', instance.total_time)
        instance.save()
        
        if questions_data is not None:
            self._update_or_create_questions(instance, questions_data)
        return instance
    

# =====================================================
# 4. COURSE SERIALIZER (Fully Nested)
# =====================================================
class CourseSerializer(serializers.ModelSerializer):
    stats   = CourseStatsSerializer(required=False)
    roadmap = LessonSerializer(many=True, required=False)
    tests   = TestSerializer(many=True, required=False)
    description = serializers.CharField(required=False, allow_blank=True, default='')
    introduction = serializers.CharField(required=False, allow_blank=True, default='')


    class Meta:
        model = Course
        fields = [
            'id', 'title', 'instructor_name', 'level', 'duration',
            'description', 'introduction', 'tags', 'questions', 'photo',
            'updated', 'created', 'is_published','department',
            'stats', 'roadmap', 'tests',
        ]
        read_only_fields = ['created', 'updated']
        extra_kwargs = {'photo': {'required': False}}

    @staticmethod
    def _pop_file_if_not_uploaded(data, field):
        value = data.get(field)
        if value is not None and not hasattr(value, 'read'):
         data.pop(field)

    def _handle_stats(self, course, stats_data):
        defaults = {
            'accuracy': 0, 'completion': 0, 'enrolled': 0,
            'rating': 0.0, 'duration': '0 hours'
        }
        defaults.update(stats_data or {})
        stats, _ = CourseStats.objects.get_or_create(course=course, defaults=defaults)
        for attr, val in defaults.items():
            setattr(stats, attr, val)
        stats.save()

    def _handle_roadmap(self, course, roadmap_data):
        if roadmap_data is None: return
        existing_by_id = {l.id: l for l in course.roadmap.all()}
        kept_ids = []
        for pos, lesson_data in enumerate(roadmap_data, start=1):
            lesson_data = lesson_data.copy()
            self._pop_file_if_not_uploaded(lesson_data, 'video')
            lesson_id = lesson_data.pop('id', None)
            if lesson_id and lesson_id in existing_by_id:
                lesson = existing_by_id[lesson_id]
                for k, v in lesson_data.items(): setattr(lesson, k, v)
                lesson.save()
                kept_ids.append(lesson.id)
            else:
                new_l = Lesson.objects.create(course=course, **lesson_data)
                kept_ids.append(new_l.id)
        course.roadmap.exclude(id__in=kept_ids).delete()

    def _update_or_create_tests(self, course, tests_data):
        kept_test_ids = []
        for test_data in tests_data:
            test_data = test_data.copy()
            test_id = test_data.pop('id', None)
            questions_data = test_data.pop('questions', [])
            if 'passing_criteria' not in test_data: test_data['passing_criteria'] = 70
            if 'total_time' not in test_data: test_data['total_time'] = 30
            
            if test_id:
                Test.objects.filter(id=test_id, course=course).update(**test_data)
                test = Test.objects.get(id=test_id)
            else:
                test = Test.objects.create(course=course, **test_data)

            # (Questions logic same as TestSerializer helper - abbreviated here for space, 
            # but relies on the structure used in TestSerializer)
            # ... [Logic assumed handled by TestSerializer logic or explicit copy here]
            # Ideally call the TestSerializer helper if extracted.
            
            # Re-using logic from TestSerializer loop for safety:
            kept_q_ids = []
            for q_data in questions_data:
                q_data = q_data.copy()
                q_id = q_data.pop('id', None)
                options_data = q_data.pop('options', [])
                if q_id:
                    Question.objects.filter(id=q_id, test=test).update(**q_data)
                    q = Question.objects.get(id=q_id)
                else:
                    q = Question.objects.create(test=test, **q_data)
                
                # Options
                kept_opt_ids = []
                for opt_data in options_data:
                    opt_id = opt_data.pop('id', None)
                    if opt_id:
                        Option.objects.filter(id=opt_id, question=q).update(**opt_data)
                        kept_opt_ids.append(opt_id)
                    else:
                        new_opt = Option.objects.create(question=q, **opt_data)
                        kept_opt_ids.append(new_opt.id)
                q.options.exclude(id__in=kept_opt_ids).delete()
                kept_q_ids.append(q.id)
            test.questions.exclude(id__in=kept_q_ids).delete()
            kept_test_ids.append(test.id)
        course.tests.exclude(id__in=kept_test_ids).delete()

    @transaction.atomic
    def create(self, validated_data):
        stats_data = validated_data.pop('stats', {})
        roadmap_data = validated_data.pop('roadmap', [])
        tests_data = validated_data.pop('tests', [])
        course = Course.objects.create(**validated_data)
        self._handle_stats(course, stats_data)
        self._handle_roadmap(course, roadmap_data)
        if tests_data: self._update_or_create_tests(course, tests_data)
        return course

    @transaction.atomic
    def update(self, instance, validated_data):
        stats_data = validated_data.pop('stats', None)
        roadmap_data = validated_data.pop('roadmap', None)
        tests_data = validated_data.pop('tests', None)
        for attr, value in validated_data.items(): setattr(instance, attr, value)
        instance.save()
        if stats_data is not None: self._handle_stats(instance, stats_data)
        if roadmap_data is not None: self._handle_roadmap(instance, roadmap_data)
        if tests_data is not None: self._update_or_create_tests(instance, tests_data)
        return instance


# =====================================================
# 5. SUBMISSIONS & PROGRESS
# =====================================================

class AnswerSubmissionSerializer(serializers.ModelSerializer):
    # Explicitly define the test field
    test = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all())
    answers = serializers.JSONField()
    
    class Meta:
        model = AnswerSubmission
        fields = ['id', 'test', 'answers', 'score', 'passed', 'submitted_at']
        read_only_fields = ['score', 'passed', 'submitted_at', 'id']
    
    def validate_answers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("answers must be a dictionary")
        if len(value) == 0:
            raise serializers.ValidationError("answers cannot be empty")
        return value
    
    def validate(self, attrs):
        """Validate that the test exists and has questions"""
        test = attrs.get('test')
        if test and test.questions.count() == 0:
            raise serializers.ValidationError({"test": "This test has no questions"})
        return attrs

class UserTestResultSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title')
    course_title = serializers.CharField(source='test.course.title')
    passing_criteria = serializers.IntegerField(source='test.passing_criteria')
    class Meta:
        model = AnswerSubmission
        fields = ['test_title', 'course_title', 'score', 'passed', 'passing_criteria', 'submitted_at']

class TestProgressSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title')
    course_title = serializers.CharField(source='course.title')
    score = serializers.IntegerField(source='submission.score', default=0)
    passed = serializers.BooleanField(source='submission.passed', default=False)
    submitted_at = serializers.DateTimeField(source='submission.submitted_at', default=None)
    total_questions = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()
    class Meta:
        model = TestProgress
        fields = ['test', 'test_title', 'course', 'course_title', 'score', 'passed', 'submitted_at', 'total_questions', 'percentage']
    def get_total_questions(self, obj): return obj.test.questions.count()
    def get_percentage(self, obj):
        if not obj.submission or not obj.test: return 0.0
        total = obj.test.questions.count()
        return round((obj.submission.score / total) * 100, 2) if total > 0 else 0.0

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title')
    course_title = serializers.CharField(source='course.title')
    class Meta:
        model = LessonProgress
        fields = ['lesson', 'lesson_title', 'course', 'course_title', 'completed', 'completed_at']

# =====================================================
# 6. GROUPS & ASSIGNMENTS (UPDATED RELATIONS)
# =====================================================

class GroupSerializer(serializers.ModelSerializer):
    creator_email = serializers.ReadOnlyField(source='user.email')
    course_title = serializers.ReadOnlyField(source='course.title')
    
    # UPDATE: Filter by LMS PROFILE UserType
    team_leaders = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(lms_profile__userType='team-leader'),
        required=False
    )
    employees = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.filter(lms_profile__userType='employee'),
        required=False
    )

    class Meta:
        model = Group
        fields = [
            'id', 'name', 'description', 'course', 'course_title',
            'creator_email', 'team_leaders', 'employees',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['creator_email', 'course_title', 'created_at', 'updated_at']


    def to_representation(self, instance):
        """
        Convert the IDs into full objects for the Frontend display
        """
        response = super().to_representation(instance)
        
        # 1. Get the Users linked to this group
        tl_users = instance.team_leaders.all()
        emp_users = instance.employees.all()

        # 2. Extract their LMS Profiles safely
        # We loop through the users and grab .lms_profile for each
        tl_profiles = [u.lms_profile for u in tl_users if hasattr(u, 'lms_profile')]
        emp_profiles = [u.lms_profile for u in emp_users if hasattr(u, 'lms_profile')]

        # 3. Serialize the profiles using your existing LMSProfileSerializer
        response['team_leaders'] = LMSProfileSerializer(tl_profiles, many=True).data
        response['employees'] = LMSProfileSerializer(emp_profiles, many=True).data
        
        return response



class CourseAssignmentSerializer(serializers.ModelSerializer):
    employee_email = serializers.ReadOnlyField(source='employee.email')
    course_title = serializers.ReadOnlyField(source='course.title')
    instructor_name = serializers.ReadOnlyField(source='course.instructor_name') 
    status = serializers.CharField(source='current_status', read_only=True)
    assigned_by_name = serializers.ReadOnlyField(source='assigned_by.lms_profile.firstName')

    class Meta:
        model = CourseAssignment
        fields = [
            'id', 'employee', 'employee_email', 'course', 'course_title', 'current_status',
            'updated_at', 'instructor_name',
            'assigned_by', 'assigned_by_name', 'assigned_at', 'due_date','status',
        ]
        read_only_fields = ['assigned_by', 'assigned_at']

    def validate_employee(self, value):
        # UPDATE: Check profile userType
        assignable_roles = ['employee', 'team-leader']
        if not hasattr(value, 'lms_profile') or value.lms_profile.userType not in assignable_roles:
            raise serializers.ValidationError("Courses can only be assigned to Employees or Team Leaders.")
        return value


class NotificationSerializer(serializers.ModelSerializer):
    # UPDATE: Get name/role from Profile
    sender_name = serializers.ReadOnlyField(source='sender.lms_profile.firstName')
    sender_role = serializers.ReadOnlyField(source='sender.lms_profile.userType')

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'created_at', 'sender_name', 'sender_role','related_object_id']

# =====================================================
# 7. DASHBOARD / REPORT SERIALIZERS
# =====================================================

class EmployeeListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    lastActive = serializers.DateTimeField(source='last_login', format="%Y-%m-%d", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'position', 'department', 'courses', 'status', 'lastActive']

    def get_name(self, obj):
        # UPDATE: Get name from Profile
        if hasattr(obj, 'lms_profile'):
            return f"{obj.lms_profile.firstName} {obj.lms_profile.lastName}"
        return f"{obj.first_name} {obj.last_name}"

    def get_position(self, obj):
        # UPDATE: Get UserType from Profile
        if hasattr(obj, 'lms_profile') and obj.lms_profile.userType:
            return obj.lms_profile.userType.capitalize()
        return "Employee"

    def get_department(self, obj):
        return "General" 

    def get_courses(self, obj):
        return CourseAssignment.objects.filter(employee=obj).count()

    def get_status(self, obj):
        if not obj.is_active: return "on-leave"
        return "active"

# In app2/serializers.py

class EmployeeDetailedReportSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    overall_stats = serializers.SerializerMethodField()
    course_details = serializers.SerializerMethodField()
    workflow_stats = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'user_info', 'overall_stats', 'course_details', 'workflow_stats']

    def get_user_info(self, obj):
        name = "Unknown"
        if hasattr(obj, 'lms_profile'):
            name = f"{obj.lms_profile.firstName} {obj.lms_profile.lastName}"
        elif obj.first_name:
            name = f"{obj.first_name} {obj.last_name}"
        
        # FIX: Check if date_joined exists, otherwise use created_at, otherwise empty string
        joined_date = ""
        if hasattr(obj, 'date_joined') and obj.date_joined:
            joined_date = obj.date_joined.strftime("%Y-%m-%d")
        elif hasattr(obj, 'created_at') and obj.created_at:
             joined_date = obj.created_at.strftime("%Y-%m-%d")

        return {
            "name": name,
            "email": obj.email,
            "joined": joined_date
        }

    def get_overall_stats(self, user):
        # 1. Total Assignments
        total_assignments = CourseAssignment.objects.filter(employee=user).count()
        
        # 2. Passed Courses (based on PostTestResult)
        passed_courses = PostTestResult.objects.filter(user=user, passed=True).values('course').distinct().count()
        
        # 3. Total Tests (Pre + Post attempts)
        total_tests = PreTestResult.objects.filter(user=user).count() + PostTestResult.objects.filter(user=user).count()
        
        return {
            "total_courses": total_assignments,
            "tests_passed": passed_courses,
            "total_tests": total_tests
        }

    def get_course_details(self, user):
        assignments = CourseAssignment.objects.filter(employee=user).select_related('course')
        data = []
        for asm in assignments:
            course = asm.course
            total_lessons = course.roadmap.count()
            completed = LessonProgress.objects.filter(user=user, course=course, completed=True).count()
            
            progress = 0
            if total_lessons > 0:
                progress = round((completed / total_lessons) * 100, 1)
            
            data.append({
                "title": course.title,
                "progress": progress,
                "status": asm.current_status 
            })
        return data

    def get_workflow_stats(self, user):
        """
        This is the critical method for the 'Course Specific Reports' table.
        It fetches data from CourseAssignment, PreTestResult, and PostTestResult.
        """
        # Fetch assignments for this user
        assignments = CourseAssignment.objects.filter(employee=user).select_related('course', 'course__instructor')
        data = []
        
        for asm in assignments:
            course = asm.course
            
            # --- 1. Resolve Instructor Name ---
            instructor_name = "Unknown"
            if course.instructor:
                # Try getting name from Profile
                if hasattr(course.instructor, 'lms_profile'):
                    instructor_name = f"{course.instructor.lms_profile.firstName} {course.instructor.lms_profile.lastName}"
                else:
                    instructor_name = f"{course.instructor.first_name} {course.instructor.last_name}"
            elif course.instructor_name:
                # Fallback to the text field if no User linked
                instructor_name = course.instructor_name

            # --- 2. Get Pre-Test Score ---
            pre_result = PreTestResult.objects.filter(user=user, course=course).first()
            
            # --- 3. Get Post-Test Score (Best Attempt) ---
            post_result = PostTestResult.objects.filter(user=user, course=course).order_by('-percentage').first()
            attempts_count = PostTestResult.objects.filter(user=user, course=course).count()

            # --- 4. Build Object ---
            data.append({
                "course_title": course.title,
                "course_id": course.id,
                "instructor_name": instructor_name,
                "current_status": asm.current_status,
                "assigned_level": asm.assigned_level or "Beginner",
                
                # Pre-Test Data
                "pre_test_score": pre_result.percentage if pre_result else None,
                "pre_test_submitted_at": pre_result.completed_at if pre_result else None,
                
                # Post-Test Data
                "post_test_score": post_result.percentage if post_result else None,
                "post_test_submitted_at": post_result.completed_at if post_result else None,
                "attempts": attempts_count, 
            })
            
        return data
    

class CourseWorkflowSerializer(serializers.ModelSerializer):
    """
    Returns Course details + The current user's workflow status
    Uses SINGLE test for both pre and post assessment
    """
    user_status = serializers.SerializerMethodField()
    test_id = serializers.SerializerMethodField()
    lessons_completed_count = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()
    roadmap = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'user_status', 
            'test_id', 'lessons_completed_count', 'total_lessons',
            'roadmap'
        ]

    def get_test_id(self, obj):
        """Get the single test for this course"""
        test = obj.tests.first()
        return test.id if test else None

    def get_total_lessons(self, obj):
        return obj.roadmap.count()

    def get_lessons_completed_count(self, obj):
        user = self.context['request'].user
        return LessonProgress.objects.filter(user=user, course=obj, completed=True).count()

    def get_user_status(self, obj):
        user = self.context['request'].user
        
        # Check enrollment
        try:
            assignment = CourseAssignment.objects.get(course=obj, employee=user)
        except CourseAssignment.DoesNotExist:
            return {
                "code": "NOT_ENROLLED",
                "message": "You are not enrolled in this course.",
                "can_view_lessons": False,
                "action_required": "enroll"
            }

        test = obj.tests.first()
        total_lessons = obj.roadmap.count()
        completed_lessons = LessonProgress.objects.filter(user=user, course=obj, completed=True).count()
        current_status = assignment.current_status

        # Status mapping
        status_map = {
            'pending_pretest': {
                "code": "PRETEST_REQUIRED" if test else "NO_TEST_CONFIGURED",
                "message": "Complete the Pre-Assessment to unlock course content." if test else "Start learning directly.",
                "can_view_lessons": not bool(test),
                "action_required": "start_pretest" if test else "watch_lessons"
            },
            'in_progress': {
                "code": "IN_PROGRESS",
                "message": f"Complete all lessons ({completed_lessons}/{total_lessons}) to unlock the Final Assessment.",
                "can_view_lessons": True,
                "action_required": "watch_lessons",
                "progress": {
                    "completed": completed_lessons,
                    "total": total_lessons,
                    "percentage": round((completed_lessons / total_lessons) * 100, 1) if total_lessons > 0 else 0
                }
            },
            'ready_for_posttest': {
                "code": "POSTTEST_REQUIRED" if test else "COMPLETED",
                "message": "All lessons completed! Take the Final Assessment." if test else "Course completed!",
                "can_view_lessons": True,
                "action_required": "start_posttest" if test else "none"
            },
            'failed_retaking': {
                "code": "POSTTEST_RETRY",
                "message": "You did not pass. Review lessons and try again.",
                "can_view_lessons": True,
                "action_required": "start_posttest"
            },
            'completed': {
                "code": "COMPLETED",
                "message": "Congratulations! You have successfully completed this course.",
                "can_view_lessons": True,
                "action_required": "none"
            }
        }

        return status_map.get(current_status, {"code": "UNKNOWN", "message": "Unknown status"})

class PreTestResultSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = PreTestResult
        fields = [
            'id', 'user', 'user_email', 'user_name', 'course', 'course_title',
            'test', 'score', 'total_questions', 'percentage', 'assigned_level',
            'time_taken', 'answers_snapshot', 'completed_at'
        ]
        read_only_fields = ['id', 'percentage', 'assigned_level', 'completed_at']

    def get_user_name(self, obj):
        if hasattr(obj.user, 'lms_profile'):
            return f"{obj.user.lms_profile.firstName} {obj.user.lms_profile.lastName}"
        return obj.user.email


class PostTestResultSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    passing_criteria = serializers.SerializerMethodField()

    class Meta:
        model = PostTestResult
        fields = [
            'id', 'user', 'user_email', 'user_name', 'course', 'course_title',
            'test', 'attempt_number', 'score', 'total_questions', 'percentage',
            'passed', 'passing_criteria', 'time_taken', 'answers_snapshot', 'completed_at'
        ]
        read_only_fields = ['id', 'percentage', 'passed', 'completed_at']

    def get_user_name(self, obj):
        if hasattr(obj.user, 'lms_profile'):
            return f"{obj.user.lms_profile.firstName} {obj.user.lms_profile.lastName}"
        return obj.user.email

    def get_passing_criteria(self, obj):
        return obj.test.passing_criteria if obj.test else 70


# app2/serializers.py (or lms/serializers.py, where your serializers are defined)

from rest_framework import serializers
from django.contrib.auth import get_user_model
# Adjust these imports to match your actual model locations
from .models import Course, PreTestResult, PostTestResult, EmployeeGrowthReport 
# Assuming `lms_profile` is a related object to your User model for first/last name
# If lms_profile is not an actual model/related name, this get_user_name needs adjustment.
# from your_app.models import LMSProfile # if LMSProfile is a separate model

User = get_user_model()

# --- EmployeeGrowthReportSerializer (THIS IS THE ONE YOU PROVIDED, NOW FIXED) ---
class EmployeeGrowthReportSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    # growth_status_display is often a method on the model (get_FOO_display)
    # so sourcing it directly from the model method is correct.
    growth_status_display = serializers.CharField(source='get_growth_status_display', read_only=True)

    class Meta:
        model = EmployeeGrowthReport
        fields = [
            'id', 'user', 'user_email', 'user_name', 'course', 'course_title',
            'pre_test_percentage', 
            'initial_level',
            'post_test_percentage',
            'total_attempts', 
            'final_passed', 
            'score_improvement', 
            'growth_percentage',
            'growth_status', 'growth_status_display',
            'updated_at'
        ]

    def get_user_name(self, obj):
        
        if hasattr(obj.user, 'lms_profile') and obj.user.lms_profile:
            return f"{obj.user.lms_profile.firstName} {obj.user.lms_profile.lastName}"
        return obj.user.get_username() or obj.user.email 

class CourseGrowthReportSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(source='course.id')
    course_title = serializers.CharField(source='course.title')
    
    
    # pre_test_percentage = serializers.FloatField(source='pre_test_percentage', allow_null=True)
    # post_test_percentage = serializers.FloatField(source='post_test_percentage', allow_null=True)
    # score_improvement = serializers.FloatField(source='score_improvement', allow_null=True)
    # growth_percentage = serializers.FloatField(source='growth_percentage', allow_null=True)

    pre_test_percentage = serializers.FloatField(allow_null=True)
    post_test_percentage = serializers.FloatField(allow_null=True)
    score_improvement = serializers.FloatField(allow_null=True)
    growth_percentage = serializers.FloatField(allow_null=True)

    class Meta:
        model = EmployeeGrowthReport
        fields = [
            'course_id', 
            'course_title', 
            'pre_test_percentage', 
            'post_test_percentage', 
            'score_improvement', 
            'growth_percentage', 
            'growth_status', 
            'growth_status_display',
            'initial_level', 
            'final_passed', 
            'total_attempts', 
            'updated_at'
        ]

# --- AdminEmployeeGrowthSummarySerializer ---
class AdminEmployeeGrowthSummarySerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()
    growth_reports = CourseGrowthReportSerializer(source='employeegrowthreport_set', many=True)

    class Meta:
        model = User
        fields = ['employee', 'growth_reports']

    def get_employee(self, obj):
        return {
            'id': obj.id,
            'name': obj.get_username() or obj.email, 
            'email': obj.email,
        }

# --- PreTestResultSimpleSerializer, PostTestResultSimpleSerializer, GrowthComparisonSerializer ---
class PreTestResultSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreTestResult
        fields = ['percentage', 'completed_at']

class PostTestResultSimpleSerializer(serializers.ModelSerializer): # Note: Changed to ModelSerializer
    class Meta:
        model = PostTestResult
        fields = ['percentage', 'attempt_number', 'passed', 'completed_at']

class GrowthComparisonSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    course_title = serializers.CharField()
    pre_test = PreTestResultSimpleSerializer(allow_null=True)
    post_tests = PostTestResultSimpleSerializer(many=True)
    best_post_test = PostTestResultSimpleSerializer(allow_null=True)
    growth_report = CourseGrowthReportSerializer(allow_null=True)
    chart_data = serializers.JSONField()




from rest_framework import serializers
from .models import Course, CourseAssignment

class CourseReportSerializer(serializers.ModelSerializer):
    # Custom fields to match your Frontend Interface
    name = serializers.CharField(source='title')
    category = serializers.SerializerMethodField()
    instructor = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()
    completionRate = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    instructor_designation = serializers.SerializerMethodField()
    instructor_department = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created', format="%Y-%m-%d")
    
    # These fields don't exist in your DB, so we provide defaults/placeholders
    avgScore = serializers.IntegerField(default=0) 
    rating = serializers.FloatField(default=4.5) # Placeholder
    revenue = serializers.IntegerField(default=0) # Placeholder

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'category', 'instructor', 'students', 
            'completionRate', 'avgScore', 'rating', 'status', 
            'revenue', 'duration', 'createdAt', 'instructor_designation', 
            'instructor_department', 'department',
        ]

    def get_category(self, obj):
        # We try to take the first tag as the category, otherwise 'General'
        if obj.tags and len(obj.tags) > 0:
            return str(obj.tags[0])
        return "General"

    def get_instructor(self, obj):
        # Prefer the linked User's name, fallback to the text field
        if obj.instructor:
            return f"{obj.instructor.first_name} {obj.instructor.last_name}"
        return obj.instructor_name

    def get_students(self, obj):
        # Count assignments for this course
        return obj.assignments.count()

    def get_completionRate(self, obj):
        # Calculate percentage of completed assignments
        total = obj.assignments.count()
        if total == 0:
            return 0
        completed = obj.assignments.filter(is_course_completed=True).count()
        return round((completed / total) * 100)

    def get_status(self, obj):
        # Map boolean to string
        return "Active" if obj.is_published else "Draft"

    def get_instructor_designation(self, obj):
        # 1. Check LMS Profile first (Preferred)
        if obj.instructor and hasattr(obj.instructor, 'lms_profile'):
            return obj.instructor.lms_profile.designation
        
        # 2. Check User Model directly (Fallback)
        if obj.instructor and hasattr(obj.instructor, 'designation'):
             return obj.instructor.designation
             
        return "N/A"

    def get_instructor_department(self, obj):
        # 1. Check LMS Profile first (Preferred)
        if obj.instructor and hasattr(obj.instructor, 'lms_profile'):
            return obj.instructor.lms_profile.department
            
        # 2. Check User Model directly (Fallback)
        if obj.instructor and hasattr(obj.instructor, 'department'):
             return obj.instructor.department
             
        return "General"
    
    def get_department(self, obj):
        # 1. Priority: Check if the COURSE itself has a department set
        if hasattr(obj, 'department') and obj.department and obj.department.strip():
            return obj.department
            
        # 2. Fallback: Use the Instructor's Department
        if obj.instructor and hasattr(obj.instructor, 'lms_profile'):
            return obj.instructor.lms_profile.department
            
        # 3. Last Resort
        return "General"


from .models import TrainingSchedule, Group

class TrainingScheduleSerializer(serializers.ModelSerializer):
    trainer_display = serializers.SerializerMethodField()
    group_name = serializers.ReadOnlyField(source='group.name')

    class Meta:
        model = TrainingSchedule
        fields = [
            'id', 'group', 'group_name', 'date', 
            'topic', 'trainer', 'trainer_name_text', 'trainer_display',
            'duration', 'status', 'created_at'
        ]

    def get_trainer_display(self, obj):
        if obj.trainer:
            if hasattr(obj.trainer, 'lms_profile'):
                return f"{obj.trainer.lms_profile.firstName} {obj.trainer.lms_profile.lastName}"
            return obj.trainer.email
        return obj.trainer_name_text or "Unknown"

    
# app2/serializers.py
from .models import GroupMessage

# app2/serializers.py
from rest_framework import serializers
from .models import GroupMessage

class GroupMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    sender_role = serializers.SerializerMethodField()

    class Meta:
        model = GroupMessage
        fields = ['id', 'group', 'sender', 'sender_name', 'sender_avatar', 'sender_role', 'content', 'timestamp']

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip() or obj.sender.email

    def get_sender_avatar(self, obj):
        request = self.context.get('request')
        path = None
        if obj.sender.profile_image:
            path = obj.sender.profile_image.url
        
        if path and request:
            return request.build_absolute_uri(path)
        return path
    
    def get_sender_role(self, obj):
        if obj.sender.role:
            return obj.sender.role.name
        return "employee"

# =====================================================
# COMPETENCY & RULE SERIALIZERS (FIXED)
# =====================================================

class CompetencyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetencyCategory
        fields = ['id', 'name', 'icon']

class CompetencyLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetencyLevel
        fields = '__all__'

class CompetencySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Competency
        fields = ['id', 'title', 'description', 'category', 'category_name']

class RuleCompetencySerializer(serializers.ModelSerializer):
    competency_name = serializers.CharField(source='competency.title', read_only=True)
    category_name = serializers.CharField(source='competency.category.name', read_only=True)
    
    class Meta:
        model = RuleCompetency
        fields = ['id', 'competency', 'competency_name', 'category_name', 'target_level']

from rest_framework import serializers
from .models import CompetencyRule, RuleCompetency
# Import RuleCompetencySerializer if it's in a different file, or define it above.

class CompetencyRuleSerializer(serializers.ModelSerializer):
    # This ensures nested competencies are shown in the JSON response
    rule_competencies = RuleCompetencySerializer(many=True, read_only=True)
    
    class Meta:
        model = CompetencyRule
        fields = [
            'id', 
            'name', 
            'financial_year', 
            # New Explicit Hierarchy Fields
            'hq', 
            'business_unit', 
            'department', 
            'section', 
            'designation',
            # Standard Fields
            'is_active', 
            'rule_competencies', 
            'created_at'
        ]

        
class EmployeeCompetencyMatrixSerializer(serializers.ModelSerializer):
    competency_name = serializers.CharField(source='competency.title', read_only=True)
    category_name = serializers.CharField(source='competency.category.name', read_only=True)
    gap = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeCompetencyMatrix
        # FIX: Changed 'category' to 'competency'
        fields = [
            'id', 'employee', 'competency', 'competency_name', 'category_name',
            'actual_level', 'target_level', 'gap', 'source', 'assessed_at'
        ]

    def get_gap(self, obj):
        return obj.target_level - obj.actual_level

class MatrixUpdateSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    competency_id = serializers.IntegerField() 
    actual_level = serializers.IntegerField(min_value=1, max_value=5)
    source = serializers.CharField(default='Manager')

from rest_framework import serializers
from .models import OrganizationNode

class OrganizationNodeSerializer(serializers.ModelSerializer):
    parent_name = serializers.ReadOnlyField(source='parent.name')

    class Meta:
        model = OrganizationNode
        fields = ['id', 'name', 'org_type', 'location', 'parent', 'parent_name', 'created_at']

# app1/serializers.py

from rest_framework import serializers
from .models import Competency, AssessmentQuestion, CompetencyCategory
class AssessmentQuestionSerializer(serializers.ModelSerializer):
    # Allow ID to be passed for updates, but not required for creation
    id = serializers.IntegerField(required=False) 

    class Meta:
        model = AssessmentQuestion
        fields = ['id', 'question_text', 'question_type', 'points']


class CompetencyDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    questions = AssessmentQuestionSerializer(many=True) # Nested questions

    class Meta:
        model = Competency
        fields = ['id', 'title', 'description', 'category', 'category_name', 'questions']

# ... existing imports ...
from .models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'text', 'timestamp']

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at']

class GeneratedMediaSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    media_type = serializers.CharField(source='type', read_only=True)

    class Meta:
        model = GeneratedMedia
        fields = ['id', 'title', 'url', 'media_type', 'prompt', 'model_used', 'duration', 'created_at']

    def get_url(self, obj):
        request = self.context.get('request')
        
        # If it's a file (PPT), return the file URL
        if obj.file:
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        
        # If it's a URL field (video), return it
        if obj.url:
            # If it's a relative URL, make it absolute
            if obj.url.startswith('/') and request:
                return request.build_absolute_uri(obj.url)
            return obj.url
        
        return None
