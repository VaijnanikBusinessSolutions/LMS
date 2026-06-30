from django.urls import include, path,include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from .views import ARVRTrainingContentViewSet, AbsenteeismChartView, AbsentUsersListView, AbsenteeismTrendView, ActionItemDetailView, ActionItemListCreateView, ActionItemRejectionDetailView, ActionItemRejectionListCreateView, ActiveTrainingBatchListView, AdvanceCardStatsView, AdvancedManpowerTrendChartView, AnswerSheetView, AttendanceLogView, AttritionChartView, BatchAttendanceDetailView, AdvanceManpowerDashboardViewSet, BifurcationStatsView, BatchRescheduledSessionsView, BioUserViewSet, BiometricAttendanceViewSet, BodyCheckDetailView, BodyCheckSubmissionView, BufferManpowerChartView, BulkAttendanceUpdateView, CompanyLogoViewSet, CompleteTrainingBatchView, CurrentMonthDefectsDataView, CurrentMonthTrainingDataView, CurrentUserView,  CurriculumContentViewSet, CurriculumViewSet, DailyProductionDataViewSet, DaysViewSet, DefectsChartView, DepartmentStationViewSet, DepartmentSubLineViewSet, EmployeeAttendanceViewSet, EmployeeCardDetailsView, EmployeeExcelViewSet, EmployeeHandoverView, EmployeeMonthlyDetailView, EmployeeReportPDFView, EmployeeSkillSearch, EvaluationCriterionViewSet, EvaluationLevel2ViewSet, EvaluationViewSet, ExcelUploadView, FeatureFlagViewSet, HanContentViewSet, HanSubtopicViewSet, HanTrainingContentViewSet, HanchouExamQuestionViewSet, HanchouExamResultViewSet, HanchouResultCertificatePDF, HandoverSheetViewSet, HierarchyAllDepartmentsView, HierarchyByDepartmentView, HierarchyStructureViewSet,  HqViewSet, FactoryViewSet, DepartmentViewSet, HumanBodyQuestionsViewSet, InternalRejectionChartView, KeyEventCreateView, LatestKeyEventView, Level2QuantityOJTEvaluationViewSet, LevelColourViewSet, LevelDayRequirementViewSet, LevelOnePassedUsersView, LevelViewSet, LevelWiseTrainingContentViewSet, LineViewSet, MachineAllocationApprovalViewSet, MachineAllocationViewSet, MachineViewSet, ManagementDownloadTemplateView, ManagementReviewBulkCreateAPIView, ManagementReviewCTQandPDIListCreateAPIView, ManagementReviewViewSet, ManagementUploadExcelView, MarkRescheduledAttendanceView, MasterTableViewSet, MonthlySummaryView, MultiSkillingViewSet, NotificationViewSet, OJTDayListView, OJTDayViewSet, OJTLevel2QuantityViewSet, OJTPassingCriteriaViewSet, OJTScoreRangeViewSet, OJTScoreViewSet, OJTTopicListView, OJTTopicViewSet, OperatorAnalyticsView, PastTrainingBatchListView, OperatorsChartView,  ProductionPlanViewSet, QuantityOJTScoreRangeViewSet, QuantityPassingCriteriaViewSet, QuestionPaperViewSet, QuestionViewSet, RescheduleFromAbsentView, RescheduleLogViewSet, RescheduledSessionCreateView, RescheduledSessionDetailView, RescheduledSessionListView, ResultsMatrixExcelView, RetrainingConfigViewSet, RetrainingSessionViewSet, RoleViewSet, ScheduleViewSet, SetAttendanceTaskTimeView, ShoContentViewSet, ShoSubtopicViewSet, ShoTrainingContentViewSet, ShokuchouExamQuestionViewSet, ShokuchouExamResultViewSet, ShokuchouResultCertificatePDF, SkillMatrixDisplaySettingViewSet, SkillMatrixExcelHandlerView, SkillMatrixExcelView, SkillMatrixViewSet, SpecificHierarchyExcelHandlerView, StationLevelQuestionPaperViewSet, StationManagerViewSet, StationSettingCreateView, StationTypeViewSet, SubLineViewSet, StationViewSet, SubTopicContentViewSet, SubTopicViewSet, SubTopicsByDayView, SubmitWebTestAPIView, SupervisorAllocationReportView, SystemSettingsView, TemplateQuestionViewSet, TenCycleStatusViewSet, Tier1DefectsChartView,  TraineeInfoListView, TraineeInfoViewSet, Trainer_nameViewSet, Training_categoryViewSet, TrainingContentViewSet, TrainingPlansChartView, TrainingTopicViewSet, UserBodyCheckListView, UserDropdownListView, UserRegistrationViewSet, UserViewSet, ValidatePathView, VenueViewSet, bifurcation_stats_view, create_system_notification, create_test_notification, delete_all_notifications, get_enabled_training_methods, get_unread_notifications, mark_notifications_read, notification_count, serve_han_material_file, serve_sho_material_file,EvaluationPassingCriteriaViewSet, test_notifications, total_manpower_stats_view, trigger_all_notification_types, trigger_employee_notification,MultiSkillingConfigViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

from .views import StationSheetConfigViewSet



router = DefaultRouter()
router.register(r'hq', HqViewSet, basename='hq')
router.register(r'factories', FactoryViewSet, basename='factory')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'lines', LineViewSet, basename='line')
router.register(r'sublines', SubLineViewSet, basename='subline')
router.register(r'stations', StationViewSet, basename='station')
router.register(r'hierarchy-structures', HierarchyStructureViewSet, basename='hierarchy-structure')
router.register(r'station-types', StationTypeViewSet) 

#10 cycle

router.register(r'tencycle-days', TenCycleDayConfigurationViewSet, basename='tencycle-day')
router.register(r'tencycle-topics', TenCycleTopicsViewSet, basename='tencycle-topic')
router.register(r'tencycle-subtopics', TenCycleSubTopicViewSet, basename='tencycle-subtopic')
router.register(r'tencycle-passingcriteria', TenCyclePassingCriteriaViewSet, basename='tencycle-passingcriteria')
router.register(r'operator-evaluations', OperatorPerformanceEvaluationViewSet, basename='operator-evaluation')
router.register(r'evaluation-marks', EvaluationSubTopicMarksViewSet, basename='evaluation-mark')
router.register(r'tencycle-configuration', TenCycleConfigurationViewSet, basename='tencycle-configuration')
router.register(r'tencycle-status', TenCycleStatusViewSet, basename='tencycle')

router.register(r'levels', LevelViewSet)
router.register(r'days', DaysViewSet)
router.register(r'subtopics', SubTopicViewSet)
router.register(r'subtopic-contents', SubTopicContentViewSet)
router.register(r'training-contents', TrainingContentViewSet)
router.register(r'evaluations', EvaluationViewSet)
router.register(r'mastertable', MasterTableViewSet, basename='mastertable')
router.register(r'humanbody-questions', HumanBodyQuestionsViewSet, basename='humanbody-questions')
router.register(r'production-plans', ProductionPlanViewSet, basename='production-plan')

router.register(r'machines', MachineViewSet, basename='machines')
router.register(r'allocations', MachineAllocationViewSet, basename='allocations')

router.register(r'machine-allocation-approval', MachineAllocationApprovalViewSet, basename='machineallocationapproval')


router.register(r'questionpapers', QuestionPaperViewSet, basename='questionpaper')
router.register(r'station-level-questionpapers', StationLevelQuestionPaperViewSet, basename='stationlevelquestionpaper')
router.register(r'arvr-content', ARVRTrainingContentViewSet, basename='arvr-content')




router.register(r'template-questions', TemplateQuestionViewSet, basename='templatequestion')


# hanshou & shokuchou 

router.register(r'hanchou-questions', HanchouExamQuestionViewSet, basename='hanchou-questions')
router.register(r"hanchou/results", HanchouExamResultViewSet, basename="hanchou-results")

router.register(r"shokuchou-questions", ShokuchouExamQuestionViewSet, basename="shokuchou-questions")
router.register(r"shokuchou/results", ShokuchouExamResultViewSet, basename="shokuchou-results")


router.register(r'han-content', HanContentViewSet, basename='han-content')
router.register(r'han-subtopics', HanSubtopicViewSet,  basename='han-subtopic') 
router.register(r'han-materials', HanTrainingContentViewSet, basename='han-material')

router.register(r'sho-content', ShoContentViewSet, basename='sho-content')
router.register(r'sho-subtopics', ShoSubtopicViewSet, basename='sho-subtopic')
router.register(r'sho-materials', ShoTrainingContentViewSet, basename='sho-material')




router.register(r'ojt-topics', OJTTopicViewSet, basename='ojt-topic')
router.register(r'ojt-days', OJTDayViewSet, basename='ojt-day')
router.register(r'ojt-score-ranges', OJTScoreRangeViewSet, basename='ojt-scorerange')
router.register(r'ojt-scores', OJTScoreViewSet)
router.register(r'ojt-passing-criteria', OJTPassingCriteriaViewSet)
router.register(r'trainees', TraineeInfoViewSet, basename='trainees')
router.register(r"ojt-quantity", OJTLevel2QuantityViewSet)


# Refreshment Training
router.register(r'training-categories', Training_categoryViewSet)
router.register(r'curriculums', CurriculumViewSet, basename='curriculum')
router.register(r'curriculum-contents', CurriculumContentViewSet, basename='curriculumcontent')
router.register(r'trainer_name', Trainer_nameViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'attendances', EmployeeAttendanceViewSet, basename='attendance')
router.register(r'reschedule-logs', RescheduleLogViewSet, basename='reschedulelog')
# router.register(r'recurrence-intervals', RecurrenceIntervalViewSet, basename='recurrence-interval')  # NEW
router.register(r"day-requirements", LevelDayRequirementViewSet, basename="day-requirement")
router.register(r"score-ranges", QuantityOJTScoreRangeViewSet, basename="quantity-score-range")
router.register(r"passing-criteria", QuantityPassingCriteriaViewSet, basename="quantity-passing-criteria")
router.register(r"ojt-evaluations", Level2QuantityOJTEvaluationViewSet)


router.register(r'logos', CompanyLogoViewSet)
router.register(r'evaluation-passing-criteria', EvaluationPassingCriteriaViewSet, basename='evaluation-passing-criteria')



router.register(r'retraining-sessions', RetrainingSessionViewSet, basename='retraining-session')
router.register(r'retraining-configs', RetrainingConfigViewSet, basename='retraining-config')
router.register(r'notifications', NotificationViewSet, basename='notifications')

#  Method Enable disable 

router.register(r"station-sheet-configs", StationSheetConfigViewSet, basename="station-sheet-config")

router.register(r'levelcolours', LevelColourViewSet, basename="levelcolours")
router.register(r'displaysetting', SkillMatrixDisplaySettingViewSet, basename='displaysetting')

router.register(r'department-sublines', DepartmentSubLineViewSet, basename='department-sublines')
router.register(r'department-stations', DepartmentStationViewSet, basename='department-stations')


router.register(r"users", UserViewSet, basename="user")
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'permission-modules', PermissionModuleViewSet, basename='permission-module')

router.register(r'handovers', HandoverSheetViewSet, basename='handover')

router.register(r'production-data', DailyProductionDataViewSet, basename='productiondata')

router.register( r"training_topics", TrainingTopicViewSet, basename="training_topic")
router.register(r"levelwise-training-contents", LevelWiseTrainingContentViewSet, basename="levelwisetrainingcontent")

router.register(r"skill-matrix", SkillMatrixViewSet, basename="skill-matrix")



router.register(r'advance-dashboard', AdvanceManpowerDashboardViewSet, basename='advance-dashboard')
router.register(r'management-reviews', ManagementReviewViewSet, basename='managementreview')


# router.register(r'ctq-pdi-reports', ManagementReviewCTQandPDIViewSet, basename='ctq-pdi-reports')


router.register(r'employees-excel', EmployeeExcelViewSet, basename='employee-excel')


router.register(r"multiskilling", MultiSkillingViewSet, basename="multiskilling")
router.register(r"multiskilling-config", MultiSkillingConfigViewSet, basename="multiskilling-config")
router.register(r"global-skill-time-interval", views.GlobalSkillTimeIntervalViewSet, basename="global-skill-time-interval")
router.register(r"feature-flags", FeatureFlagViewSet, basename="feature-flags")

router.register(r'questions', QuestionViewSet)


router.register(r'station-managers', StationManagerViewSet, basename='station-manager')

router.register(r'station-settingsbyoption', views.StationSettingViewSet, basename='station-settingsbyoption')


#Biometric realtime
router.register(r'biouser', BioUserViewSet, basename='biouser')
# skill evalution
router.register(r'skillevaluations', EvaluationLevel2ViewSet, basename='evaluation-level2')
router.register(r'criteria', EvaluationCriterionViewSet, basename='criterion')

#Biometric Attendance
router.register(r'biometric-attendance', BiometricAttendanceViewSet, basename='biometric-attendance')
router.register(r'ojt-dashboard', views.OJTStatusDashboardViewSet, basename='ojt-dashboard')

urlpatterns = [

    path('register/', views.RegisterView.as_view(), name="register"),
    path('bulk-employees/', BulkEmployeeView.as_view(), name="bulk-employees"),
    path('api/login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name="logout"),

    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/', include(router.urls)),
    path('temp-user-info/', UserRegistrationViewSet.as_view({'get': 'list', 'post': 'create'}), name='temp-user-info'),
    path('users/<str:temp_id>/', UserRegistrationViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'put': 'update', 'delete': 'destroy'}), name='user-update'),
    # Body check endpoints
    path('human-body-checks/', BodyCheckSubmissionView.as_view(), name='human-body-checks'),
    path('user-body-checks/', UserBodyCheckListView.as_view(), name='user-body-checks'),
    path('human-body-checks/<str:temp_id>/', BodyCheckDetailView.as_view(), name='human-body-checks-detail'),


    path('han-materials/<int:pk>/serve/', serve_han_material_file, name='serve-han-material-file'),

    # URL for Shokuchou files
    path('sho-materials/<int:pk>/serve/', serve_sho_material_file, name='serve-sho-material-file'),

    path('hanchou-results/<int:pk>/download-certificate/', HanchouResultCertificatePDF.as_view(), name='download-hanchou-certificate'),
    path('shokuchou-results/<int:pk>/download-certificate/', ShokuchouResultCertificatePDF.as_view(), name='download-shokuchou-certificate'),

    path('ojt-days-list/', OJTDayListView.as_view(), name="ojt-days-list"),
    path('ojt-topics-list/', OJTTopicListView.as_view(), name="ojt-topics-list"),
    path("trainee-info-list/", TraineeInfoListView.as_view(), name="trainee-info-list"),

    path('station-settings/', StationSettingCreateView.as_view(), name='station-setting-create'),



    path('start-test/', views.StartTestSessionView.as_view(), name='start_test_session'),
    path('api/end-test/', views.EndTestSessionView.as_view(), name='end_test_session'),
    path('api/scores/', views.ScoreListView.as_view(), name='score_list'),
    path('api/test-session/map/', views.KeyIdToEmployeeNameMap.as_view(), name='keyid-name-map'),
    path('api/past-sessions/', views.PastTestSessionsView.as_view()),
    path('api/scores-by-session/<str:name>/', views.ScoresByTestView.as_view()),
    path('api/score-summary/', views.ResultSummaryAPIView.as_view(), name='score-summary'),
    path('api/skills/', views.SkillListView.as_view(), name='skill-list'),
    path('api/scores-by-session/<path:name>/', views.ScoresByTestView.as_view()),
    path('submit-web-test/', SubmitWebTestAPIView.as_view(), name='submit-web-test'),
    path('api/key-events/create/', KeyEventCreateView.as_view()),
    path('api/key-events/latest/', LatestKeyEventView.as_view()),
    path('api/connect-events/create/', views.connect_event_create, name='connect_event_create'),
    path('api/vote-events/create/', views.vote_event_create, name='vote_event_create'),
    path('api/assessment-mode/', views.get_assessment_mode, name='get_assessment_mode'),
    path('api/assessment-mode/toggle/', views.toggle_assessment_mode, name='toggle_assessment_mode'),
    path('department/<int:department_id>/lines/', views.get_lines_by_department, name='lines-by-department'),
    path('line/<int:line_id>/sublines/', views.get_sublines_by_line, name='sublines-by-line'),
    path('subline/<int:subline_id>/stations/', views.get_stations_by_subline, name='stations-by-subline'),
    path('department/<int:department_id>/stations/', views.get_stations_by_department, name='stations-by-department'),
    path('line/<int:line_id>/stations/', views.get_stations_by_line, name='stations-by-line'),
    path('fetch-departments/', views.get_all_departments, name='fetch-departments'),


    path('api/results/levels/', ResultsLevelsAPIView.as_view(), name='results-levels'),
    path('api/results/departments/', ResultsDepartmentsAPIView.as_view(), name='results-departments'),
    path('api/results/stations/', ResultsStationsAPIView.as_view(), name='results-stations'),
    path('api/results/batches/', ResultsBatchesAPIView.as_view(), name='results-batches'),
    path('api/results/individual-scores/', ResultsIndividualScoresAPIView.as_view(), name='results-individual-scores'),

    
    path('api/notifications/count/', notification_count, name='notification-count'),
    path('api/notifications/system/', create_system_notification, name='create-system-notification'),
    path('api/notifications/test/', create_test_notification, name='create-test-notification'),
    path('api/notifications/debug/', test_notifications, name='test-notifications'),
    path('api/notifications/trigger-employee/', trigger_employee_notification, name='trigger-employee-notification'),
    path('api/notifications/trigger-all-types/', trigger_all_notification_types, name='trigger-all-notification-types'),
    path('api/notifications/delete-all/', delete_all_notifications, name='delete-all-notifications'),





    path('scores/passed/level-1/', LevelOnePassedUsersView.as_view(), name='passed-level-one-scores'),
    path("handovers/employee/<str:emp_id>/", EmployeeHandoverView.as_view()),
    path('fetch-departments/', views.get_all_departments, name='fetch-departments'),
    path("hierarchy/by-department/", HierarchyByDepartmentView.as_view(), name="hierarchy-by-department"),
    path('hierarchy-simple/', views.get_hierarchy_structures, name='get_hierarchy_structures'),



    path('production-plans/planning-data/', views.get_planning_data, name='planning-data'),
    path('trends/operators-required/', views.get_operators_required_trend, name='operators-required-trend'),
    path('production-data/gap-analysis/', views.monthly_availability_analysis, name='monthly_availability_analysis'),
    path('production-data/date-range-summary/', views.weekly_availability_summary, name='weekly_availability_summary'),


    path("hierarchy/all-departments/", HierarchyAllDepartmentsView.as_view(), name="hierarchy-all-departments"),
    


    path('api/usermanualdocs/', views.UserManualdocsListCreateView.as_view(), name='usermanualdocs-list-create'),
    path('api/usermanualdocs/<int:pk>/', views.UserManualdocsDetailView.as_view(), name='usermanualdocs-detail'),
    path('api/usermanualdocs/<int:doc_id>/view/', views.view_file, name='view-file'),
    path('api/usermanualdocs/<int:doc_id>/download/', views.download_file, name='download-file'),


    ## =================== TrainingAttendance ============================= #
    path('training-batches/active/', ActiveTrainingBatchListView.as_view(), name='active-training-batches'),
    path('training-batches/past/', PastTrainingBatchListView.as_view(), name='past-training-batches'),
    path('attendance-detail/<str:batch_id>/', BatchAttendanceDetailView.as_view(), name='batch-attendance-detail'),
    path('attendances/', BulkAttendanceUpdateView.as_view(), name='bulk-attendance-update'),
    path('batches/<str:batch_id>/complete/', CompleteTrainingBatchView.as_view(), name='complete-training-batch'), 
    path('batch/<str:batch_id>/absentees/', AbsentUsersListView.as_view(), name='absent-users-list'),




     # Subtopics
    path('subtopics/by-day/<int:day_id>/', SubTopicsByDayView.as_view(), name='subtopics-by-day'),
    
    # Rescheduled Sessions
    path('rescheduled-sessions/', RescheduledSessionListView.as_view(), name='rescheduled-sessions-list'),
    path('rescheduled-sessions/create/', RescheduledSessionCreateView.as_view(), name='rescheduled-session-create'),
    path('rescheduled-sessions/<int:pk>/', RescheduledSessionDetailView.as_view(), name='rescheduled-session-detail'),
    path('rescheduled-sessions/mark-attendance/', MarkRescheduledAttendanceView.as_view(), name='mark-rescheduled-attendance'),
    path('batch/<str:batch_id>/rescheduled-sessions/', BatchRescheduledSessionsView.as_view(), name='batch-rescheduled-sessions'),
    path('reschedule-from-absent/', RescheduleFromAbsentView.as_view(), name='reschedule-from-absent'),
    # =================== TrainingAttendance End ============================= #



    #================================management review================================
    path('current-month/training-data/', CurrentMonthTrainingDataView.as_view(), name='current-month-training-data'),
    path('current-month/defects-data/', CurrentMonthDefectsDataView.as_view(), name='current-month-defects-data'),
    path('chart/internal-rejection/', InternalRejectionChartView.as_view(), name='internal-rejection-chart'),
    path('chart/operators/', OperatorsChartView.as_view(), name='operators-chart'),
    path('chart/training-plans/', TrainingPlansChartView.as_view(), name='training-plans-chart'),
    path('chart/defects-msil/', DefectsChartView.as_view(), name='defects-msil-chart'),
    path('chart/tier1-defects/', Tier1DefectsChartView.as_view(), name='tier1-defects-chart'),
    path('management/download-template/', ManagementDownloadTemplateView.as_view(), name='management-download-template'),
    path('management/upload-excel/', ManagementUploadExcelView.as_view(), name='management-upload-excel'),
    


    #=========================================== Advance Manpower ==================================

    path('chart/advanced-manpower-trend/', AdvancedManpowerTrendChartView.as_view(), name='advanced-manpower-trend'),
    path('chart/attrition-trend/', AttritionChartView.as_view(), name='attrition-trend'),
    path('chart/buffer-manpower-trend/', BufferManpowerChartView.as_view(), name='buffer-manpower-trend'),
    path('chart/absenteeism-trend/', AbsenteeismChartView.as_view(), name='absenteeism-trend'),
    path('chart/bifurcation-stats/', BifurcationStatsView.as_view(), name='bifurcation-stats'),
    path('chart/advance-card-stats/', AdvanceCardStatsView.as_view(), name='advance-card-stats'),    



    path('employee-card-details/', EmployeeCardDetailsView.as_view(), name='employee-card-details'),

    path("employee-skill-search/", EmployeeSkillSearch.as_view(), name="employee-skill-search"), 

    path('employee-report/', EmployeeReportPDFView.as_view(), name='employee-report'),


    path('station-requirements/', views.get_station_requirements, name='station-requirements'),

    path('api/reviews/', ManagementReviewCTQandPDIListCreateAPIView.as_view(), name='review-api-list-create'),

    path('api/reviews/bulk-upload/', ManagementReviewBulkCreateAPIView.as_view(), name='review-api-bulk-create'),
    

    path(
        'mastertable-handover-details/<str:emp_id>/', 
        views.get_mastertable_details_for_handover, 
        name='mastertable-handover-details'
    ),

    # Add a new path for this view.
    path('mastertable-ui-list/', views.get_mastertable_list_for_ui, name='mastertable-ui-list'),

    path('handover-page-data/', views.get_passed_scores_with_details, name='handover-page-data'),

    #Biometric realtime
    path('api/attendance-logs/', AttendanceLogView.as_view(), name='attendance-logs'),

    #Biometric Attendance
    path('bioattendance/upload-excel/', ExcelUploadView.as_view(), name='excel-upload'), 
    path('set-task-time/attendance/', SetAttendanceTaskTimeView.as_view()),##################################
    path('biometric-attendance/summary/', MonthlySummaryView.as_view(), name='monthly-summary'),
    path('biometric-attendance/employee-detail/', EmployeeMonthlyDetailView.as_view()),
    path('system-settings/', SystemSettingsView.as_view(), name='system-settings'),
    path('validate-path/', ValidatePathView.as_view(), name='validate-path'),


    # path('api/answersheet/<str:session_name>/<str:employee_id>/', AnswerSheetView.as_view(), name='answer-sheet-detail'),
    path('api/answersheet/<int:score_id>/', views.AnswerSheetView.as_view(), name='answer-sheet-detail'),
    
    path('api/results/matrix/<int:level_id>/<int:station_id>/', views.LevelStationMatrixView.as_view(), name='results-matrix'),

    path('api/results/matrix/excel/<int:level_id>/<int:station_id>/', ResultsMatrixExcelView.as_view(), name='results-matrix-excel'),

# analytics
    path('average-monthly-production/', views.average_monthly_production, name='average_monthly_production'),
    path('production-efficiency/', views.production_efficiency, name='production_efficiency'),
    path('monthly-trend/', views.monthly_trend, name='monthly_trend'),
    path('total-operators/', views.total_operators, name='total_operators'),

    path('average-growth-forecast/', views.average_growth_forecast, name='average_growth_forecast'),
    
    path('production-category-breakdown/', views.production_category_breakdown, name='production_category_breakdown'),

    path('line-performance-comparison/', views.line_performance_comparison, name='line_performance_comparison'),
    # refreshertraining===start===
    path('download-employee-template/', views.download_employee_template, name='download-employee-template'),
    path('upload-employees-csv/', views.upload_employees_csv, name='upload-employees-csv'),
    # Add these to your urlpatterns
    path('schedules/recurring_schedules_info/', views.recurring_schedules_info, name='recurring-schedules-info'),
    path('schedules/test_recurring_creation/', views.test_recurring_schedule_creation, name='test-recurring-creation'),
    path('celery/status/', views.celery_status, name='celery-status'),
   
    path('schedules/scheduler_status/', views.scheduler_status, name='scheduler-status'),
    

    path('employees-by-filters/', views.get_employees_by_filters, name='employees-by-filters'),

    path('levels/<int:level_pk>/criteria/', EvaluationCriterionViewSet.as_view({'get': 'list'}), name='level-criteria'),
    path('filter-options/', views.get_filter_options, name='filter-options'),

    # ====================  hanover =====================

    path('users-list/', UserDropdownListView.as_view(), name='users-list'),
    path('reports/supervisor-allocations/', SupervisorAllocationReportView.as_view(), name='supervisor-report'),

    # ============== notification for handover =============
    path('notifications/unread/', get_unread_notifications),
    path('notifications/mark-read/', mark_notifications_read),

    path('users/me/', CurrentUserView.as_view(), name='current-user'),

#    ============================ end ===========================




    # Attendance endpoints
    path('attendances/all_reschedules/', 
         EmployeeAttendanceViewSet.as_view({'get': 'all_reschedules'}), 
         name='all-reschedules'),
    
    # Get only pending reschedules (DEPRECATED - use all_reschedules)
    path('attendances/pending_reschedule/', 
         EmployeeAttendanceViewSet.as_view({'get': 'pending_reschedule'}), 
         name='pending-reschedule'),
    
    # Get attendance by schedule
    path('attendances/by_schedule/', 
         EmployeeAttendanceViewSet.as_view({'get': 'by_schedule'}), 
         name='by-schedule'),
    
    # Update reschedule details
    path('attendances/<int:pk>/update_reschedule/', 
         EmployeeAttendanceViewSet.as_view({'patch': 'update_reschedule'}), 
         name='update-reschedule'),
         
    path('attendances/<int:pk>/mark_as_present/', 
         EmployeeAttendanceViewSet.as_view({'post': 'mark_as_present'}), 
         name='mark-as-present'),
    
    # Reschedule history endpoint
    path('attendances/reschedule_history/', 
         EmployeeAttendanceViewSet.as_view({'get': 'reschedule_history'}), 
         name='reschedule-history'),
    # Add this to your urlpatterns
    path('schedules/<int:pk>/update_next_training_date/', 
     ScheduleViewSet.as_view({'patch': 'update_next_training_date'}), 
     name='update-next-training-date'),
     # urls.py
     path('station-sheet-configs/enabled-methods/', get_enabled_training_methods),
        # ====end============ 


     #================Refresher Exam Training Start=================


    # Question Bank & Questions
    # 1. Question Bank & Questions (Prefix: refresher/)
     path('refresher/categories/<int:category_id>/question-bank/', views.RefresherQuestionBankDetail.as_view()),    
     path('refresher/questions/', views.RefresherQuestionListCreate.as_view()),
    path('refresher/questions/<int:pk>/', views.RefresherQuestionDetail.as_view()),
    path('refresher/questions/bulk-upload/', views.RefresherQuestionBulkUpload.as_view()),
    path('refresher/questions/template/', views.RefresherQuestionTemplateDownload.as_view()),

    # 2. Test Execution (Prefix: refresher/)
    path('refresher/test/start/', views.RefresherTestStart.as_view()),
    path('refresher/test/submit/', views.RefresherTestSubmit.as_view()),
    path('refresher/test/remote-event/', views.RefresherRemoteEvent.as_view()),

    # Reports
    path('refresher/reports/effectiveness/', views.TrainingEffectivenessReport.as_view()),
    path('refresher/questions/bulk-action/', views.RefresherQuestionBulkAction.as_view()),
     path('schedules/<int:pk>/contents/', views.ScheduleContentList.as_view()),

    path('exam-tool/status/', ExamToolViewSet.as_view({'get': 'list'})),
    path('exam-tool/upload/', ExamToolViewSet.as_view({'post': 'create'})),
    path('exam-tool/download/', ExamToolViewSet.as_view({'get': 'download'})),
    path('exam-tool/delete/', ExamToolViewSet.as_view({'delete': 'remove_file'})),


     #==============Refresher Exam Training End=================


     # live data dashboards ================================
    path('chart/bifurcation-statslive/', bifurcation_stats_view, name='bifurcation_stats'),
    path('chart/total-stats/', total_manpower_stats_view, name='total_manpower_stats'),
    path('chart/absenteeism-trendlive/', AbsenteeismTrendView.as_view(), name='absenteeism-trend'),
    path('chart/current-stats/', views.current_manpower_card_view, name='current-manpower-stats'),
    path('operator-analytics/', OperatorAnalyticsView.as_view(), name='operator-analytics'),


    
    # =================== ACTION PLAN ==============================
    path('api/actions/', ActionItemListCreateView.as_view(), name='action-list'),
    path('api/actions/<int:pk>/', ActionItemDetailView.as_view(), name='action-detail'),


    path('api/actionsrejection/', ActionItemRejectionListCreateView.as_view(), name='action-list'),
    path('api/actionsrejection/<int:pk>/', ActionItemRejectionDetailView.as_view(), name='action-detail'),


    











     path('hierarchy/<int:hierarchy_id>/skill-matrix-template/', SpecificHierarchyExcelHandlerView.as_view(), name='specific-hierarchy-excel'),
     path('skill-matrix-excel-handler/', SkillMatrixExcelHandlerView.as_view(), name='skill-matrix-excel-handler'),
     path('skill-matrix/report/download/', SkillMatrixExcelView.as_view(), name='skill_matrix_report_download'),
     # multiskilling time interval setting 
     path('check-skill-eligibility/', views.check_employee_skill_eligibility, name='check-skill-eligibility'),


     path('api/videos/', VideoView.as_view(), name='video_list'),


    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    
