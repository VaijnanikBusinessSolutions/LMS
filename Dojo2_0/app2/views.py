import json
import logging
import csv
import calendar
import os
from Dojo2_0.api import LargeResultsSetPagination
from django.core.files.base import ContentFile 
import uuid
from datetime import date, timedelta, datetime
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User  # Kept for explicit typing if needed, but get_user_model is preferred
from django.db import IntegrityError, transaction
from django.db.models import (Avg, Count, Sum, Max, Prefetch, Q, F, OuterRef, Subquery)
from django.db.models.functions import TruncMonth, TruncDay, TruncWeek
from django.http import FileResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from httpcore import request
from pptx import Presentation
from prompt_toolkit import prompt
from rest_framework import (viewsets, filters, status, permissions, generics, serializers, parsers)
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from shapely import buffer
from sympy import content
from app1.rbac import build_permission_codename
from .models import Course, GeneratedMedia, Lesson, LessonVideo, Notification, CourseAssignment
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.lib import colors
import io
from datetime import timedelta
from django.utils import timezone
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from .models import Course, Lesson, Notification, CourseAssignment
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.lib import colors
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable, KeepTogether
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from django.contrib.staticfiles import finders
from .models import (LMSProfile,Course, CourseStats, Lesson, LessonAttachment, 
    CourseAssignment, CourseEnrollmentRequest,Test, Question, Option, AnswerSubmission,
    PreTestResult, PostTestResult, AssessmentQuestion,LessonProgress, TestProgress, EmployeeGrowthReport,
    Group, GroupMessage, Notification, TrainingSchedule,Competency, CompetencyCategory, CompetencyLevel, CompetencyRule,
    EmployeeCompetencyMatrix, RuleCompetency, OrganizationNode)
from .serializers import (
    GeneratedMediaSerializer, GeneratedMediaSerializer, LMSProfileSerializer, EmployeeListSerializer,CourseSerializer, CourseReportSerializer, CourseWorkflowSerializer, 
    CourseAssignmentSerializer, LessonAttachmentSerializer,TestSerializer, AnswerSubmissionSerializer, UserTestResultSerializer,
    PreTestResultSerializer, PostTestResultSerializer,PreTestResultSimpleSerializer, PostTestResultSimpleSerializer,
    LessonProgressSerializer, TestProgressSerializer,EmployeeDetailedReportSerializer, EmployeeGrowthReportSerializer, 
    AdminEmployeeGrowthSummarySerializer, CourseGrowthReportSerializer, GrowthComparisonSerializer, CompetencyDetailSerializer,
    GroupSerializer, GroupMessageSerializer, NotificationSerializer, TrainingScheduleSerializer,
    CompetencyCategorySerializer, CompetencyLevelSerializer, CompetencyRuleSerializer,CompetencySerializer, EmployeeCompetencyMatrixSerializer, OrganizationNodeSerializer)
User = get_user_model()
logger = logging.getLogger(__name__)


def get_ai_engine():
    from .ai_engine import LMSAIEngine
    return LMSAIEngine


def has_team_scope(user, module_slug):
    return user.has_any_module_permission(module_slug, ('create', 'update', 'approve', 'manage'))


def has_self_scope(user, module_slug):
    return user.has_module_permission(module_slug, 'view')

# =====================================================
# 1. USER VIEWSET (Refactored for Profiles)
# =====================================================
class UserViewSet(viewsets.ModelViewSet):
    """
    Handles retrieval of LMS Profiles.
    """
    # FIX 1: Query LMSProfile instead of User. 
    # We use select_related('user') to efficiently fetch the linked User info (email, id)
    queryset = LMSProfile.objects.select_related('user').all().order_by('firstName')
    
    serializer_class = LMSProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None
    
    filter_backends = [filters.SearchFilter]
    # FIX 2: Update search fields to match LMSProfile fields (removed 'lms_profile__' prefix)
    search_fields = ['firstName', 'lastName', 'user__email']

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Please use the Standard Dojo Registration to create users."},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def admin(self, request):
        admin_profiles = self.get_queryset().filter(
            user__role__permissions__codename=build_permission_codename('admin_dashboard', 'view')
        ).distinct()
        serializer = self.get_serializer(admin_profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def team_leaders(self, request):
        tl_profiles = self.get_queryset().filter(
            user__role__permissions__codename=build_permission_codename('team_leader_dashboard', 'view')
        ).distinct()
        serializer = self.get_serializer(tl_profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def employees(self, request):
        emp_profiles = self.get_queryset().filter(
            user__role__permissions__codename=build_permission_codename('employee_dashboard', 'view')
        ).distinct()
        serializer = self.get_serializer(emp_profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='me')
    def me(self, request):
        profile = getattr(request.user, 'lms_profile', None)
        if profile is not None:
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        return Response({
            'id': request.user.id,
            'email': request.user.email,
            'first_name': getattr(request.user, 'first_name', ''),
            'last_name': getattr(request.user, 'last_name', ''),
        })

# =====================================================
# 2. COURSE VIEWSET
# =====================================================
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'instructor_name']
    pagination_class = None
    

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Pass the request context to the serializer
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def get_queryset(self):
        queryset = Course.objects.select_related('instructor').prefetch_related(
            'roadmap',
            'assignments',
            'tests',
        ).order_by('-created')
        user = self.request.user

        if not user.is_authenticated:
            return queryset

        # CHECK PROFILE TYPE
        if self.action == 'list':
            if self.action == 'list' and has_self_scope(user, 'courses') and not has_team_scope(user, 'courses'):
                # Hide assigned courses from the general list so they don't buy/enroll again
                queryset = queryset.exclude(assignments__employee=user)

        return queryset


    def create(self, request, *args, **kwargs):
        logger.info("=== COURSE CREATE START ===")
        processed_data = self._process_form_data(request.data)
        serializer = self.get_serializer(data=processed_data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        
        # Pass is_create=True to map videos by INDEX
        self._handle_lesson_videos(request, course, is_create=True)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # === UPDATE METHOD (PUT) ===
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        processed_data = self._process_form_data(request.data)
        serializer = self.get_serializer(instance, data=processed_data, partial=kwargs.pop("partial", False), context={"request": request})
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        
        # Pass is_create=False to map videos by ID
        self._handle_lesson_videos(request, course, is_create=False)
        
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    @action(detail=True, methods=['get'], url_path='lessons/(?P<lesson_id>[^/.]+)')
    def lesson_detail(self, request, pk=None, lesson_id=None):
        course = self.get_object()
        lesson = course.roadmap.filter(id=lesson_id).first()
        if not lesson:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)

        # Inside CourseViewSet class

    def _handle_lesson_videos(self, request, course, is_create=False):
        """
        Handles uploading multiple videos per lesson.
        Matches files to lessons based on the ORDER (Index) of the lesson.
        Key format: "lesson_{lessonIndex}_video_{videoIndex}"
        """
        # 1. Fetch lessons strictly ordered by 'order' (This matches the frontend array)
        lessons = list(course.roadmap.all().order_by('order'))

        for key, file in request.FILES.items():
            # Check for pattern: lesson_{index}_video_{index}
            if key.startswith("lesson_") and "_video_" in key:
                try:
                    parts = key.split("_") 
                    # Key: lesson_0_video_1  -> parts: ['lesson', '0', 'video', '1']
                    
                    lesson_index = int(parts[1]) # The first number is the lesson index
                    
                    # 2. Find the target lesson by INDEX
                    if 0 <= lesson_index < len(lessons):
                        target_lesson = lessons[lesson_index]
                        
                        # 3. Save the video
                        LessonVideo.objects.create(
                            lesson=target_lesson,
                            file=file,
                            name=file.name
                        )
                        logger.info(f"Saved video '{file.name}' for Lesson #{target_lesson.id} (Index {lesson_index})")
                    else:
                        logger.warning(f"Video upload index {lesson_index} out of range for course {course.id}")

                except Exception as e:
                    logger.error(f"Error saving video {key}: {e}")
                    pass

    @action(detail=True, methods=["delete"], url_path="lessons/videos/(?P<video_id>[^/.]+)")
    def delete_lesson_video(self, request, pk=None, video_id=None):
        try:
            video = LessonVideo.objects.get(id=video_id)
            video.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except LessonVideo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


    def _process_form_data(self, data):
        # ... [Paste your existing _process_form_data logic here] ...
        processed = {k: v for k, v in data.items() if k not in ["photo"] and not k.startswith("lesson_")}
        json_fields = ["stats", "roadmap", "tests", "tags"]
        for field in json_fields:
            if field in processed:
                try:
                    if isinstance(processed[field], str):
                        processed[field] = json.loads(processed[field])
                except:
                    processed[field] = []
        if "questions" in processed:
            try: processed["questions"] = int(processed["questions"])
            except: processed["questions"] = 0
        if "photo" in data: processed["photo"] = data["photo"]
        return processed

    # ... [Paste your actions: delete_lesson, create_test, list_tests, test_detail] ...
    @action(detail=True, methods=["delete"], url_path="lessons/(?P<lesson_id>[^/.]+)")
    def delete_lesson(self, request, pk=None, lesson_id=None):
        course = self.get_object()
        lesson = course.roadmap.filter(id=lesson_id).first()
        if lesson: lesson.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], url_path='tests')
    def create_test(self, request, pk=None):
        course = self.get_object()
        serializer = TestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        test = serializer.save(course=course)

        # === AUTO-COPY PRE-TEST QUESTIONS TO POST-TEST ===
        if test.test_type == 'post-test' and test.questions.count() == 0:
            pre_test = course.tests.filter(test_type='pre-test').first()
            if pre_test:
                # Copy settings
                test.passing_criteria = pre_test.passing_criteria
                test.total_time = pre_test.total_time
                test.order = pre_test.order + 1
                test.save()

                # Deep copy questions + options
                for question in pre_test.questions.all().order_by('order'):
                    new_question = Question.objects.create(
                        test=test,
                        question_text=question.question_text,
                        order=question.order
                    )
                    for option in question.options.all():
                        Option.objects.create(
                            question=new_question,
                            text=option.text,
                            is_correct=option.is_correct
                        )
                logger.info(f"✅ Post-test {test.id} auto-copied {pre_test.questions.count()} questions from Pre-test {pre_test.id}")

        fresh_serializer = TestSerializer(test, context={"request": request})
        return Response(fresh_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="tests")
    def list_tests(self, request, pk=None):
        course = self.get_object()
        tests_qs = course.tests.all().prefetch_related("questions__options")
        data = TestSerializer(tests_qs, many=True, context={"request": request}).data
        return Response(data)
    

    # --- ADD THIS NEW METHOD ---
    @action(detail=True, methods=["get"], url_path=r"tests/(?P<test_id>\d+)")
    def test_detail(self, request, pk=None, test_id=None):
        """
        Retrieves a specific test belonging to this course.
        """
        course = get_object_or_404(Course, pk=pk)
        test = get_object_or_404(Test, pk=test_id, course=course)
        
        # 3. Serialize and return
        serializer = TestSerializer(test, context={"request": request})
        return Response(serializer.data)
    

    @action(detail=False, methods=['post'], url_path='mark-course-content-complete')
    def mark_course_content_complete(self, request):
        user = request.user
        course_id = request.data.get('course_id')

        if not course_id:
            return Response({"error": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assignment = CourseAssignment.objects.get(employee=user, course_id=course_id)
        except CourseAssignment.DoesNotExist:
            return Response({"error": "Course assignment not found for this user."}, status=status.HTTP_404_NOT_FOUND)


        if assignment.current_status == 'in_progress':
            assignment.current_status = 'ready_for_posttest'
            assignment.save()
            return Response({"message": "Course content marked complete. Post-test now available."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Course is not in 'in_progress' status."}, status=status.HTTP_400_BAD_REQUEST)
        


    @action(detail=False, methods=['get'], url_path='download-test-template')
    def download_template(self, request):
        """Generates an Excel template for bulk question upload."""
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Questions Template"

        # Define Headers
        headers = [
            'Question Text', 
            'Option 1', 'Option 2', 'Option 3', 'Option 4', 
            'Correct Option Index (1-4)'
        ]
        ws.append(headers)

        # Add a sample row
        ws.append(['What is the capital of France?', 'London', 'Paris', 'Berlin', 'Madrid', 2])

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=test_template.xlsx'
        wb.save(response)
        return response

    @action(detail=False, methods=['post'], url_path='parse-questions-excel')
    def parse_questions_excel(self, request):
        """Parses uploaded Excel and returns JSON for frontend preview."""
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=400)

        try:
            wb = openpyxl.load_workbook(file_obj)
            ws = wb.active
            questions = []

            # Iterate rows, skipping header
            for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
                q_text = row[0]
                if not q_text: continue  # Skip empty rows

                # Map options
                options_raw = [row[1], row[2], row[3], row[4]]
                correct_idx = row[5] # 1-based index

                formatted_options = []
                for idx, opt_text in enumerate(options_raw):
                    if opt_text:
                        formatted_options.append({
                            "id": f"new-opt-{i}-{idx}",
                            "text": str(opt_text),
                            "is_correct": (idx + 1) == int(correct_idx),
                            "isCorrect": (idx + 1) == int(correct_idx)
                        })

                questions.append({
                    "id": f"new-q-{i}",
                    "question_text": q_text,
                    "question": q_text,
                    "options": formatted_options,
                    "order": i + 1
                })

            return Response({"questions": questions})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class TeamLeaderViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        if not has_team_scope(user, 'groups'):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        my_groups = Group.objects.filter(team_leaders=user)
        total_employees = User.objects.filter(member_of_groups__in=my_groups).distinct().count()
        total_courses = Course.objects.filter(groups__in=my_groups).distinct().count()
        total_videos = Lesson.objects.filter(course__groups__in=my_groups).exclude(video='').count()

        return Response({
            "team_leader": {
                "name": f"{user.lms_profile.firstName} {user.lms_profile.lastName}",
                "email": user.email
            },
            "summary": {
                "total_groups": my_groups.count(),
                "total_employees": total_employees,
                "total_courses": total_courses,
            }
        })
class UserDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        today = timezone.now()
        
        # 1. Fetch Assignments
        assignments = CourseAssignment.objects.filter(employee=user).select_related('course')

        # 2. Activity Chart Data (Last 7 Days)
        # Counting lessons completed per day
        seven_days_ago = today - timedelta(days=6)
        activity_qs = LessonProgress.objects.filter(user=user, completed_at__gte=seven_days_ago)\
            .annotate(day=TruncDay('completed_at'))\
            .values('day').annotate(count=Count('id')).order_by('day')
            
        activity_dict = {entry['day'].strftime('%a'): entry['count'] for entry in activity_qs}
        
        # Ensure all 7 days exist (Mon-Sun)
        activity_data = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_name = day.strftime('%a')
            activity_data.append({
                "day": day_name,
                "lessons": activity_dict.get(day_name, 0)
            })

        # 3. Upcoming Deadlines (Assignments with due dates)
        deadlines = assignments.filter(
            due_date__gte=today, 
            is_course_completed=False
        ).order_by('due_date')[:3]
        
        deadline_data = [{
            "id": d.id,
            "course": d.course.title,
            "date": d.due_date,
            "days_left": (d.due_date - today).days if d.due_date else 0
        } for d in deadlines]

        # 4. "Continue Learning" (The specific course last touched)
        last_progress = LessonProgress.objects.filter(user=user).order_by('-completed_at').first()
        continue_learning = None
        if last_progress:
            course = last_progress.course
            # Calculate specific progress for this course
            total = course.roadmap.count()
            done = LessonProgress.objects.filter(user=user, course=course, completed=True).count()
            pct = round((done/total)*100) if total > 0 else 0
            
            continue_learning = {
                "id": course.id,
                "title": course.title,
                "lesson_title": last_progress.lesson.title, # Last completed lesson
                "progress": pct,
                "thumbnail": request.build_absolute_uri(course.photo.url) if course.photo else None
            }

        # 5. General Stats
        total_courses = assignments.count()
        completed_courses = assignments.filter(is_course_completed=True).count()
        certificates = completed_courses # Assuming 1 cert per completed course
        total_hours = 0 # You can calculate this from Lesson duration if you store it as integers

        # 6. Course List (Your existing logic)
        courses_data = []
        for asm in assignments:
            course = asm.course
            c_lessons = course.roadmap.count()
            c_completed = LessonProgress.objects.filter(user=user, course=course, completed=True).count()
            progress = round((c_completed / c_lessons * 100), 0) if c_lessons > 0 else 0
            
            c_type = 'Current'
            if asm.is_course_completed: c_type = 'Completed'
            elif asm.current_status == 'pending_pretest': c_type = 'Mandatory'

            courses_data.append({
                "id": course.id,
                "name": course.title,
                "progress": progress,
                "lessons": c_lessons,
                "assignments": course.assignments.count(),
                "tests": course.tests.count(),
                "type": c_type,
            })

        return Response({
            "stats": {
                "total_courses": total_courses,
                "completed": completed_courses,
                "certificates": certificates,
                "hours_spent": 124, # Placeholder or calc real time
            },
            "activity_chart": activity_data,
            "continue_learning": continue_learning,
            "deadlines": deadline_data,
            "courses": courses_data
        })
    

class AnswerSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AnswerSubmission.objects.all()
    serializer_class = AnswerSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def create(self, request, *args, **kwargs):
        logger.info("=" * 50)
        logger.info(f"SUBMISSION from: {request.user.email}")
        logger.info(f"Data: {request.data}")
        logger.info("=" * 50)
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user
        test = serializer.validated_data['test']
        answers = serializer.validated_data['answers']
        course = test.course

        # 1. Check assignment exists
        try:
            assignment = CourseAssignment.objects.get(employee=user, course=course)
        except CourseAssignment.DoesNotExist:
            raise ValidationError({"detail": "You are not assigned to this course."})

        # 2. Calculate score
        correct_map = dict(
            Option.objects.filter(question__test=test, is_correct=True)
            .values_list('question_id', 'id')
        )
        
        score = 0
        for q_id_str, opt_id in answers.items():
            q_id = int(q_id_str)
            opt_id_int = int(opt_id) if isinstance(opt_id, str) else opt_id
            if correct_map.get(q_id, -1) == opt_id_int:
                score += 1
        
        total_questions = test.questions.count()
        percentage = round((score / total_questions) * 100, 2) if total_questions > 0 else 0.0
        passed = percentage >= test.passing_criteria

        logger.info(f"Score: {score}/{total_questions} = {percentage}% | Pass: {passed}")

        # 3. Save AnswerSubmission
        submission = serializer.save(
            user=user,
            score=score,
            passed=passed,
            answers=answers
        )

        # 4. Update TestProgress
        TestProgress.objects.update_or_create(
            user=user,
            test=test,
            defaults={'course': course, 'submission': submission}
        )
        current_status = assignment.current_status

        if current_status == 'pending_pretest':
            # This is a PRE-TEST submission
            self._save_pretest_result(user, course, test, score, total_questions, percentage, answers, assignment)
        
        elif current_status in ['ready_for_posttest', 'failed_retaking']:
            # This is a POST-TEST submission
            self._save_posttest_result(user, course, test, score, total_questions, percentage, passed, answers, assignment)
        
        else:
            logger.warning(f"Unexpected status for test submission: {current_status}")
            raise ValidationError({
                "detail": f"Cannot submit test in current status: {current_status}"
            })

    def _save_pretest_result(self, user, course, test, score, total_questions, percentage, answers, assignment):
        """Save result to PreTestResult and update assignment"""
        
        # Create/Update PreTestResult
        pre_result, created = PreTestResult.objects.update_or_create(
            user=user,
            course=course,
            defaults={
                'test': test,
                'score': score,
                'total_questions': total_questions,
                'answers_snapshot': answers,
                'time_taken': 0
            }
        )
        
        logger.info(f"✅ PRE-TEST saved: {percentage}% | Level: {pre_result.assigned_level}")

        # Update assignment: pending_pretest → in_progress
        assignment.current_status = 'in_progress'
        assignment.is_pretest_completed = True
        assignment.assigned_level = pre_result.assigned_level
        assignment.save()
        
        logger.info(f"Assignment status → in_progress")

        # Initialize Growth Report
        EmployeeGrowthReport.objects.update_or_create(
            user=user,
            course=course,
            defaults={
                'pre_test_score': score,
                'pre_test_total': total_questions,
                'pre_test_percentage': percentage,
                'initial_level': pre_result.assigned_level,
                'pre_test_date': pre_result.completed_at
            }
        )

    def _save_posttest_result(self, user, course, test, score, total_questions, percentage, passed, answers, assignment):
        """Save result to PostTestResult and update assignment"""
        
        # Get attempt number
        last_attempt = PostTestResult.objects.filter(user=user, course=course).order_by('-attempt_number').first()
        attempt_number = (last_attempt.attempt_number + 1) if last_attempt else 1

        # Create PostTestResult
        post_result = PostTestResult.objects.create(
            user=user,
            course=course,
            test=test,
            attempt_number=attempt_number,
            score=score,
            total_questions=total_questions,
            percentage=percentage,
            passed=passed,
            answers_snapshot=answers,
            time_taken=0
        )
        
        logger.info(f"✅ POST-TEST saved: Attempt {attempt_number} | {percentage}% | Passed: {passed}")

        # Update assignment status
        if passed:
            assignment.current_status = 'completed'
            assignment.is_course_completed = True
            logger.info("Assignment status → completed")
        else:
            assignment.current_status = 'failed_retaking'
            logger.info("Assignment status → failed_retaking")
        assignment.save()

        # Update Growth Report with best post-test result
        growth_report, _ = EmployeeGrowthReport.objects.get_or_create(user=user, course=course)
        
        best_result = PostTestResult.objects.filter(user=user, course=course).order_by('-percentage').first()
        if best_result:
            growth_report.post_test_score = best_result.score
            growth_report.post_test_total = best_result.total_questions
            growth_report.post_test_percentage = best_result.percentage
            growth_report.final_passed = best_result.passed
            growth_report.post_test_date = best_result.completed_at
        
        growth_report.total_attempts = PostTestResult.objects.filter(user=user, course=course).count()
        growth_report.save()

class UnifiedProgressViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        lesson_progress = LessonProgress.objects.filter(user=user, completed=True)
        completed_lesson_ids = list(lesson_progress.values_list('lesson_id', flat=True))
        test_progress = TestProgress.objects.filter(user=user)
        
        return Response({
            "completed_lesson_ids": completed_lesson_ids,
            "test_progress": TestProgressSerializer(test_progress, many=True).data
        })


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'lms_profile'): return Group.objects.none()

        if user.has_module_permission('groups', 'manage'): return Group.objects.all()
        if has_team_scope(user, 'groups'): return user.led_groups.all()
        if has_self_scope(user, 'groups'): return user.member_of_groups.all()
        return Group.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CourseAssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = CourseAssignmentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'lms_profile'): 
            return CourseAssignment.objects.none()

        if user.has_module_permission('courses', 'manage'):
            return CourseAssignment.objects.select_related('employee', 'course', 'assigned_by').all()
        if has_team_scope(user, 'courses'):
            return CourseAssignment.objects.select_related('employee', 'course', 'assigned_by').filter(assigned_by=user)
        if has_self_scope(user, 'courses'):
            return CourseAssignment.objects.select_related('employee', 'course', 'assigned_by').filter(employee=user)
        
        return CourseAssignment.objects.none()

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user, status='pending_pretest')

    @action(detail=False, methods=['get'], url_path='employees') 
    def get_assignable_employees(self, request):
        user = request.user
        employees = User.objects.select_related('lms_profile').filter(
            role__permissions__codename__in=['view_courses', 'create_courses', 'update_courses']
        ).exclude(
            role__permissions__codename='manage_courses'
        ).distinct()

        # 2. Filter logic (Admin vs Team Leader)
        if has_team_scope(user, 'courses'):
            my_groups = user.led_groups.all()
            employees = employees.filter(member_of_groups__in=my_groups).distinct()
        elif has_self_scope(user, 'courses'):
            return Response({"error": "Employees cannot assign courses."}, status=status.HTTP_403_FORBIDDEN)

        employees = employees.prefetch_related('assigned_courses')

        # 4. Manual Construction (Better than .values() for list fields)
        response_data = []
        for emp in employees:
            # Safe profile access
            profile = getattr(emp, 'lms_profile', None)
            
            # Get list of course IDs this user already has
            enrolled_ids = list(emp.assigned_courses.values_list('course_id', flat=True))

            response_data.append({
                'id': emp.id,
                'email': emp.email,
                'firstName': profile.firstName if profile else 'Unknown',
                'lastName': profile.lastName if profile else 'User',
                'avatar': profile.profileImage.url if profile and profile.profileImage else None,
                'designation': profile.designation if profile else 'N/A',
                'department': profile.department if profile else 'General',
                'userType': profile.userType if profile else 'employee',
                'enrolled_courses': enrolled_ids  # <--- NEW FIELD
            })

        return Response(response_data)

    @action(detail=False, methods=['post'], url_path='bulk-assign')
    @transaction.atomic
    def bulk_assign(self, request):
        user = request.user
        course_id = request.data.get('course_id')
        employee_ids = request.data.get('employee_ids', [])
        due_date = request.data.get('due_date')

        if not course_id or not employee_ids:
            return Response(
                {"error": "course_id and employee_ids are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        created_count = 0
        skipped_count = 0

        if not (
            user.has_module_permission('courses', 'create')
            or user.has_module_permission('courses', 'manage')
            or user.has_module_permission('courses', 'update')
        ):
             return Response({"error": "Only authorized users can assign courses."}, status=status.HTTP_403_FORBIDDEN)

        for emp_id in employee_ids:
            try:
                employee = User.objects.get(id=emp_id)
                if not employee.has_any_module_permission('courses', ('view', 'create', 'update')):
                    logger.warning(f"Bulk Assign: Skipping user {employee.email}: Not an assignable role.")
                    skipped_count += 1
                    continue

                obj, created = CourseAssignment.objects.get_or_create(
                    employee=employee,
                    course=course,
                    defaults={
                        'assigned_by': user,
                        'due_date': due_date,
                        'current_status': 'pending_pretest' # FIX 2: Change 'status' to 'current_status'
                    }
                )
                if created:
                    created_count += 1
                    Notification.objects.create(
                        recipient=employee,
                        sender=user,
                        title="New Course Assignment!",
                        message=f"You have been assigned the course: '{course.title}'. Please complete the Pre-Test to start.",
                        notification_type='info'
                    )
                else:
                    skipped_count += 1
            except User.DoesNotExist:
                logger.warning(f"Bulk Assign: Employee with ID {emp_id} not found.")
                skipped_count += 1
                continue

        return Response({
            "message": "Assignment processed",
            "created": created_count,
            "skipped_already_enrolled_or_invalid": skipped_count
        }, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['get'], url_path='completed-courses')
    def get_completed_courses(self, request):
        user = request.user
        
        if not hasattr(user, 'lms_profile'):
            return Response({"error": "LMS Profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter specifically for certificates: assigned AND completed
        assignments = CourseAssignment.objects.filter(
            employee=user, 
            is_course_completed=True 
        ).select_related('course')
        
        courses = [a.course for a in assignments]
        
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)
    

    @action(detail=False, methods=['get'], url_path='my-courses')
    def get_employee_courses(self, request):
        user = request.user
        
        # 1. Security Check
        if not hasattr(user, 'lms_profile'):
             return Response({"error": "LMS Profile not found for this user."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Get Assignments
        assignments = CourseAssignment.objects.filter(employee=user).select_related('course')
        courses = [a.course for a in assignments]
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        
        return Response(serializer.data)

class EmployeeReportViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['lms_profile__firstName', 'email']
    pagination_class = None

    def get_queryset(self):
        return User.objects.select_related('lms_profile').filter(
            role__permissions__codename='view_courses'
        ).exclude(
            role__permissions__codename='manage_courses'
        ).distinct().order_by('-created_at')

    def get_serializer_class(self):
        return EmployeeListSerializer

    @action(detail=True, methods=['get'])
    def generate_report(self, request, pk=None):
        employee = self.get_object()
        serializer = EmployeeDetailedReportSerializer(employee)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.select_related('recipient', 'sender').filter(recipient=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'success'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'success'})
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_course_access(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        
        # Check if already enrolled
        if CourseAssignment.objects.filter(employee=request.user, course=course).exists():
             return Response({"message": "Already enrolled"}, status=400)

        # Create Request (This triggers Signal 10)
        enrollment_req, created = CourseEnrollmentRequest.objects.get_or_create(
            user=request.user,
            course=course
        )
        
        if not created and enrollment_req.status == 'PENDING':
             return Response({"message": "Request already pending"}, status=200)

        return Response({"message": "Request sent successfully"}, status=201)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_enrollment_request_details(request, pk):
    req = get_object_or_404(CourseEnrollmentRequest, pk=pk)
    
    # --- Logic to get Instructor Name ---
    instructor_name = "Unknown"
    if req.course.instructor:
        # Check if they have an LMS Profile first (usually has better name data)
        if hasattr(req.course.instructor, 'lms_profile'):
            profile = req.course.instructor.lms_profile
            instructor_name = f"{profile.firstName} {profile.lastName}".strip()
        else:
            # Fallback to User model first_name + last_name
            instructor_name = f"{req.course.instructor.first_name} {req.course.instructor.last_name}".strip()
        
        # Fallback to email if names are empty
        if not instructor_name:
            instructor_name = req.course.instructor.email

    data = {
        "id": req.id,
        "status": req.status,
        "requested_at": req.requested_at,
        "user": {
            "id": req.user.id,
            "first_name": req.user.first_name,
            "last_name": req.user.last_name,
            "email": req.user.email,
            # Add designation/department if available (Assuming LMS Profile)
            "designation": getattr(req.user.lms_profile, 'designation', 'N/A') if hasattr(req.user, 'lms_profile') else 'N/A',
            "department": getattr(req.user.lms_profile, 'department', 'N/A') if hasattr(req.user, 'lms_profile') else 'N/A',
        },
        "course": {
            "id": req.course.id,
            "title": req.course.title,
            "description": req.course.description,
            "instructor_name": instructor_name  # ✅ Returns Full Name
        }
    }
    return Response(data)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def action_enrollment_request(request, pk, action):
    req = get_object_or_404(CourseEnrollmentRequest, pk=pk)
    
    if action == 'approve':
        req.status = 'APPROVED'
        req.save() 
        # Note: Your Signal #11 will kick in here and create the assignment!
        return Response({"message": "Approved"})
        
    elif action == 'reject':
        req.status = 'REJECTED'
        req.save()
        return Response({"message": "Rejected"})
        
    return Response({"error": "Invalid action"}, status=400)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_lesson_complete(request):
    user = request.user
    course_id = request.data.get('course_id')
    lesson_id = request.data.get('lesson_id')

    if not course_id or not lesson_id:
        return Response({"error": "Missing course_id or lesson_id"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        course = get_object_or_404(Course, id=course_id)
        lesson = get_object_or_404(Lesson, id=lesson_id, course=course)

        # Check if the user is assigned to this course
        assignment = CourseAssignment.objects.filter(employee=user, course=course).first()
        if not assignment:
            return Response({"error": "You are not assigned to this course."}, status=status.HTTP_403_FORBIDDEN)
        
        # ✅ FIX: Use 'current_status' instead of 'status'
        allowed_statuses = ['in_progress', 'failed_retaking', 'ready_for_posttest', 'completed']
        if assignment.current_status not in allowed_statuses:
            return Response({
                "error": "Lessons are not yet accessible. Please complete the pre-test first.",
                "current_status": assignment.current_status
            }, status=status.HTTP_403_FORBIDDEN)

        # Mark the specific lesson as complete
        progress, created = LessonProgress.objects.get_or_create(
            user=user, 
            course=course, 
            lesson=lesson
        )
        if not progress.completed:
            progress.completed = True
            progress.save()
            logger.info(f"Lesson '{lesson.title}' marked complete for user {user.email}")

        # Check if all lessons are completed
        total_lessons = Lesson.objects.filter(course=course).count()
        completed_lessons_count = LessonProgress.objects.filter(
            user=user, 
            course=course, 
            completed=True
        ).count()

        # ✅ FIX: Use 'current_status' instead of 'status'
        if completed_lessons_count >= total_lessons:
            if assignment.current_status in ['in_progress', 'failed_retaking']:
                assignment.current_status = 'ready_for_posttest'
                assignment.save()
                logger.info(f"All lessons completed. Status → ready_for_posttest")

        return Response({
            "message": "Lesson marked complete",
            "lesson_id": lesson.id,
            "lesson_title": lesson.title,
            "completed_lessons": completed_lessons_count,
            "total_lessons": total_lessons,
            "all_completed": completed_lessons_count >= total_lessons,
            "current_status": assignment.current_status
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error marking lesson complete: {e}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminUserListViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # --- 1. TOP CARDS STATS ---
    def list(self, request):
        if not request.user.has_module_permission('dashboard', 'manage'):
             return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        return Response({
            "total_users": User.objects.count(),
            "total_courses": Course.objects.count(),
            "total_lesson_videos": Lesson.objects.exclude(video__isnull=True).exclude(video='').count(),
        })

    # --- 2. MAIN ANALYTICS DATA (Charts & Calendar) ---
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        if not request.user.has_module_permission('dashboard', 'manage'):
             return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        today = timezone.now()

        # A. MONTHLY GROWTH (Last 12 Months)
        one_year_ago = today - timedelta(days=365)
        monthly_qs = User.objects.filter(created_at__gte=one_year_ago)\
            .annotate(period=TruncMonth('created_at'))\
            .values('period')\
            .annotate(count=Count('id'))\
            .order_by('period')

        monthly_dict = {}
        for entry in monthly_qs:
            if entry['period']:
                monthly_dict[entry['period'].strftime('%b')] = entry['count']

        user_growth_monthly = []
        for i in range(11, -1, -1):
            date_cursor = today - timedelta(days=i * 30)
            month_name = date_cursor.strftime('%b')
            year_val = date_cursor.strftime('%Y')
            
            user_growth_monthly.append({
                "label": month_name, 
                "users": monthly_dict.get(month_name, 0),
                "fullLabel": f"{month_name} {year_val}"
            })

        # B. CALENDAR HEATMAP DATA (Last 365 Days)
        calendar_qs = User.objects.filter(created_at__gte=one_year_ago)\
            .annotate(day=TruncDay('created_at'))\
            .values('day').annotate(count=Count('id'))

        calendar_data = {}
        for entry in calendar_qs:
            if entry['day']:
                calendar_data[entry['day'].strftime('%Y-%m-%d')] = entry['count']

        # C. COURSE STATISTICS
        published_count = Course.objects.filter(is_published=True).count()
        draft_count = Course.objects.filter(is_published=False).count()
        course_stats_data = [
            { "name": 'Published', "value": published_count, "color": '#6366f1' },
            { "name": 'Draft', "value": draft_count, "color": '#cbd5e1' },    
        ]

        # D. RECENT ACTIVITY
        recent_notifications = Notification.objects.all().order_by('-created_at')[:5]
        activity_data = []
        for notif in recent_notifications:
            activity_data.append({
                "id": notif.id,
                "text": notif.message,
                "time": notif.created_at,
                "type": notif.notification_type
            })

        # E. SYSTEM OVERVIEW (Enrollments - Last 7 Days)
        seven_days_ago = today - timedelta(days=7)
        enrollment_qs = CourseAssignment.objects.filter(assigned_at__gte=seven_days_ago)\
            .annotate(day=TruncDay('assigned_at'))\
            .values('day')\
            .annotate(count=Count('id'))\
            .order_by('day')
            
        enrollment_dict = {}
        for entry in enrollment_qs:
            if entry['day']:
                enrollment_dict[entry['day'].strftime('%a')] = entry['count']
        
        system_overview_data = []
        for i in range(6, -1, -1):
            date_cursor = today - timedelta(days=i)
            day_name = date_cursor.strftime('%a')
            system_overview_data.append({
                "day": day_name,
                "value": enrollment_dict.get(day_name, 0)
            })

        return Response({
            "user_growth_monthly": user_growth_monthly,
            "calendar_data": calendar_data,
            "course_stats": course_stats_data,
            "recent_activity": activity_data,
            "system_overview": system_overview_data
        })

    # --- 3. EXCEL / CSV EXPORT ---
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        if not request.user.has_module_permission('dashboard', 'export'): return Response(status=403)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="LMS_Dashboard_{timezone.now().date()}.csv"'

        writer = csv.writer(response)
        
        # Decorative Header
        writer.writerow(['================================================'])
        writer.writerow(['           LMS ADMINISTRATIVE REPORT            '])
        writer.writerow([f'           Generated: {timezone.now().date()}    '])
        writer.writerow(['================================================'])
        writer.writerow([])

        # Quick Stats Card
        writer.writerow(['>>> KEY PERFORMANCE INDICATORS'])
        writer.writerow(['Metric', 'Value', 'Status'])
        writer.writerow(['Total Registered Users', User.objects.count(), 'Live'])
        writer.writerow(['Total Courses Available', Course.objects.count(), 'Active'])
        writer.writerow(['Video Content Library', Lesson.objects.exclude(video='').count(), 'Healthy'])
        writer.writerow([])

        # Calendar Activity (Last 14 Days)
        writer.writerow(['>>> RECENT DAILY REGISTRATIONS'])
        writer.writerow(['Date', 'New Users', 'Activity Level'])
        today = timezone.now().date()
        for i in range(13, -1, -1):
            day = today - timedelta(days=i)
            count = User.objects.filter(created_at__date=day).count()
            # Visual indicator in CSV using text
            level = "★★★" if count > 5 else "★★" if count > 0 else "☆"
            writer.writerow([day.strftime('%Y-%m-%d'), count, level])

        return response

    # --- 4. PDF EXPORT ---
    @action(detail=False, methods=['get'])
    def export_pdf(self, request):
        if not request.user.has_module_permission('dashboard', 'export'): return Response(status=403)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="LMS_Report_{timezone.now().date()}.pdf"'

        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        # Title
        elements.append(Paragraph(f"LMS Admin Report - {timezone.now().date()}", styles['Title']))
        elements.append(Spacer(1, 20))

        # Helper to draw tables
        def draw_section(title, data):
            elements.append(Paragraph(title, styles['Heading2']))
            elements.append(Spacer(1, 10))
            t = Table(data, colWidths=[200, 100])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.indigo),
                ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 20))

        # Overview Data
        overview = [
            ['Metric', 'Count'],
            ['Total Users', User.objects.count()],
            ['Total Courses', Course.objects.count()],
            ['Total Videos', Lesson.objects.exclude(video__isnull=True).exclude(video='').count()]
        ]
        draw_section("System Overview", overview)

        # Growth Data
        today = timezone.now()
        one_year_ago = today - timedelta(days=365)
        monthly_qs = User.objects.filter(created_at__gte=one_year_ago)\
            .annotate(p=TruncMonth('created_at')).values('p').annotate(c=Count('id'))
        m_dict = {e['p'].strftime('%b %Y'): e['c'] for e in monthly_qs if e['p']}
        
        growth = [['Month', 'Users']]
        for i in range(11, -1, -1):
            d = today - timedelta(days=i*30)
            k = d.strftime('%b %Y')
            growth.append([k, m_dict.get(k, 0)])
            
        draw_section("User Growth (12 Months)", growth)

        doc.build(elements)
        return response
    
class CourseWorkflowView(RetrieveAPIView):
    """
    GET /lms/courses/{course_id}/workflow/
    Returns user's current workflow status for a course
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CourseWorkflowSerializer
    queryset = Course.objects.all().select_related('stats').prefetch_related('roadmap', 'tests__questions__options')
    lookup_field = 'pk'


class AdminGrowthReportListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.has_module_permission('reports', 'manage'):
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        employees_with_reports = User.objects.filter(
            role__permissions__codename=build_permission_codename('employee_dashboard', 'view')
        ).prefetch_related(
            Prefetch( 
                'employeegrowthreport_set',
                queryset=EmployeeGrowthReport.objects.select_related('course').order_by('-updated_at')
            )
        ).distinct().order_by('first_name', 'last_name')

        serializer = AdminEmployeeGrowthSummarySerializer(employees_with_reports, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyGrowthReportListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        my_reports = EmployeeGrowthReport.objects.filter(user=user).select_related('course').order_by('course__title')
        serializer = EmployeeGrowthReportSerializer(my_reports, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class GrowthComparisonView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, *args, **kwargs):
        user = request.user
        course = get_object_or_404(Course, id=course_id)
        pre_test_result = PreTestResult.objects.filter(user=user, course=course).first()
        post_test_results = PostTestResult.objects.filter(user=user, course=course).order_by('completed_at')
        best_post_test_result = None
        if post_test_results.exists():
            best_post_test_result = post_test_results.order_by('-percentage', '-completed_at').first()
        growth_report = EmployeeGrowthReport.objects.filter(user=user, course=course).first()

        chart_labels = []
        chart_scores = []
        chart_colors = []

        if pre_test_result:
            chart_labels.append("Pre-test")
            chart_scores.append(pre_test_result.percentage)
            chart_colors.append("#FBBF24") # Yellow for Pre-test

        for ptr in post_test_results:
            chart_labels.append(f"Post-test {ptr.attempt_number}")
            chart_scores.append(ptr.percentage)
            if best_post_test_result and ptr.id == best_post_test_result.id: # Compare by ID to match the actual best object
                chart_colors.append("#8B5CF6") # Purple for the best post-test
            elif ptr.passed:
                chart_colors.append("#34D399") # Green for passed attempts
            else:
                chart_colors.append("#EF4444") # Red for failed attempts

        comparison_data = {
            'course_id': course.id,
            'course_title': course.title,
            'pre_test': pre_test_result,
            'post_tests': post_test_results,
            'best_post_test': best_post_test_result,
            'growth_report': growth_report,
            'chart_data': {
                'labels': chart_labels,
                'scores': chart_scores,
                'colors': chart_colors,
            }
        }
        serializer = GrowthComparisonSerializer(comparison_data, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_certificate_data(request, course_id):
    user = request.user

    try:
        # 1. Check if the course exists
        course = Course.objects.get(id=course_id)
        assignment = CourseAssignment.objects.get(employee=user, course=course)

        if not assignment.is_course_completed:
            return Response(
                {"detail": "Course not completed by this user."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        latest_passed_post_test = PostTestResult.objects.filter(
            user=user,
            course=course,
            passed=True
        ).order_by('-completed_at').first()

        if not latest_passed_post_test:
           
            return Response(
                {"detail": "No successful post-test found for completed course."},
                status=status.HTTP_404_NOT_FOUND
            )

        # 4. Gather data for the certificate
        employee_name = f"{user.first_name} {user.last_name}" # Or from lms_profile if used
        cert_identifier = f"{user.id}-{course.id}-{assignment.assigned_at.strftime('%Y%m%d')}"
        certificate_id_hash = str(uuid.uuid5(uuid.NAMESPACE_URL, cert_identifier))[:8].upper() # First 8 chars of a UUID hash


        certificate_data = {
            "course_id": course.id,
            "course_title": course.title,
            "employee_id": user.id,
            "employee_name": employee_name,
            "completion_date": assignment.updated_at.isoformat(), # Use assignment updated_at as completion date
            "certificate_id": certificate_id_hash,
            "grade_or_percentage": latest_passed_post_test.percentage
        }
        return Response(certificate_data, status=status.HTTP_200_OK)

    except Course.DoesNotExist:
        return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
    except CourseAssignment.DoesNotExist:
        return Response(
            {"detail": "Course not assigned to this user or completion record missing."},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"detail": f"An internal error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LessonAttachmentViewSet(viewsets.ModelViewSet):
    queryset = LessonAttachment.objects.all()
    serializer_class = LessonAttachmentSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = LessonAttachment.objects.select_related('lesson', 'lesson__course')

        # 1. Full managers see everything
        if user.has_module_permission('courses', 'manage'):
            pass # No filtering needed for admins

        elif has_team_scope(user, 'courses') or has_team_scope(user, 'groups'):
            qs = qs.filter(
                lesson__course__groups__team_leaders=user
            ).distinct()

        elif has_self_scope(user, 'courses'):
            qs = qs.filter(
                Q(lesson__course__groups__employees=user) |
                Q(lesson__course__assignments__employee=user)
            ).distinct()

        else:
            return LessonAttachment.objects.none()

        # 3. Optional: Filter by specific lesson if query param provided
        lesson_id = self.request.query_params.get("lesson_id")
        if lesson_id:
            qs = qs.filter(lesson__id=lesson_id)
            
        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    @action(detail=False, methods=['post'], url_path='bulk-upload')
    def bulk_upload(self, request):
        lesson_id = request.data.get('lesson')
        files = request.FILES.getlist('files')
        urls = request.data.getlist('urls')

        if not lesson_id:
            return Response({'error': 'Lesson ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not files and not urls:
            return Response({'error': 'No files or URLs provided'}, status=status.HTTP_400_BAD_REQUEST)

        saved_attachments = []
        errors = [] 

        # Process Files (Videos, PDFs, etc.)
        for f in files:
            try:
                attachment = LessonAttachment.objects.create(
                    lesson_id=lesson_id,
                    file=f,
                    name=f.name 
                )
                saved_attachments.append(attachment)
            except Exception as e:
                errors.append(f"Error saving file {f.name}: {str(e)}")

        # Process URLs
        for link in urls:
            if link and link.strip() != "":
                try: 
                    attachment = LessonAttachment.objects.create(
                        lesson_id=lesson_id,
                        url_link=link,
                        name=link 
                    )
                    saved_attachments.append(attachment) 
                except Exception as e:
                    errors.append(f"Error saving URL {link}: {str(e)}") 

        # Return results
        serializer = self.get_serializer(saved_attachments, many=True) 
        
        response_status = status.HTTP_201_CREATED if saved_attachments else status.HTTP_400_BAD_REQUEST
        if saved_attachments and errors:
             response_status = status.HTTP_207_MULTI_STATUS

        return Response({
            "uploaded": serializer.data,
            "errors": errors
        }, status=response_status)

class CourseReportStatsView(APIView):
    permission_classes = [IsAuthenticated] # 1. Ensure user is logged in

    def get(self, request):
        user = request.user
        user_role = getattr(getattr(user, 'role', None), 'name', None)
        
        # 2. Start with All Courses
        courses_qs = Course.objects.all().order_by('-created')

        can_manage_reports = (
            user.has_module_permission('course_reports', 'manage') or
            user.has_module_permission('reports', 'manage')
        )
        can_view_reports = (
            user.has_module_permission('course_reports', 'view') or
            user.has_module_permission('reports', 'view')
        )

        if not can_manage_reports:
            if not can_view_reports:
                return Response({"error": "Unauthorized"}, status=403)

            if has_team_scope(user, 'courses') or has_team_scope(user, 'groups'):
                assigned_course_ids = CourseAssignment.objects.filter(
                    assigned_by=user
                ).values_list('course_id', flat=True)

                group_course_ids = Group.objects.filter(
                    team_leaders=user
                ).values_list('course_id', flat=True)

                # Combine unique IDs
                relevant_ids = set(list(assigned_course_ids) + list(group_course_ids))
                
                # Filter the main queryset
                courses_qs = courses_qs.filter(id__in=relevant_ids)
            elif has_self_scope(user, 'courses'):
                own_course_ids = CourseAssignment.objects.filter(
                    employee=user
                ).values_list('course_id', flat=True)
                courses_qs = courses_qs.filter(id__in=own_course_ids)
            else:
                return Response({"error": "Unauthorized"}, status=403)

        # 4. Serialize the Filtered Courses
        course_serializer = CourseReportSerializer(courses_qs, many=True)
        filtered_ids = courses_qs.values_list('id', flat=True)
        relevant_assignments = CourseAssignment.objects.filter(course_id__in=filtered_ids)

        total_courses = courses_qs.count()
        total_enrollments = relevant_assignments.count()
        
        # Completion Rate
        completed_assignments = relevant_assignments.filter(is_course_completed=True).count()
        global_completion_rate = round((completed_assignments / total_enrollments * 100), 1) if total_enrollments > 0 else 0

        # Unique active students in this subset
        active_students = relevant_assignments.values('employee').distinct().count()
        
        # Instructors involved in this subset
        instructor_ids = courses_qs.values_list('instructor', flat=True)
        total_instructors = LMSProfile.objects.filter(user_id__in=instructor_ids).distinct().count()

        summary_data = {
            "totalCourses": total_courses,
            "totalEnrollments": total_enrollments,
            "completionRate": global_completion_rate,
            "avgRating": 4.5, 
            "totalRevenue": 0, 
            "certificatesIssued": completed_assignments,
            "activeStudents": active_students,
            "totalInstructors": total_instructors,
        }

        # 6. Calculate Categories for this subset
        category_counts = {}
        for course in course_serializer.data:
            cat = course['category']
            if cat:
                category_counts[cat] = category_counts.get(cat, 0) + 1
        
        category_data = [
            {"name": k, "count": v} for k, v in category_counts.items()
        ]

        return Response({
            "role": user_role, # Send role back to frontend for UI adjustments
            "summary": summary_data,
            "courses": course_serializer.data,
            "categories": category_data
        })




import datetime

class TrainingScheduleViewSet(viewsets.ModelViewSet):
    queryset = TrainingSchedule.objects.all()
    serializer_class = TrainingScheduleSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        queryset = TrainingSchedule.objects.select_related('group', 'trainer').all()

        # 1. Security: Filter by permission scope
        if not user.has_module_permission('planning', 'manage'):
            if has_team_scope(user, 'planning') or has_team_scope(user, 'groups'):
                queryset = queryset.filter(group__team_leaders=user)
            elif has_self_scope(user, 'planning') or has_self_scope(user, 'groups'):
                queryset = queryset.filter(group__employees=user)
            else:
                return TrainingSchedule.objects.none()

        # 2. Filter for Calendar View
        group_id = self.request.query_params.get('group_id')
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if group_id:
            queryset = queryset.filter(group_id=group_id)
        if month and year:
        # Monthly View (No Change)
            queryset = queryset.filter(date__month=month, date__year=year)
        elif year: 
            start_date = f"{year}-04-01"
            end_date = f"{int(year)+1}-03-31"
            queryset = queryset.filter(date__range=[start_date, end_date])
        
        return queryset

    # --- 1. CUSTOM CREATE (MANUAL ENTRY) ---
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        group = data['group']
        date_obj = data['date']
        status_val = data.get('status', 'Planned')

        # 1. Look for ALL existing records for this specific slot
        existing_records = TrainingSchedule.objects.filter(
            group=group, 
            date=date_obj, 
            status=status_val
        ).order_by('id') # Order ensures we always pick the oldest one to keep

        if existing_records.exists():
            # A. UPDATE: Pick the first one found
            obj = existing_records.first()
            
            # Update fields
            obj.topic = data.get('topic', '')
            obj.trainer = data.get('trainer', None)
            obj.trainer_name_text = data.get('trainer_name_text', '')
            obj.duration = data.get('duration', '1 Hour')
            obj.save()

            # B. CLEANUP: If there were duplicates (the cause of your 500 error), delete them now
            # This deletes every record in the list EXCEPT the one we just saved
            if existing_records.count() > 1:
                existing_records.exclude(id=obj.id).delete()
                print(f"Warning: Deleted duplicate schedules for {date_obj}")

            return Response(self.get_serializer(obj).data, status=status.HTTP_200_OK)
        
        else:
            # C. CREATE: No record exists, make a new one
            obj = TrainingSchedule.objects.create(
                group=group,
                date=date_obj,
                status=status_val,
                topic=data.get('topic', ''),
                trainer=data.get('trainer', None),
                trainer_name_text=data.get('trainer_name_text', ''),
                duration=data.get('duration', '1 Hour')
            )
            return Response(self.get_serializer(obj).data, status=status.HTTP_201_CREATED)

    # --- 2. EXCEL UPLOAD (GRID PARSER) ---
    @action(detail=False, methods=['post'], url_path='upload-excel')
    def upload_excel(self, request):
        file_obj = request.FILES.get('file')
        group_id = request.data.get('group_id')
        
        # User current view context
        req_month = int(request.data.get('month', 0))
        req_year = int(request.data.get('year', 0))

        if not file_obj or not group_id or not req_month or not req_year:
            return Response({'error': 'Missing required fields (file, group_id, month, year).'}, status=400)

        try:
            wb = openpyxl.load_workbook(file_obj)
            sheet = wb.active
            
            created_count = 0
            updated_count = 0
            
            # A. Find the Header Row (containing "Sunday")
            header_row_index = None
            for i, row in enumerate(sheet.iter_rows(values_only=True), start=1):
                row_str = [str(c).lower() for c in row if c]
                if 'sunday' in row_str:
                    header_row_index = i
                    break
            
            if not header_row_index:
                return Response({'error': 'Invalid Excel Format: Could not find "Sunday/Monday" header.'}, status=400)

            # B. Process the Grid (5 Rows per week block)
            start_row = header_row_index + 1
            max_row = sheet.max_row
            
            # Step 5 rows at a time
            for row_idx in range(start_row, max_row + 1, 5):
                try:
                    # Grab the 5 rows for this week
                    block = list(sheet.iter_rows(min_row=row_idx, max_row=row_idx+4, values_only=True))
                    if len(block) < 5: break 
                    date_row, topic_row, trainer_row, dur_row, status_row = block
                except IndexError:
                    break 

                # Skip block if no valid dates found
                if not any(isinstance(x, int) for x in date_row if x):
                    continue

                # Iterate Columns (Days)
                for col_idx, cell_value in enumerate(date_row):
                    if isinstance(cell_value, int) and 1 <= cell_value <= 31:
                        try:
                            training_date = date(req_year, req_month, cell_value)
                        except ValueError:
                            continue # Skip invalid dates like Feb 30

                        # Helper to get cell value safely
                        get_val = lambda r, i: str(r[i]).strip() if i < len(r) and r[i] is not None else None
                        
                        topic = get_val(topic_row, col_idx)
                        
                        # Only process if a Topic exists
                        if topic:
                            trainer = get_val(trainer_row, col_idx)
                            duration = get_val(dur_row, col_idx)
                            status_raw = get_val(status_row, col_idx)

                            # Determine Status
                            final_status = 'Planned'
                            if status_raw:
                                s_lower = status_raw.lower()
                                if s_lower in ['actual', 'done', 'completed']: 
                                    final_status = 'Actual'
                                elif s_lower == 'cancelled': 
                                    final_status = 'Cancelled'
                            
                            # Update or Create
                            # Matches on Group + Date + STATUS
                            obj, created = TrainingSchedule.objects.update_or_create(
                                group_id=group_id,
                                date=training_date,
                                status=final_status, # <--- SEPARATES PLANNED & ACTUAL
                                defaults={
                                    'topic': topic,
                                    'trainer_name_text': trainer if trainer else '',
                                    'duration': duration if duration else '1 Hour',
                                }
                            )
                            
                            if created: created_count += 1
                            else: updated_count += 1

            return Response({
                'message': f'Sync Complete. Created: {created_count}, Updated: {updated_count}',
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f"Processing Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    # --- 3. DOWNLOAD TEMPLATE (GENERATOR) ---
    @action(detail=False, methods=['get'], url_path='download-weekly-template')
    def download_weekly_template(self, request):
        try:
            # FIX: Use datetime.datetime.now() if importing the module
            now = datetime.datetime.now()
            year_param = request.query_params.get('year')
            year = int(year_param) if year_param and year_param.isdigit() else now.year

            wb = Workbook()
            
            # --- SHEET 1: DATA ENTRY ---
            ws = wb.active
            ws.title = "Training Matrix"
            
            # Styles for a professional look
            header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
            header_font = Font(color="FFFFFF", bold=True)
            sample_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
            border_font = Font(bold=True)

            # Column Headers
            ws.merge_cells('A1:A2')
            ws.merge_cells('B1:B2')
            ws['A1'] = "Bucket / Category"
            ws['B1'] = "Training Topic"
            
            for cell in [ws['A1'], ws['B1']]:
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal='center', vertical='center')

            # Month/Week headers starting from April (Fiscal Year)
            months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March']
            col_ptr = 3
            for m in months:
                ws.merge_cells(start_row=1, start_column=col_ptr, end_row=1, end_column=col_ptr+3)
                cell = ws.cell(row=1, column=col_ptr, value=m)
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal='center')
                
                for w in range(4):
                    sub_cell = ws.cell(row=2, column=col_ptr+w, value=f"W{w+1}")
                    sub_cell.alignment = Alignment(horizontal='center')
                    sub_cell.font = Font(bold=True)
                col_ptr += 4

            # --- ADD SAMPLE ROW (Row 3) ---
            ws.cell(row=3, column=1, value="Bucket 1 (Sample)").fill = sample_fill
            ws.cell(row=3, column=2, value="Example: Fire Safety Training").fill = sample_fill
            ws.cell(row=3, column=3, value="P").fill = sample_fill  # Planned for April W1
            ws.cell(row=3, column=7, value="A").fill = sample_fill  # Actual for May W1

            # --- SHEET 2: HOW TO FILL (INSTRUCTIONS) ---
            ws_instr = wb.create_sheet("INSTRUCTIONS")
            instr_data = [
                ["USER GUIDELINES FOR WEEKLY MATRIX UPLOAD"],
                [""],
                ["1. DO NOT delete or rename the headers in Row 1 or Row 2."],
                ["2. BUCKET (Col A): Enter the training category (e.g., Behavioral, Functional)."],
                ["3. TOPIC (Col B): Enter the specific name of the training topic."],
                ["4. PLANNED TRAINING: Type 'P' in the week column you intend to train."],
                ["5. ACTUAL/DONE: Type 'A' in the week column once the training is completed."],
                ["6. FISCAL YEAR: This template follows April to March cycle."],
                ["7. IMPORTANT: Only use letters 'P' or 'A'. Other characters may be ignored."],
            ]
            for r_idx, row in enumerate(instr_data, 1):
                for c_idx, value in enumerate(row, 1):
                    cell = ws_instr.cell(row=r_idx, column=c_idx, value=value)
                    if r_idx == 1:
                        cell.font = Font(bold=True, size=14)
            
            ws_instr.column_dimensions['A'].width = 80

            # --- RESPONSE ---
            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename=Weekly_Matrix_Template_{year}.xlsx'
            wb.save(response)
            return response

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


    # @action(detail=False, methods=['get'], url_path='download-weekly-template')
    # def download_weekly_template(self, request):
    #     try:
    #         # FIX: Access now() via datetime.datetime
    #         current_now = datetime.datetime.now()
    #         year_param = request.query_params.get('year')
    #         year = int(year_param) if year_param and year_param.isdigit() else current_now.year

    #         wb = Workbook()
            
    #         # --- SHEET 1: DATA ENTRY ---
    #         ws = wb.active
    #         ws.title = "Training Matrix"
            
    #         # Professional Styles
    #         header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
    #         header_font = Font(color="FFFFFF", bold=True)
    #         sample_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
            
    #         # Set up Column Headers for Topics
    #         ws.merge_cells('A1:A2')
    #         ws.merge_cells('B1:B2')
    #         ws['A1'], ws['B1'] = "Bucket / Category", "Training Topic"
            
    #         for cell in [ws['A1'], ws['B1']]:
    #             cell.font, cell.fill, cell.alignment = header_font, header_fill, Alignment(horizontal='center', vertical='center')

    #         # Month and Week Headers (April to March Fiscal Year)
    #         months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March']
    #         col_ptr = 3
    #         for m in months:
    #             ws.merge_cells(start_row=1, start_column=col_ptr, end_row=1, end_column=col_ptr+3)
    #             cell = ws.cell(row=1, column=col_ptr, value=m)
    #             cell.font, cell.fill, cell.alignment = header_font, header_fill, Alignment(horizontal='center')
                
    #             for w in range(4):
    #                 sub_cell = ws.cell(row=2, column=col_ptr+w, value=f"W{w+1}")
    #                 sub_cell.alignment = Alignment(horizontal='center')
    #                 sub_cell.font = Font(bold=True)
    #             col_ptr += 4

    #         # --- SAMPLE DATA ROW ---
    #         ws.cell(row=3, column=1, value="Bucket 1 (Sample)").fill = sample_fill
    #         ws.cell(row=3, column=2, value="Fire Safety Awareness").fill = sample_fill
    #         ws.cell(row=3, column=3, value="P").fill = sample_fill  # Planned for April W1
    #         ws.cell(row=3, column=7, value="A").fill = sample_fill  # Actual for May W1

    #         # --- SHEET 2: INSTRUCTIONS ---
    #         ws_instr = wb.create_sheet("INSTRUCTIONS")
    #         instr_data = [
    #             ["HOW TO FILL THIS TEMPLATE"],
    #             [""],
    #             ["1. Do not modify the headers in Row 1 and Row 2."],
    #             ["2. Bucket (Column A): Enter the category name (e.g., Soft Skills, Functional)."],
    #             ["3. Topic (Column B): Enter the specific training name."],
    #             ["4. Planning: Type 'P' in the week you plan to conduct the training."],
    #             ["5. Completion: Type 'A' in the week the training was actually completed."],
    #             ["6. Fiscal Year: This template follows the April to March cycle."],
    #         ]
    #         for r_idx, row in enumerate(instr_data, 1):
    #             for c_idx, val in enumerate(row, 1):
    #                 cell = ws_instr.cell(row=r_idx, column=c_idx, value=val)
    #                 if r_idx == 1: cell.font = Font(bold=True, size=14)
            
    #         ws_instr.column_dimensions['A'].width = 80

    #         response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    #         response['Content-Disposition'] = f'attachment; filename=Weekly_Matrix_Template_{year}.xlsx'
    #         wb.save(response)
    #         return response

    #     except Exception as e:
    #         import traceback
    #         traceback.print_exc()
    #         return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['get'], url_path='download-weekly-template')
    def download_weekly_template(self, request):
        try:
            # Fixing the datetime.now() issue mentioned previously
            current_now = datetime.datetime.now()
            year_param = request.query_params.get('year')
            year = int(year_param) if year_param and year_param.isdigit() else current_now.year

            wb = Workbook()
            
            # --- SHEET 1: DATA ENTRY ---
            ws = wb.active
            ws.title = "Training Matrix"
            
            # Styling for Headers
            header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
            header_font = Font(color="FFFFFF", bold=True)
            sample_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

            # Column A & B Headers
            ws.merge_cells('A1:A2')
            ws.merge_cells('B1:B2')
            ws['A1'], ws['B1'] = "Bucket / Category", "Training Topic"
            
            for cell in [ws['A1'], ws['B1']]:
                cell.font, cell.fill, cell.alignment = header_font, header_fill, Alignment(horizontal='center', vertical='center')

            # Month and Week Headers (Fiscal Year: April to March)
            months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March']
            col_ptr = 3
            for m in months:
                ws.merge_cells(start_row=1, start_column=col_ptr, end_row=1, end_column=col_ptr+3)
                cell = ws.cell(row=1, column=col_ptr, value=m)
                cell.font, cell.fill, cell.alignment = header_font, header_fill, Alignment(horizontal='center')
                
                for w in range(4):
                    sub_cell = ws.cell(row=2, column=col_ptr+w, value=f"W{w+1}")
                    sub_cell.alignment = Alignment(horizontal='center')
                    sub_cell.font = Font(bold=True)
                col_ptr += 4

            # --- ADD SAMPLE DATA ROW (Helps user understand the format) ---
            ws.cell(row=3, column=1, value="Bucket 1 (Sample)").fill = sample_fill
            ws.cell(row=3, column=2, value="Example: Fire Safety Training").fill = sample_fill
            ws.cell(row=3, column=3, value="P").fill = sample_fill  # Planned for April W1
            ws.cell(row=3, column=7, value="A").fill = sample_fill  # Actual for May W1

            # --- NEW: SHEET 2: INSTRUCTIONS ---
            # This creates the second tab in the Excel file
            ws_instr = wb.create_sheet("INSTRUCTIONS") 
            
            instr_data = [
                ["USER GUIDELINES FOR DATA ENTRY"],
                [""],
                ["1. HEADERS: Do not delete or rename the headers in Row 1 or Row 2."],
                ["2. BUCKET (Col A): Enter the category (e.g., Soft Skills, Functional, Safety)."],
                ["3. TOPIC (Col B): Enter the name of the training topic."],
                ["4. PLANNED TRAINING: Type 'P' in the week column you intend to train."],
                ["5. ACTUAL / DONE: Type 'A' in the week column once training is finished."],
                ["6. FISCAL YEAR: This template follows the April to March fiscal cycle."],
                ["7. SYMBOLS: Use only 'P' and 'A'. Other text may be ignored by the system."],
            ]

            for r_idx, row in enumerate(instr_data, 1):
                for c_idx, val in enumerate(row, 1):
                    cell = ws_instr.cell(row=r_idx, column=c_idx, value=val)
                    # Make the title bold and larger
                    if r_idx == 1:
                        cell.font = Font(bold=True, size=14, color="1E293B")
            
            # Widen the first column so the instructions are visible
            ws_instr.column_dimensions['A'].width = 85 

            # --- GENERATE RESPONSE ---
            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename=Weekly_Matrix_Template_{year}.xlsx'
            wb.save(response)
            return response

        except Exception as e:
            return Response({"error": str(e)}, status=500)


    @action(detail=False, methods=['post'], url_path='upload-weekly-template')
    def upload_weekly_template(self, request):
        file_obj = request.FILES.get('file')
        group_id = request.data.get('group_id')
        year = int(request.data.get('year', 2026))

        wb = openpyxl.load_workbook(file_obj, data_only=True)
        ws = wb.active
        
        # Month mapping for Fiscal Year (Apr-Mar)
        months = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]
        
        for row in range(3, ws.max_row + 1):
            topic = ws.cell(row=row, column=2).value
            if not topic: continue
            
            col_ptr = 3
            for m_idx in months:
                current_year = year if m_idx >= 4 else year + 1
                for w in range(4):
                    val = ws.cell(row=row, column=col_ptr).value
                    if val:
                        # Logic: W1=1st, W2=8th, etc.
                        status = 'Actual' if str(val).lower() in ['a', 'done', 'x'] else 'Planned'
                        TrainingSchedule.objects.update_or_create(
                            group_id=group_id,
                            topic=topic,
                            date=date(current_year, m_idx, (w * 7) + 1),
                            defaults={'status': status, 'duration': '1 Hour'}
                        )
                    col_ptr += 1

        return Response({'message': 'Weekly Matrix Uploaded Successfully'})



class CompetencyLibraryViewSet(viewsets.ModelViewSet):
    queryset = CompetencyCategory.objects.all().order_by('order')
    serializer_class = CompetencyCategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None


    @action(detail=False, methods=['get'])
    def for_rules(self, request):
        """
        Returns individual SKILLS (Competencies) for the Rule Engine dropdown.
        """
        # Fetch all Competencies (e.g., "Python", "Communication")
        skills = Competency.objects.select_related('category').all().order_by('title')
        
        result = []
        for skill in skills:
            result.append({
                'id': skill.id, 
                'name': skill.title, 
                'category': skill.category.name if skill.category else 'General',
                'description': skill.description or f"Skill: {skill.title}"
            })
        return Response(result)

    @action(detail=False, methods=['get'])
    def assessment_structure(self, request):
        """
        Fetches categories and aggregates all questions from competencies 
        under those categories for the Assessment Page.
        """
        categories = CompetencyCategory.objects.all().order_by('order')
        structure = []

        for cat in categories:
            # Get all competencies for this category
            competencies = cat.competencies.all()
            
            # Aggregate questions from ALL competencies in this category
            cat_questions = []
            for comp in competencies:
                questions = comp.questions.all() # Uses related_name='questions' from model
                for q in questions:
                    cat_questions.append({
                        "id": str(q.id),
                        "question": q.question_text,
                        "points": q.points,
                        "competency_id": comp.id # Good to track which skill this belongs to
                    })
            
            # Only add category if it has questions
            if cat_questions:
                structure.append({
                    "name": cat.name,
                    "icon": cat.icon or "layers", # Fallback icon
                    "questions": cat_questions
                })
        
        return Response(structure)
    
    @action(detail=False, methods=['get'])
    def questions_for_employee(self, request):
        """
        GET /lms/library/questions_for_employee/?employee_id=123
        Returns questions filtered by the rules applicable to this employee's hierarchy.
        """
        emp_id = request.query_params.get('employee_id')
        if not emp_id:
            return Response({"error": "Employee ID is required"}, status=400)

        # 1. Get Employee Profile
        try:
            profile = LMSProfile.objects.get(user_id=emp_id)
        except LMSProfile.DoesNotExist:
            return Response({"error": "Employee profile not found"}, status=404)

        rules = CompetencyRule.objects.filter(is_active=True)
        if profile.department:
            rules = rules.filter(Q(department=profile.department) | Q(department__isnull=True) | Q(department=''))
        
        if profile.designation:
            rules = rules.filter(Q(designation=profile.designation) | Q(designation__isnull=True) | Q(designation=''))
            
        if profile.hq:
            rules = rules.filter(Q(hq=profile.hq) | Q(hq__isnull=True) | Q(hq=''))
            
        if profile.bu:
            rules = rules.filter(Q(business_unit=profile.bu) | Q(business_unit__isnull=True) | Q(business_unit=''))
            
        if profile.section:
            rules = rules.filter(Q(section=profile.section) | Q(section__isnull=True) | Q(section=''))

        # 3. Extract Competency IDs from these Rules
        target_competency_ids = RuleCompetency.objects.filter(rule__in=rules).values_list('competency_id', flat=True).distinct()

        if not target_competency_ids:
            return Response([], status=200) # No rules found = No questions

        # 4. Build Response Structure (Category -> Competency -> Questions)
        categories = CompetencyCategory.objects.all().order_by('order')
        structure = []

        for cat in categories:
            # Only fetch competencies that are in our Target List AND belong to this category
            relevant_competencies = cat.competencies.filter(id__in=target_competency_ids)
            
            cat_questions = []
            for comp in relevant_competencies:
                questions = comp.questions.all()
                for q in questions:
                    cat_questions.append({
                        "id": str(q.id),
                        "question": q.question_text,
                        "points": q.points,
                        "competency_id": comp.id,
                        "competency_name": comp.title
                    })
            
            if cat_questions:
                structure.append({
                    "id": cat.id,
                    "name": cat.name,
                    "icon": cat.icon or "layers",
                    "questions": cat_questions
                })
        
        return Response(structure)





from .models import CompetencyRule, RuleCompetency, Competency
from .serializers import CompetencyRuleSerializer, RuleCompetencySerializer
class CompetencyRuleViewSet(viewsets.ModelViewSet):
    queryset = CompetencyRule.objects.all().order_by('-created_at')
    serializer_class = CompetencyRuleSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Custom Create Method.
        Handles the nested payload structure:
        {
            "meta": { "financialYear": "FY 2024-25" },
            "hierarchy": { 
                "hq": "Delhi", 
                "bu": "Bu 1", 
                "department": "IT", 
                "section": "", 
                "designation": "" 
            },
            "competencies": [ { "skillId": 1, "targetLevel": 3 }, ... ]
        }
        """
        data = request.data
        meta = data.get('meta', {})
        hierarchy = data.get('hierarchy', {})
        competencies_data = data.get('competencies', [])

        # 1. Extract Fields
        financial_year = meta.get('financialYear', 'FY 2024-25')
        hq = hierarchy.get('hq') or None
        bu = hierarchy.get('bu') or None # 'bu' comes from frontend payload key
        department = hierarchy.get('department') or None
        section = hierarchy.get('section') or None
        designation = hierarchy.get('designation') or None

        # 2. Validation: Ensure at least one hierarchy level is selected
        if not any([hq, bu, department, section, designation]):
            return Response(
                {"error": "At least one hierarchy level (HQ, BU, Dept, Section, or Designation) must be selected."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        parts = [p for p in [hq, bu, department, section, designation] if p]
        rule_name = f"{financial_year}: " + " > ".join(parts)
        rule, created = CompetencyRule.objects.update_or_create(
            financial_year=financial_year,
            hq=hq,
            business_unit=bu,
            department=department,
            section=section,
            designation=designation,
            defaults={
                'name': rule_name,
                'created_by': request.user if request.user.is_authenticated else None,
                'is_active': True
            }
        )

        # 5. Link Competencies
        # If updating an existing rule, clear old competencies first
        if not created:
            rule.rule_competencies.all().delete()

        # Bulk create the new competencies
        new_competencies = []
        for comp in competencies_data:
            try:
                c_obj = Competency.objects.get(pk=comp['skillId'])
                new_competencies.append(
                    RuleCompetency(
                        rule=rule,
                        competency=c_obj,
                        target_level=comp['targetLevel']
                    )
                )
            except Competency.DoesNotExist:
                continue
        
        if new_competencies:
            RuleCompetency.objects.bulk_create(new_competencies)

        # 6. Return the result
        serializer = self.get_serializer(rule)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def fetch_rule(self, request):
        """
        Fetches an Exact Match rule based on provided query params.
        Endpoint: /lms/rules/fetch_rule/?hq=Delhi&department=IT...
        """
        # Get params from URL
        p_hq = request.query_params.get('hq')
        p_bu = request.query_params.get('business_unit') # Note: Check if frontend sends 'business_unit' or 'bu'
        p_dept = request.query_params.get('department')
        p_section = request.query_params.get('section')
        p_desig = request.query_params.get('designation')
        p_fy = request.query_params.get('financial_year', 'FY 2024-25')

        # Convert empty strings to None for database matching
        p_hq = p_hq if p_hq else None
        p_bu = p_bu if p_bu else None
        p_dept = p_dept if p_dept else None
        p_section = p_section if p_section else None
        p_desig = p_desig if p_desig else None
        filters = {
            'financial_year': p_fy,
            'hq': p_hq,
            'business_unit': p_bu,
            'department': p_dept,
            'section': p_section,
            'designation': p_desig
        }

        # Execute Query
        rule = CompetencyRule.objects.filter(**filters).first()

        if rule:
            return Response({
                "found": True,
                "id": rule.id,
                "name": rule.name,
                "financial_year": rule.financial_year,
                "competencies": [
                    {
                        "id": rc.competency.id,
                        "name": rc.competency.title,
                        "category": rc.competency.category.name if rc.competency.category else "General",
                        "description": rc.competency.description,
                        "targetLevel": rc.target_level
                    }
                    for rc in rule.rule_competencies.all()
                ]
            })
        
        return Response({"found": False})

class CompetencyMatrixViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        # 1. Capture hierarchy parameters (Strip whitespace to be safe)
        category_filter = request.query_params.get('category', 'All')
        view_level = request.query_params.get('view_level', 'hq')
        
        hq = request.query_params.get('hq', '').strip() or None
        bu = request.query_params.get('bu', '').strip() or None
        dept = request.query_params.get('department', '').strip() or None
        sec = request.query_params.get('section', '').strip() or None

        # 2. Base Employee Query 
        # We use __iexact to ignore case sensitivity (e.g., "IT" vs "it")
        employees = User.objects.filter(
            is_active=True,
            role__permissions__codename='view_courses'
        ).exclude(
            role__permissions__codename='manage_courses'
        ).select_related('lms_profile').distinct()
        
        if hq: employees = employees.filter(lms_profile__hq__iexact=hq)
        if bu: employees = employees.filter(lms_profile__bu__iexact=bu)
        if dept: employees = employees.filter(lms_profile__department__iexact=dept)
        if sec: employees = employees.filter(lms_profile__section__iexact=sec)

        # 3. Dynamic Column Logic:
        # We find all competencies relevant to the path OR any competency already taken by these employees
        rule_query = Q(is_active=True)
        
        # Filter rules leniently (if rule has HQ defined, it must match, or be generic)
        if hq: rule_query &= (Q(hq__iexact=hq) | Q(hq__isnull=True) | Q(hq=''))
        if bu: rule_query &= (Q(business_unit__iexact=bu) | Q(business_unit__isnull=True) | Q(business_unit=''))
        if dept: rule_query &= (Q(department__iexact=dept) | Q(department__isnull=True) | Q(department=''))
        
        rule_comp_ids = CompetencyRule.objects.filter(rule_query).values_list('rule_competencies__competency', flat=True)
        
        # Also include competencies that employees in this view have actually attended
        attained_comp_ids = EmployeeCompetencyMatrix.objects.filter(employee__in=employees).values_list('competency_id', flat=True)
        
        all_visible_ids = set(list(rule_comp_ids) + list(attained_comp_ids))
        
        competencies = Competency.objects.filter(id__in=all_visible_ids).select_related('category')
        if category_filter != 'All':
            competencies = competencies.filter(category__name=category_filter)
        
        comps_header = [{'id': str(c.id), 'name': c.title, 'category': c.category.name} for c in competencies]

        # 4. Data Mapping
        matrix_data = EmployeeCompetencyMatrix.objects.filter(
            employee__in=employees, competency__in=competencies
        ).values('employee_id', 'competency_id', 'actual_level', 'target_level', 'assessed_at')

        employee_map = {}
        for entry in matrix_data:
            eid, cid = entry['employee_id'], entry['competency_id']
            if eid not in employee_map: employee_map[eid] = {}
            # Keep latest assessment if duplicates exist
            if cid not in employee_map[eid] or entry['assessed_at'] > employee_map[eid][cid]['assessed_at']:
                employee_map[eid][cid] = entry

        rows = []

        # 5. Build Aggregated Rows (HQ, BU, Dept, Section)
        if view_level in ['hq', 'bu', 'department', 'section']:
            group_field = {'hq': 'hq', 'bu': 'bu', 'department': 'department', 'section': 'section'}[view_level]
            group_names = set()
            for e in employees:
                if hasattr(e, 'lms_profile'):
                    val = getattr(e.lms_profile, group_field)
                    if val:
                        group_names.add(val)

            for name in sorted(group_names):
                row = {'id': name, 'name': name, 'type': view_level, 'competencies': {}}
                
                # Filter employees belonging to this specific group (Case Insensitive Match)
                group_emp_ids = [
                    e.id for e in employees 
                    if hasattr(e, 'lms_profile')
                    and getattr(e.lms_profile, group_field, None)
                    and str(getattr(e.lms_profile, group_field, '')).strip().lower() == str(name).strip().lower()
                ]
                
                for comp in competencies:
                    # Calculate average for this group/competency combo
                    scores = [employee_map.get(eid, {}).get(comp.id, {}).get('actual_level', 0) for eid in group_emp_ids]
                    valid_scores = [s for s in scores if s > 0]
                    if valid_scores:
                        row['competencies'][str(comp.id)] = {'avg': round(sum(valid_scores)/len(valid_scores), 1)}
                    else:
                        row['competencies'][str(comp.id)] = None
                rows.append(row)

        # 6. Build Employee Level Rows
        elif view_level == 'employee':
            for emp in employees:
                profile = emp.lms_profile
                row = {
                    'id': emp.id,
                    'name': f"{profile.firstName} {profile.lastName}",
                    'type': 'employee',
                    'avatar': f"{profile.firstName[0]}{profile.lastName[0]}" if profile.firstName else 'U',
                    'competencies': {}
                }
                for comp in competencies:
                    data = employee_map.get(emp.id, {}).get(comp.id)
                    
                    # Improvement Delta Logic
                    prev = EmployeeCompetencyMatrix.objects.filter(
                        employee=emp, competency=comp
                    ).order_by('-assessed_at')[1:2].first()
                    
                    row['competencies'][str(comp.id)] = {
                        'actual_level': data['actual_level'] if data else 0,
                        'target_level': data['target_level'] if data else None,
                        'delta': (data['actual_level'] - prev.actual_level) if data and prev else 0
                    }
                rows.append(row)

        return Response({'rows': rows, 'competencies': comps_header})
        
    @action(detail=False, methods=['post'], url_path='update')
    def update_cell(self, request):
        d = request.data
        try:
            entry, _ = EmployeeCompetencyMatrix.objects.update_or_create(
                employee_id=d['employee_id'],
                competency_id=d['competency_id'],
                defaults={
                    'actual_level': d['actual_level'], 
                    'source': d.get('source', 'Manager')
                }
            )
            return Response({'status': 'success', 'level': entry.actual_level})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    
from .models import GroupMessage
from .serializers import GroupMessageSerializer
class GroupMessageViewSet(viewsets.ModelViewSet):
    serializer_class = GroupMessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        # Get messages for a specific group
        group_id = self.request.query_params.get('group_id')
        if group_id:
            return GroupMessage.objects.select_related('sender', 'group').filter(group_id=group_id).order_by('timestamp')
        return GroupMessage.objects.none()
    
    def perform_create(self, serializer):
        # Allow posting via REST API as fallback (optional)
        serializer.save(sender=self.request.user)

class HierarchyViewSet(viewsets.ViewSet):
    """Dropdowns for Rule Engine"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        depts = LMSProfile.objects.exclude(department__isnull=True).exclude(department='')\
            .values_list('department', flat=True).distinct().order_by('department')
        dept_list = [{'id': d, 'name': d} for d in depts]

        groups_by_dept = {}
        all_groups = Group.objects.prefetch_related('employees__lms_profile').all()
        for g in all_groups:
            # Infer dept from first employee
            dept = "General"
            if g.employees.exists():
                p = getattr(g.employees.first(), 'lms_profile', None)
                if p and p.department: dept = p.department
            
            if dept not in groups_by_dept: groups_by_dept[dept] = []
            groups_by_dept[dept].append({'id': str(g.id), 'name': g.name})

        designations_by_dept = {}
        profs = LMSProfile.objects.exclude(designation='').values('department', 'designation').distinct()
        for p in profs:
            d, des = p['department'], p['designation']
            if d:
                if d not in designations_by_dept: designations_by_dept[d] = []
                designations_by_dept[d].append({'id': des, 'name': des})

        return Response({
            'departments': dept_list,
            'groups': groups_by_dept,
            'designations': designations_by_dept,
            'hqs': [{'id': 'global', 'name': 'Global HQ'}]
        })

from .models import CompetencyRule, EmployeeCompetencyMatrix, Group, RuleCompetency

class GapAnalysisViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        dept_filter = request.query_params.get('department', 'all')
        
        # 1. Fetch Employees with their profiles
        employees = User.objects.filter(is_active=True).select_related('lms_profile')
        if dept_filter != 'all':
            employees = employees.filter(lms_profile__department=dept_filter)

        results = []

        for emp in employees:
            profile = getattr(emp, 'lms_profile', None)
            if not profile:
                continue
            p_hq = profile.hq or ''
            p_bu = profile.bu or ''
            p_dept = profile.department or ''
            p_sect = profile.section or ''
            p_desig = profile.designation or ''
            
            # Get IDs of groups the employee belongs to
            emp_group_ids = Group.objects.filter(employees=emp).values_list('id', flat=True)

            # Build the query: A rule applies if its criteria matches the profile OR if criteria is empty (Global)
            # We use Q objects to ensure strict matching logic.
            hierarchy_query = Q(is_active=True) & \
                              (Q(hq__iexact=p_hq) | Q(hq__isnull=True) | Q(hq='')) & \
                              (Q(business_unit__iexact=p_bu) | Q(business_unit__isnull=True) | Q(business_unit='')) & \
                              (Q(department__iexact=p_dept) | Q(department__isnull=True) | Q(department='')) & \
                              (Q(section__iexact=p_sect) | Q(section__isnull=True) | Q(section='')) & \
                              (Q(designation__iexact=p_desig) | Q(designation__isnull=True) | Q(designation=''))

            # Fetch rules matching hierarchy
            hierarchy_rules = CompetencyRule.objects.filter(hierarchy_query)
            
            # Fetch rules matching specific Groups (Teams)
            group_rules = CompetencyRule.objects.filter(group__id__in=emp_group_ids, is_active=True)
            
            # Combine all applicable rules
            all_applicable_rules = hierarchy_rules | group_rules

            if not all_applicable_rules.exists():
                # If no rules exist for this employee's department/role, skip them (or show empty)
                continue
            merged_targets = {}

            # Prefetch rule competencies to avoid N+1 queries
            rules_with_comps = all_applicable_rules.prefetch_related('rule_competencies__competency__category')

            for rule in rules_with_comps:
                for rc in rule.rule_competencies.all():
                    comp_id = rc.competency.id
                    
                    # If this skill is already in our list, check if this rule requires a higher level
                    if comp_id in merged_targets:
                        if rc.target_level > merged_targets[comp_id]['level']:
                            merged_targets[comp_id]['level'] = rc.target_level
                    else:
                        # Add new requirement
                        merged_targets[comp_id] = {
                            'level': rc.target_level,
                            'name': rc.competency.title,
                            'category': rc.competency.category.name if rc.competency.category else 'General'
                        }

            # =========================================================
            # STEP 3: FETCH ACTUALS (What the employee actually knows)
            # =========================================================
            actuals_map = {
                m.competency.id: m.actual_level 
                for m in EmployeeCompetencyMatrix.objects.filter(employee=emp)
            }

            # =========================================================
            # STEP 4: CALCULATE GAPS
            # =========================================================
            competency_gaps = []
            stats = {'total': 0, 'on_track': 0, 'gaps': 0}

            for comp_id, target_data in merged_targets.items():
                target_lvl = target_data['level']
                
                # IMPORTANT: If employee hasn't taken assessment, actual_lvl is 0
                actual_lvl = actuals_map.get(comp_id, 0) 
                
                gap_val = target_lvl - actual_lvl
                is_gap = gap_val > 0
                
                competency_gaps.append({
                    'id': comp_id,
                    'competency_name': target_data['name'],
                    'category': target_data['category'],
                    'target': target_lvl,
                    'actual': actual_lvl, # Shows 0 if not assessed
                    'gap': gap_val if is_gap else 0,
                    'is_gap': is_gap
                })

                stats['total'] += 1
                if is_gap: 
                    stats['gaps'] += 1
                else: 
                    stats['on_track'] += 1

            # Only add employee to results if they have defined targets
            if competency_gaps:
                results.append({
                    'employee': {
                        'id': emp.id,
                        'name': f"{profile.firstName} {profile.lastName}",
                        'avatar': f"{profile.firstName[0]}{profile.lastName[0]}" if profile.firstName else "U",
                        'designation': profile.designation,
                        'department': profile.department
                    },
                    'stats': stats,
                    'competency_gaps': competency_gaps
                })

        return Response(results)

from .models import EmployeeCompetencyMatrix, Competency, CompetencyLevel, CompetencyCategory
from django.contrib.auth import get_user_model
from .models import CompetencyAssessmentLog, EmployeeCompetencyMatrix, CompetencyLevel

class AssessmentHistoryViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Returns the full history of assessments for the logged-in user"""
        user = request.user
        
        # 1. Fetch from History Log (not the Matrix)
        if user.is_staff or user.has_module_permission('reports', 'manage') or has_team_scope(user, 'courses'):
            queryset = CompetencyAssessmentLog.objects.all()
        else:
            queryset = CompetencyAssessmentLog.objects.filter(employee=user)
        
        # 2. Serialize
        history = []
        for entry in queryset:
            level_obj = CompetencyLevel.objects.filter(level=entry.level).first()
            history.append({
                "id": entry.id,
                "user_id": entry.employee.id,
                "competency_id": entry.competency.id,      # Critical for unique filtering
                "competency_name": entry.competency.title, # Critical for display
                "score": entry.score,
                "total": entry.total_score,
                "achieved_level": {
                    "level": entry.level,
                    "title": level_obj.title if level_obj else f"Level {entry.level}",
                    "color": level_obj.color if level_obj else "text-gray-600",
                },
                "date": entry.assessed_at.isoformat()
            })
        return Response(history)

    def create(self, request):
        """Saves assessment to BOTH Matrix (Current) and Log (History)"""
        data = request.data
        employee_id = data.get('userId')
        results = data.get('results', [])

        if not employee_id:
            return Response({"error": "User ID required"}, status=400)

        saved_count = 0
        
        for item in results:
            comp_id = item.get('competency_id')
            actual_level = item.get('level')
            score = item.get('score', 0)
            total = item.get('total', 100)

            if comp_id and actual_level is not None:
                # 1. Update Current State (Overwrites old data so Matrix is always fresh)
                EmployeeCompetencyMatrix.objects.update_or_create(
                    employee_id=employee_id,
                    competency_id=comp_id,
                    defaults={
                        'actual_level': actual_level,
                        'source': 'Assessment Wizard',
                    }
                )

                # 2. Save History Log (Creates NEW record every time)
                CompetencyAssessmentLog.objects.create(
                    employee_id=employee_id,
                    competency_id=comp_id,
                    level=actual_level,
                    score=score,
                    total_score=total,
                    assessed_by=request.user.email
                )
                saved_count += 1
        
        return Response({"message": f"Saved {saved_count} assessments."}, status=201)

class ConfigViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    @action(detail=False, methods=['get'])
    def levels(self, request):
        return Response(CompetencyLevelSerializer(CompetencyLevel.objects.all(), many=True).data)

class CompetencyViewSet(viewsets.ModelViewSet):
    """CRUD for Skills + Handles creating questions"""
    queryset = Competency.objects.all()
    serializer_class = CompetencySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def create(self, request, *args, **kwargs):
        # 1. Extract Data
        data = request.data
        title = data.get('title')
        description = data.get('description')
        cat_name = data.get('category_name')
        questions_data = data.get('questions', [])

        # 2. Find or Create Category
        category, _ = CompetencyCategory.objects.get_or_create(
            name=cat_name, 
            defaults={'icon': 'layers'} # Default icon
        )

        # 3. Create the Competency
        competency = Competency.objects.create(
            title=title,
            description=description,
            category=category
        )

        # 4. Create Questions linked to this Competency
        for q in questions_data:
            if q.get('question_text'):
                AssessmentQuestion.objects.create(
                    competency=competency,
                    question_text=q.get('question_text'),
                    points=q.get('points', 10),
                    question_type=q.get('question_type', 'multiple_choice')
                )
        
        return Response({"message": "Competency and questions saved successfully", "id": competency.id}, status=status.HTTP_201_CREATED)
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object() # The Competency being edited
        data = request.data
        questions_data = data.get('questions', [])

        # 1. Update Basic Fields
        instance.title = data.get('title', instance.title)
        instance.description = data.get('description', instance.description)
        
        # 2. Update Category if changed
        cat_name = data.get('category_name')
        if cat_name:
            category, _ = CompetencyCategory.objects.get_or_create(name=cat_name)
            instance.category = category
        
        instance.save()

        # 3. Handle Questions (Create, Update, Delete)
        if questions_data is not None:
            # Get IDs of questions sent in the request
            incoming_ids = [q.get('id') for q in questions_data if q.get('id')]
            
            # Delete questions that are NOT in the incoming list (Removed by user)
            instance.questions.exclude(id__in=incoming_ids).delete()

            for q_data in questions_data:
                q_id = q_data.get('id')
                
                if q_id:
                    # Update existing question
                    q_obj = AssessmentQuestion.objects.filter(id=q_id, competency=instance).first()
                    if q_obj:
                        q_obj.question_text = q_data.get('question_text', q_obj.question_text)
                        q_obj.points = q_data.get('points', q_obj.points)
                        q_obj.save()
                else:
                    # Create new question (Added by user)
                    if q_data.get('question_text'):
                        AssessmentQuestion.objects.create(
                            competency=instance,
                            question_text=q_data.get('question_text'),
                            points=q_data.get('points', 10),
                            question_type=q_data.get('question_type', 'multiple_choice')
                        )

        # Return updated data
        serializer = CompetencyDetailSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


from .models import OrganizationNode
from .serializers import OrganizationNodeSerializer

class OrganizationNodeViewSet(viewsets.ModelViewSet):
    """
    API for Managing Organization Hierarchy.
    Supports standard CRUD and a grouped 'structure' view.
    """
    queryset = OrganizationNode.objects.select_related('parent').all().order_by('created_at')
    serializer_class = OrganizationNodeSerializer
    pagination_class = None

    @action(detail=False, methods=['get'])
    def structure(self, request):
        nodes = OrganizationNode.objects.all()
        data = {
            'hq': OrganizationNodeSerializer(nodes.filter(org_type='hq'), many=True).data,
            'bu': OrganizationNodeSerializer(nodes.filter(org_type='bu'), many=True).data,
            'dept': OrganizationNodeSerializer(nodes.filter(org_type='dept'), many=True).data,
            'section': OrganizationNodeSerializer(nodes.filter(org_type='section'), many=True).data,
            'designation': OrganizationNodeSerializer(nodes.filter(org_type='designation'), many=True).data,
        }
        return Response(data)

import openpyxl
import logging
from datetime import date
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from .models import TrainingSchedule
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from django.http import HttpResponse
from django.http import HttpResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment
import datetime # Standard import

logger = logging.getLogger(__name__)

class AnnualMatrixUploadViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['get'], url_path='download-template')
    def download_template(self, request):
        year = int(request.query_params.get('year', 2024))
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Annual Matrix"

        # --- STYLES ---
        bold_font = Font(bold=True)
        center_align = Alignment(horizontal='center', vertical='center', wrap_text=True)
        border_style = Border(
            left=Side(style='thin'), right=Side(style='thin'), 
            top=Side(style='thin'), bottom=Side(style='thin')
        )
        # Colors from screenshot
        color_header = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
        color_plan = PatternFill(start_color="00B0F0", end_color="00B0F0", fill_type="solid") # Cyan/Blue
        color_actual = PatternFill(start_color="00B050", end_color="00B050", fill_type="solid") # Green
        color_bucket = PatternFill(start_color="EEEEEE", end_color="EEEEEE", fill_type="solid") # Light Grey

        # --- HEADERS ---
        # Row 1: Unit Info
        ws['A1'] = "Unit"
        ws['B1'] = "BU - 5" # Placeholder
        ws['C1'] = "Plan"
        ws['C1'].fill = color_plan
        ws['C2'] = "Actual"
        ws['C2'].fill = color_actual

        # Row 2: Main Headers
        ws['A2'] = "Topic Sl."
        ws['B2'] = "Training Topics"
        ws['C2'] = "Status"

        # Apply basic styles to Col A, B, C
        for row in [1, 2, 3]:
            for col in [1, 2, 3]:
                cell = ws.cell(row=row, column=col)
                cell.border = border_style
                cell.font = bold_font
                if row == 2: cell.alignment = center_align

        # Set Column Widths
        ws.column_dimensions['A'].width = 10
        ws.column_dimensions['B'].width = 50
        ws.column_dimensions['C'].width = 10

        # --- MONTHS & WEEKS (Columns D onwards) ---
        months = [
            "April", "May", "June", "July", "August", "September", 
            "October", "November", "December", "January", "February", "March"
        ]
        
        current_col = 4 # Start at Column D
        
        for month in months:
            # Merge 4 cells for Month Name (Row 2)
            start_cell = ws.cell(row=2, column=current_col)
            end_cell = ws.cell(row=2, column=current_col + 3)
            ws.merge_cells(start_row=2, start_column=current_col, end_row=2, end_column=current_col + 3)
            
            start_cell.value = month
            start_cell.font = bold_font
            start_cell.alignment = center_align
            start_cell.border = border_style

            # Weeks (Row 3)
            for w in range(1, 5):
                cell = ws.cell(row=3, column=current_col + w - 1)
                cell.value = f"W{w}"
                cell.alignment = center_align
                cell.border = border_style
                ws.column_dimensions[cell.column_letter].width = 5
            
            current_col += 4

        # --- DATA CONTENT (Based on Screenshot) ---
        # Structure: (Bucket Name, [ (Sl, TopicName) ])
        data_structure = [
            ("Bucket 1 - Organisation Thrust Area", [
                ("1.1", "Integrity Safety Quality (ISQ)"),
                ("1.2", "Tayyari Udaan Ki (TUK)"),
                ("1.3", "We Are JBM"),
                ("5.9", "IT - Applications Software/MS Office"),
                ("5.10", "HR - BSC & PMS")
            ]),
            ("Bucket 2 - Essentials", [
                ("2.1", "Safety: General / Specific / Behavioral"),
                ("2.2", "HIRA / HAZOP"),
                ("2.3", "Disaster Management"),
                ("2.4", "Fire Fighting"),
                ("2.5", "First Aid")
            ]),
            ("Bucket 3 - Behavioural", [
                ("3.1", "Team Work & Conflict Handling"),
                ("3.2", "Innovation & Creativity"),
                ("3.3", "Critical Thinking"),
                ("3.4", "Time Management")
            ]),
            ("Bucket 4 - Process Improvement", [
                ("4.1", "5S"),
                ("4.2", "Integrated Management System (IATF, ISO)"),
                ("4.3", "FMEA"),
                ("4.4", "7 QC Tools"),
                ("4.5", "Enhancing Productivity"),
                ("4.6", "TPM/ME"),
                ("4.7", "Kaizen")
            ]),
            ("Bucket 5 - Functional", [
                ("5.1.1", "Manufacturing Process & Detect"),
                ("5.1.2", "POKA YOKE"),
                ("5.1.4", "Die Manufacturing / SMED"),
                ("5.2.1", "Maintenance: Jishu Hozen"),
                ("5.3.1", "Engineering: SPC/MSA"),
                ("5.3.2", "PPAP"),
                ("5.4.1", "QA: APQP")
            ])
        ]

        current_row = 4

        for bucket_name, topics in data_structure:
            # 1. Bucket Row
            ws.cell(row=current_row, column=1, value=bucket_name).font = bold_font
            ws.cell(row=current_row, column=1).fill = color_bucket
            # Merge across row for visual separation
            ws.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=3)
            current_row += 1

            # 2. Topic Rows
            for sl, topic in topics:
                # PLAN ROW
                ws.cell(row=current_row, column=1, value=sl).border = border_style
                ws.cell(row=current_row, column=2, value=topic).border = border_style
                ws.cell(row=current_row, column=3, value="Plan").border = border_style
                
                # Apply borders to grid
                for c in range(4, 4 + (12*4)):
                    ws.cell(row=current_row, column=c).border = border_style

                current_row += 1

                # ACTUAL ROW
                ws.cell(row=current_row, column=1, value="").border = border_style
                ws.cell(row=current_row, column=2, value="").border = border_style
                ws.cell(row=current_row, column=3, value="Actual").border = border_style
                
                for c in range(4, 4 + (12*4)):
                    ws.cell(row=current_row, column=c).border = border_style

                current_row += 1

        # Response
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename=Annual_Matrix_Template_{year}.xlsx'
        wb.save(response)
        return response

    @action(detail=False, methods=['post'], url_path='upload')
    @transaction.atomic
    def upload_matrix(self, request):
        file_obj = request.FILES.get('file')
        group_id = request.data.get('group_id')
        year_str = request.data.get('year')

        if not file_obj or not group_id or not year_str:
            return Response({'error': 'File, Group ID, and Year are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            year = int(year_str)
            # data_only=True gets the value, not the formula. 
            # Note: If your excel ONLY uses color (no text in cells), this logic needs 'data_only=False' and style checking.
            # Assuming there is text (e.g., "1", "P", "A") inside the colored cells.
            wb = openpyxl.load_workbook(file_obj, data_only=True) 
            ws = wb.active
            
            created_count = 0
            
            # --- 1. DETECT HEADER (MONTHS) ---
            # Based on screenshot, Header is around row 3 or 4.
            header_row_idx = None
            month_col_map = {} # { ColumnIndex : MonthInteger }
            
            # Standard month names to search for
            month_map = {
                'april': 4, 'may': 5, 'june': 6, 'july': 7, 'august': 8, 'september': 9, 
                'october': 10, 'november': 11, 'december': 12, 'january': 1, 'february': 2, 'march': 3
            }

            # Scan first 10 rows
            for r_idx, row in enumerate(ws.iter_rows(min_row=1, max_row=10, values_only=True), 1):
                # Convert row to lower string list to find 'april'
                row_str = [str(c).lower().strip() if c else '' for c in row]
                
                if 'april' in row_str:
                    header_row_idx = r_idx
                    # Map columns
                    current_month = None
                    for c_idx, cell_val in enumerate(row_str, 1):
                        if cell_val in month_map:
                            current_month = month_map[cell_val]
                        
                        # Apply current month to this column and subsequent columns (until next month starts)
                        # In your sheet, April spans 4 cols, May spans 4 cols, etc.
                        if current_month:
                            month_col_map[c_idx] = current_month
                    break
            
            if not header_row_idx:
                return Response({'error': 'Could not find month headers (April...).'}, status=400)

            # --- 2. PARSE ROWS ---
            # Data usually starts 2 rows after the Month Header (skipping the "W1, W2..." row)
            start_row = header_row_idx + 2
            
            current_bucket = "General"
            
            # Convert to list to look ahead
            all_rows = list(ws.iter_rows(min_row=start_row, values_only=True))
            
            # We iterate manually to handle the Plan/Actual pairs
            i = 0
            while i < len(all_rows):
                row = all_rows[i]
                
                # Column mapping based on screenshot:
                # Col 0 (A): Topic Sl.
                # Col 1 (B): Training Topic
                # Col 2 (C): Plan / Actual label
                
                col_sl = str(row[0] or '').strip()
                col_topic = str(row[1] or '').strip()
                col_type = str(row[2] or '').strip()

                # A. DETECT BUCKET (e.g., "Bucket 1 - ...")
                # Bucket headers often have empty Sl. or contain "Bucket"
                if "bucket" in col_sl.lower() or "bucket" in col_topic.lower():
                    # Update the active bucket
                    current_bucket = col_sl if "bucket" in col_sl.lower() else col_topic
                    i += 1
                    continue

                # B. DETECT TOPIC PAIR
                # Valid topic rows have a Topic Name in Col 1 and "Plan" in Col 2
                if col_topic and "plan" in col_type.lower():
                    topic_name = col_topic
                    plan_row = row
                    
                    # Look ahead for Actual row
                    actual_row = None
                    if i + 1 < len(all_rows):
                        next_row = all_rows[i+1]
                        next_col_type = str(next_row[2] or '').strip()
                        if "actual" in next_col_type.lower():
                            actual_row = next_row
                            i += 1 # Skip next row in loop as we process it here
                    
                    # PROCESS THIS TOPIC
                    self._process_topic_rows(
                        group_id, year, topic_name, current_bucket, 
                        plan_row, actual_row, month_col_map
                    )
                    created_count += 1
                
                i += 1

            return Response({'message': f'Processed successfully. Rows scanned.'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Excel Error: {e}")
            return Response({'error': str(e)}, status=400)

    def _process_topic_rows(self, group_id, year, topic, bucket, plan_row, actual_row, month_col_map):
        """
        Helper to iterate through the weekly columns for a specific topic.
        """
        # Iterate over the mapped columns (Months)
        # Note: plan_row is a tuple/list. Index 0 corresponds to Excel Col 1.
        
        for col_idx, month in month_col_map.items():
            # Determine Week Number (1-4)
            # Logic: Find the first column index for this month
            first_col_of_month = min([k for k, v in month_col_map.items() if v == month])
            week_num = (col_idx - first_col_of_month) + 1
            if week_num > 4: week_num = 4

            # Calculate Date
            record_year = year if month >= 4 else year + 1
            day = (week_num - 1) * 7 + 1
            try:
                date_obj = date(record_year, month, day)
            except ValueError:
                continue

            # --- CHECK PLAN ---
            # Excel Col Index is 1-based, Python List is 0-based
            # Data starts usually at Column D (Index 4), so list index 3
            val_idx = col_idx - 1 
            
            # Check Plan Value
            if val_idx < len(plan_row) and plan_row[val_idx]:
                TrainingSchedule.objects.get_or_create(
                    group_id=group_id,
                    topic=topic,
                    date=date_obj,
                    status='Planned',
                    defaults={'trainer_name_text': bucket, 'duration': '1 Hour'}
                )

            # --- CHECK ACTUAL ---
            if actual_row and val_idx < len(actual_row) and actual_row[val_idx]:
                TrainingSchedule.objects.get_or_create(
                    group_id=group_id,
                    topic=topic,
                    date=date_obj,
                    status='Actual',
                    defaults={'trainer_name_text': bucket, 'duration': '1 Hour'}
                )


import urllib.parse
import random
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import cv2
import numpy as np
import os
from gtts import gTTS
from moviepy.editor import VideoFileClip, AudioFileClip, ImageSequenceClip
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer

class AIFeaturesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # =================================================
    # 1. CHAT HISTORY (Sidebar List)
    # =================================================
    @action(detail=False, methods=['get'])
    def history(self, request):
        sessions = ChatSession.objects.filter(user=request.user).order_by('-updated_at')
        serializer = ChatSessionSerializer(sessions, many=True)
        return Response(serializer.data)

        # =================================================
    # 2. GET MESSAGES (For a specific Chat)
    # =================================================
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """
        Retrieves all messages for a specific session ID (pk).
        URL: GET /lms/ai/{id}/messages/
        """
        try:
            # Ensure the session belongs to the current user
            session = ChatSession.objects.get(pk=pk, user=request.user)
            msgs = session.messages.all().order_by('timestamp')
            serializer = ChatMessageSerializer(msgs, many=True)
            return Response(serializer.data)
        except ChatSession.DoesNotExist:
            return Response({"error": "Chat session not found"}, status=404)

    # =================================================
    # 3. CHAT INTERACTION (MERGED LOGIC)
    # =================================================
    @action(detail=False, methods=['post'])
    def chat(self, request):
        user = request.user
        query = request.data.get('query', '').strip()
        session_id = request.data.get('session_id', None)

        if not query:
            return Response({"error": "Query is required"}, status=400)

        try:
            # --- A. Manage Session ---
            if session_id:
                try:
                    session = ChatSession.objects.get(id=session_id, user=user)
                except ChatSession.DoesNotExist:
                    return Response({"error": "Invalid Session ID"}, status=404)
            else:
                title = query[:30].strip() + "..." if len(query) > 30 else query
                session = ChatSession.objects.create(user=user, title=title)

            # --- B. Save USER Message to DB ---
            ChatMessage.objects.create(session=session, sender='user', text=query)

            # --- C. DETERMINE RESPONSE TYPE (Image vs Text) ---
            trigger_words = ["image", "picture", "photo", "draw", "generate", "sketch"]
            is_image_request = any(word in query.lower() for word in trigger_words)
            
            ai_response_text = ""

            if is_image_request:
                # === OPTION 1: GENERATE IMAGE (Pollinations AI) ===
                
                # Clean the prompt
                clean_prompt = query.lower()
                for word in ["give me", "an image of", "a picture of", "show me", "draw", "generate"]:
                    clean_prompt = clean_prompt.replace(word, "")
                clean_prompt = clean_prompt.strip()

                # Encode URL
                encoded_prompt = urllib.parse.quote(clean_prompt)
                seed = random.randint(1, 99999)
                image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={seed}&width=1024&height=768&nologo=true"
                
                # Create Markdown Response
                ai_response_text = f"Here is the image you requested:\n\n![{clean_prompt}]({image_url})"

            else:
                # === OPTION 2: GENERATE TEXT (Your LMS Engine) ===
                
                # Get history context for AI
                recent_msgs = session.messages.order_by('timestamp')
                history_for_ai = [{'sender': m.sender, 'text': m.text} for m in recent_msgs]

                # Call your existing AI Engine
                ai_response_text = get_ai_engine().chatbot_response(user, query, history=history_for_ai)

            # --- D. Save AI Message to DB ---
            # This is crucial! We save the image link OR the text response to the database
            ChatMessage.objects.create(session=session, sender='ai', text=ai_response_text)

            # Update session timestamp
            session.save()

            return Response({
                'response': ai_response_text,
                'session_id': session.id,
                'title': session.title
            })

        except Exception as e:
            print(f"Chat View Error: {e}")
            return Response({"error": str(e)}, status=500)

    # =================================================
    # 4. OTHER ANALYTICS
    # =================================================
    
    @action(detail=False, methods=['post'], url_path='generate_ppt')
    def generate_ppt(self, request):
        """
        Endpoint to generate a PPT based on user prompt.
        """
        # 1. Get the EXACT text the user typed in the frontend
        user_prompt = request.data.get('content') 
        
        if not user_prompt:
            return Response({"error": "Prompt is required"}, status=400)

        print(f"📊 PPT Request: {user_prompt}")

        try:
            # 2. Send the RAW prompt to AI Engine
            ppt_data = get_ai_engine().generate_ppt_content(user_prompt)
            
            if not ppt_data:
                return Response({"error": "AI could not generate structured content. Try a different prompt."}, status=500)

            # 3. Build the File
            file_result = get_ai_engine().create_ppt_file(ppt_data)
            
            if not file_result:
                return Response({"error": "Failed to build PPT file."}, status=500)

            # 4. Save to Database (Media Library)
            GeneratedMedia.objects.create(
                user=request.user,
                title=ppt_data.get('title', 'Presentation'),
                type='ppt',
                file=file_result['relative_path'], 
                prompt=user_prompt, # Store exactly what the user asked for
                model_used="Gemini 1.5 Flash"
            )

            # 5. Return the file as a download stream
            ppt_file = open(file_result['full_path'], 'rb')
            response = FileResponse(ppt_file)
            response['Content-Disposition'] = f'attachment; filename="{file_result["filename"]}"'
            return response

        except Exception as e:
            print(f"❌ View Error: {e}")
            return Response({"error": str(e)}, status=500)
        
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        try:
            data = get_ai_engine().get_recommendations(request.user)
            return Response(data)
        except:
            return Response([])

    @action(detail=False, methods=['get'])
    def risk_analysis(self, request):
        try:
            data = get_ai_engine().analyze_risk(request.user)
            return Response(data)
        except:
            return Response({"risk_score": 0})
        
    @action(detail=False, methods=['get'], url_path='my_media')
    def my_media(self, request):
        """
        Returns all videos and PPTs generated by the logged-in user.
        """
        queryset = GeneratedMedia.objects.filter(user=request.user).order_by('-created_at')
        serializer = GeneratedMediaSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    # =================================================
    # 7. DELETE MEDIA
    # =================================================
    @action(detail=True, methods=['delete'], url_path='delete_media')
    def delete_media(self, request, pk=None):
        """
        Delete a generated media item.
        """
        try:
            media = GeneratedMedia.objects.get(pk=pk, user=request.user)
            media.delete()
            return Response({"message": "Media deleted successfully"}, status=200)
        except GeneratedMedia.DoesNotExist:
            return Response({"error": "Media not found"}, status=404)
    
    # In app2/views.py

    @action(detail=False, methods=['post'], url_path='generate_video')
    def generate_video(self, request):
        prompt = request.data.get('prompt')
        
        if not prompt:
            return Response({"error": "Prompt is required"}, status=400)

        # This now calls the GRADIO version
        result = get_ai_engine().generate_veo_video(prompt)

        if "error" in result:
            return Response(result, status=503)

        # Save to DB
        media = GeneratedMedia.objects.create(
            user=request.user,
            title=f"Video: {prompt[:30]}...",
            url=result.get("video_url"),
            type='video',
            prompt=prompt,
            model_used="ModelScope (Gradio)",
            duration="4s"
        )

        return Response({
            "id": media.id,
            "url": result.get("video_url"),
            "message": "Video generated successfully"
        }, status=200)
