from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from app1 import views
from rest_framework_simplejwt.views import TokenRefreshView
from app2 import views
# Only import the views that actually exist now
from .views import (
    AIFeaturesViewSet,
    AnnualMatrixUploadViewSet,
    CourseReportStatsView,
    CourseViewSet,
    CourseWorkflowView,
    GroupMessageViewSet,
    LessonAttachmentViewSet,
    OrganizationNodeViewSet,
    UserViewSet, 
    AnswerSubmissionViewSet, 
    UnifiedProgressViewSet, 
    GroupViewSet, 
    AdminUserListViewSet,
    TeamLeaderViewSet, 
    CourseAssignmentViewSet, 
    UserDashboardViewSet,
    NotificationViewSet, 
    EmployeeReportViewSet,
    AssessmentHistoryViewSet,
    mark_lesson_complete,
    get_certificate_data,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'answers', AnswerSubmissionViewSet, basename='answers')
router.register(r'submissions', AnswerSubmissionViewSet, basename='submission')
router.register(r'progress', UnifiedProgressViewSet, basename='progress')
router.register(r'groups', GroupViewSet, basename='groups')
router.register(r'assignments', CourseAssignmentViewSet, basename='assignments')
router.register(r'admins/users', AdminUserListViewSet, basename='admin-users')
router.register(r'teamlead', TeamLeaderViewSet, basename='teamlead')
router.register(r'dashboard', UserDashboardViewSet, basename='user-dashboard')
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'employees', EmployeeReportViewSet, basename='employee-reports')
router.register(r'lesson-attachments', LessonAttachmentViewSet, basename='lesson-attachments')
router.register(r'schedules', views.TrainingScheduleViewSet, basename='schedules')
router.register(r'group-chat-history', GroupMessageViewSet, basename='group-chat-history')
router.register(r'hierarchy', views.HierarchyViewSet, basename='hierarchy')
router.register(r'library', views.CompetencyLibraryViewSet, basename='library')
router.register(r'rules', views.CompetencyRuleViewSet, basename='rules')
router.register(r'matrix', views.CompetencyMatrixViewSet, basename='matrix')
router.register(r'gap-analysis', views.GapAnalysisViewSet, basename='gap-analysis')
router.register(r'skills', views.CompetencyViewSet, basename='skills')
router.register(r'config', views.ConfigViewSet, basename='config')
router.register(r'competency', views.AssessmentHistoryViewSet, basename='competency')
router.register(r'organization', OrganizationNodeViewSet, basename='organization')
router.register(r'assessment-history', AssessmentHistoryViewSet, basename='assessment-history')
router.register(r'annual-matrix', AnnualMatrixUploadViewSet, basename='annual-matrix')
router.register(r'ai', AIFeaturesViewSet, basename='ai')


# ... other routes






urlpatterns = [
    # Router Paths
    path('', include(router.urls)),

    # Specific Feature Paths
    path('courses/<int:pk>/workflow/', CourseWorkflowView.as_view(), name='course-workflow'),
    path('courses/<int:course_id>/request-access/', views.request_course_access, name='request-course-access'),
     # 2. ADD THIS: The Video Generation URL
    path('ai/generate_video/', AIFeaturesViewSet.as_view({'post': 'generate_video'}), name='ai-video'),
    
    # 3. ADD THIS: The PPT Generation URL (for later)
    # urls.py
    path('enrollment-requests/<int:pk>/', views.get_enrollment_request_details),
    path('enrollment-requests/<int:pk>/<str:action>/', views.action_enrollment_request),
    
    # Test detail (for MCQ exam page)
    path('courses/<int:pk>/tests/<int:test_id>/',
        CourseViewSet.as_view({'get': 'test_detail'}),
        name='course-test-detail'
    ),
    path(
        'mark-lesson-complete/', 
        mark_lesson_complete, 
        name='mark-lesson-complete'
    ),
    path('growth/compare/<int:course_id>/', views.GrowthComparisonView.as_view(), name='growth-comparison'),
    path('admin/growth-reports/', views.AdminGrowthReportListView.as_view(), name='growth_reports_list'),
    path('my-growth-reports/', views.MyGrowthReportListView.as_view(), name='my_growth_reports'),
    path('courses/<int:course_id>/certificate/', get_certificate_data, name='get-certificate-data'),

    path('api/reports/course-stats/', CourseReportStatsView.as_view(), name='course-stats'),

    

    
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)