import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import MainLayout from './components/pages/Layout/MainLayout';
import { HomePage } from "./components/pages/Homepage/Home";
import Planning from "./components/pages/Planning/Planning";
import MachinesPage from "./components/pages/Machine/Machines";
import MachineAllocationsPage from "./components/pages/Machine/MachineAllocations";
import Report from "./components/pages/Report/Report";
import { LoginPage } from "./components/pages/LoginPage/LoginPage";
import Level0 from "./components/pages/Level0/Level0";
import TempEmployeeSearch from "./components/organisms/TempEmployeeSearch/TempEmployeeSearch";

import PassedUsersTable from "./components/organisms/PassedUsersTable/PassedUsersTable";
import MasterTable from "./components/pages/MasterTable/MasterTable";
import ProcessDojo from "./components/pages/ProcessDojo/ProcessDojo";
import Level2 from "./components/organisms/Level2/Level2";
import MethodPage from "./components/pages/method/MethodPage";
import SkillMatrixPage from "./components/pages/Skillmatrix/pages/SkillMatrixPage";
import Allocation from "./components/pages/Multi-Skilling Module/Allocation/allocation";
import MultiNotification from "./components/pages/Multi-Skilling Module/MultiSkil-Notification/notification";
import RefreshmentTraining from "./components/pages/RefreshmentTraining/Refreshment";
import Retraining from "./components/pages/Retraining/Retraining";
import EmployeeHistorySearch from "./components/pages/EmpHistorySearch/index";
import Plan from "./components/pages/Planning/plan";
import ProductionPlanList from "./components/pages/Planning/planlist";
import Level3 from "./components/organisms/Level3/Level3";
import Level4 from "./components/organisms/Level4/Level4";
import TrainingOptionsPage from "./components/organisms/TrainingOptionsPage/TrainingOptionsPage";
import RequireAuth from "./components/routing/RequireAuth";

import QuestionUpload from "./components/pages/Question upload/questionupload";
import Management from "./components/pages/ManagementDashboard/management";
import QuestionPaperSetting from "./components/pages/Question upload/Questionpapersetting";
import Hanchou from "./components/pages/Hanchou/hanchou";
import Shokuchou from "./components/pages/Shokuchou/Shokuchou";
import Anlitics from "./components/pages/analytics/index";
import ExamModeSelector from "./components/pages/Evaluvation/ExamModeSelector";
import RemoteQuiz from "./components/pages/Evaluvation/RemoteQuiz";
import QuestionForm from "./components/pages/Evaluvation/QuestionForm";
import AssignEmployees from "./components/pages/Evaluvation/AssignEmployees";
import InstructionsPage from "./components/pages/Evaluvation/InstructionsPage";
import TestEnded from "./components/pages/Evaluvation/TestEnded";
import QuizResults from "./components/pages/Evaluvation/QuizResults";
import IndividualQuiz from "./components/pages/Evaluvation/IndividualQuiz";
import OjtSearch from "./components/organisms/OjtSearch/OjtSearch";
import OJTForm from "./components/pages/OJTForm/OJTForm";
import Approvallist from "./components/pages/Approvallist/Approvallist";
import Level1 from "./components/pages/Level1/Level1";
import Level1Detailed from "./components/pages/Level1/Level1Detailed/Level1Detailed";
import TenCycleMethodPage from "./components/pages/TenCycle/TenCycleMethodPage";
import Level1Settings from "./components/pages/Level1/Level1Settings/Level1method";
import Roles from "./components/pages/Roles/Roles";
import DojoDetail from "./components/pages/DojoDetail/DojoDetail";
import TenCyclePage from "./components/pages/TenCycle/TencyclePage";
import Advance from "./components/pages/AdvanceManPower/advanced";
import Advanced from "./components/pages/AdvancedManPower/advanced";
import MachineAllocationList from "./components/pages/Machine/MachineAllocationList";
import SimpleContentPage from "./components/pages/SimpleContentPage/SimpleContentPage";
import { PROCESSDOJONEW } from "./components/pages/PROCESSDOJONEW/PROCESSDOJONEW";
import AppNotification from "./components/pages/Notifications/notification";
import HandOverSheet from "./components/pages/Level1/HandOverSheet/HandOverSheet";
import { Levelwise } from "./components/pages/Levelwise/Levelwise";
import TrainingOptionsPageNew from "./components/organisms/TrainingOptionsPageNew/TrainingOptionsPageNew";
import PrivacyPolicy from "./components/organisms/PrivacyPolicy/PrivacyPolicy";
import PrivacyPolicyVersionControl from "./components/organisms/PrivacyPolicyVersionControl/PrivacyPolicyVersionControl";
import TermsAndConditions from "./components/organisms/TermsAndConditions/TermsAndConditions";
import ProductionDataTable from "./components/pages/ProductionDataTable/ProductionDataTable";
import ArVrComponent from "./components/pages/ArVrComponent/ArVrComponent";
import AttendancePage from "./components/pages/Level1/Level1Detailed/AttendancePage";
import TrainingFeedbackForm from "./components/pages/Level1/sdc";
import OJTStatusList from "./components/pages/OJTForm/OJTStatusList";
import Scheduling from "./components/pages/Multi-Skilling Module/Scheduling/scheduling";

import BiometricSystem from "./components/pages/BiometricSystem/biometric";
import AnswerSheetView from "./components/pages/Evaluvation/AnswerSheetView";
import ResultsMatrixView from "./components/pages/Evaluvation/ResultsMatrixView";
import GlobalMatrixControls from "./components/organisms/GlobalMatrixControls/GlobalMatrixControls";
import MatrixConfiguration from "./components/organisms/MatrixConfiguration/MatrixConfiguration";
import Level1revision from "./components/pages/Level1/level1revisioon/level1revision";
import BulkQuestionsrevision from "./components/pages/Level1/Level1Detailed/BulkQuestionsrevision";
import HumanBodyCheckpointPage from "./components/organisms/HumanBodyCheckSheet/HumanBodyCheckpointPage";
import ScrollToTop from "./components/hooks/ScrollTop";
import SupervisorDashboard from "./components/pages/Level1/HandOverSheet/SupervisorDashboard";
import NotificationPopup from "./components/pages/Level1/HandOverSheet/NotificationPopup";
import OJTRequirements from "./components/pages/method/quantityDayRequirementSettings";
import TenCycleStatusList from "./components/pages/TenCycle/TenCycleStatusList";
import CriteriaManagement from "./components/pages/method/SkillEvaluationCriteria";
import SkillEvaluationleveltwo from "./components/pages/SkillEvaluation/SkillEvaluation";
import SkillEvaluationList from "./components/pages/SkillEvaluation/SkillEvaluationList";
import ResultsExplorer from "./components/pages/Evaluvation/ResultsExplorer";
import DownloadFiles from "./components/pages/EasyTestDownloader/DownloadFiles";
import NotFound from "./components/pages/NotFound/NotFound";
import DashboardView from "./lms_components/Dashboard/Dashboard";
import CoursesView from "./lms_components/Courses/Courses";
import AdminDashboard from "./lms_components/AdminDashboard/AdminDashboard";
import CourseList from "./lms_components/CoursesList/CoursesList ";
import StudentGroupsListPage from "./lms_components/StudentGroupsPage/StudentGroupsPage";
import CreateGroupPage from "./lms_components/StudentGroupsPage/CreateGroupPage/CreateGroupPage";
import EditGroupPage from "./lms_components/StudentGroupsPage/EditGroupPage/EditGroupPage";
import AddUserForm from "./lms_components/AddNewUser/AddNewUser";
import UserTable from "./lms_components/userpage";
import EmployeeList from "./lms_components/Report/Report";
import NotificationPage from "./lms_components/NotificationPage/NotificationPage";
import CourseDetail from "./lms_components/CourseDetail/CourseDetail";
import CourseLessonPage from "./lms_components/CourseLessonPage/CourseLessonPage";
import CourseMcqExam from "./lms_components/CourseTestRequest/CourseTestRequest";
import { CourseContentManager } from "./lms_components/CreateCourse/CreateCourse";
import CourseTestsManager from "./lms_components/SampleTest/SampleTest";
import RoleBasedRoute from "./components/routing/RoleBasedRouting";
import AssementTable from "./lms_components/AssementTable/AssementTable";
import AnalysisSheet from "./lms_components/AssementTable/AnalysisSheet";
import CompetencySystem from "./lms_components/CompetencySystem/CompetencySystem";
import VideoMaterials from "./components/pages/VideoMaterials/VideoMaterials";
import AdminEnrollmentPage from "./lms_components/AdminEnrollmentPage/AdminEnrollmentPage";
import CoursePage from "./lms_components/CoursePage/CoursePage";
import GrowthReportPage from "./lms_components/GrowthReportPage/GrowthReportPage";
import EmployeeGrowthReportsPage from "./lms_components/GrowthReportPage/EmployeeGrowthReportPage";
import CertificatePage from "./lms_components/CertificatePage/CertificatePage";
import CourseReport from "./lms_components/CourseReport/CourseReport";
import CertificateHome from "./lms_components/CertificatePage/CertificateHome";
import EmployeeReport from "./lms_components/Report/EmployeeReport";
import SchedulePlanner from "./components/pages/RefreshmentTraining/SchedulePlanner/SchedulePlanner";
import TrainingCalendar from "./lms_components/TrainingSchedule/TrainingSchedule";
import EmployeeGroupView from "./lms_components/StudentGroupsPage/EmployeeGroupView";
import LessonAttachments from "./lms_components/LessonDucuments/LessonAttachments";
import RequestReviewPage from "./lms_components/NotificationPage/RequestReviewPage";
import CourseResultSummary from "./lms_components/CourseResultSummary/CourseResultSummary";
import CompetencyDashboard from "./lms_components/CompetencySystem/CompetencyDashboard";
import CompetencyMatrix from "./lms_components/CompetencySystem/CompetencyDashboard";
import FinancialCompetencyPlanner from "./lms_components/CompetencySystem/FinancialCompetencyPlanner";
import CompetencyMatrixSetup from "./lms_components/CompetencySystem/Competencymatrixsetup";
import RuleBasedCompetencySetup from "./lms_components/CompetencySystem/Competencymatrixsetup";
import CompetencyRuleList from "./lms_components/CompetencySystem/CompetencyRuleList";
import OrganizationSetup from "./lms_components/CompetencySystem/OrganisationSetup";
import { DesignProvider } from "./context/DesignContext";
import MainLayout from "./components/pages/MainLayout/MainLayout";
import HomePageContainer from "./context/HomePageContainer";
import AIFeatures from "./lms_components/AiQuiz/AiFeatures";
import FloatingAI from "./lms_components/AiQuiz/FloatingAI";
import AIAssistant from "./lms_components/AiQuiz/AiAssistant";
import { refreshCurrentUser } from "./components/hooks/useAuth";
import type { RootState } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(refreshCurrentUser() as any);
    }
  }, [dispatch, isAuthenticated, accessToken]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const refreshPermissions = () => {
      dispatch(refreshCurrentUser() as any);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshPermissions();
      }
    };

    window.addEventListener("focus", refreshPermissions);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshPermissions);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated, accessToken]);

  return (
    <DesignProvider>
      <BrowserRouter>
        <ScrollToTop />
        <NotificationPopup />
        <Routes>
          {/* ================= 1. PUBLIC ROUTES ================= */}
          <Route path="/" element={<LoginPage />} />

          {/* ================= 2. PROTECTED ROUTES ================= */}
          <Route element={<RequireAuth />}>
            {/* ---> Routes with MainLayout (Navbar, Footer, Sidebar) <--- */}
            <Route element={<MainLayout />}>
              <Route
                element={<RoleBasedRoute allowedModules={["admin_dashboard"]} />}
              >
                <Route path="/lms/admin" element={<AdminDashboard />} />
              </Route>

              <Route
                element={<RoleBasedRoute allowedModules={["team_leader_dashboard"]} />}
              >
                <Route
                  path="/team-lead/dashboard"
                  element={<SupervisorDashboard />}
                />
                <Route
                  path="/supervisordashboard"
                  element={<SupervisorDashboard />}
                />
              </Route>

              <Route
                element={<RoleBasedRoute allowedModules={["employee_dashboard"]} />}
              >
                <Route path="/lms/dashboard" element={<DashboardView />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["user_registration", "users"]}
                  />
                }
              >
                <Route path="/Roles" element={<Roles />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["user_creation", "users"]}
                  />
                }
              >
                <Route path="/lms/users/new" element={<AddUserForm />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["user_table", "users"]}
                  />
                }
              >
                <Route path="/lms/users/table" element={<UserTable />} />
                <Route
                  path="/PassedUsersTable"
                  element={<PassedUsersTable />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["create_course", "courses"]}
                  />
                }
              >
                <Route path="/lms/course-list" element={<CourseList />} />
                <Route
                  path="/CourseContentManager"
                  element={<CourseContentManager />}
                />
                <Route
                  path="/CourseTestsManager"
                  element={<CourseTestsManager />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["enrollments", "courses", "groups"]}
                  />
                }
              >
                <Route
                  path="/lms/enrollments"
                  element={<AdminEnrollmentPage />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["group_creation", "groups"]}
                  />
                }
              >
                <Route
                  path="/lms/groups/create"
                  element={<CreateGroupPage />}
                />
                <Route path="/lms/groups/edit" element={<EditGroupPage />} />
                <Route
                  path="/lms/groups/create/:groupId"
                  element={<CreateGroupPage />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["groups_directory", "groups"]}
                  />
                }
              >
                <Route path="/lms/groups" element={<StudentGroupsListPage />} />
                <Route
                  path="/lms/groups/view/:groupId"
                  element={<EmployeeGroupView />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["course_reports", "reports"]}
                  />
                }
              >
                <Route
                  path="/lms/reports/courses/"
                  element={<CourseReport />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["employee_reports", "reports"]}
                  />
                }
              >
                <Route
                  path="/lms/reports/employees"
                  element={<EmployeeList />}
                />
                <Route
                  path="/EmployeeReport/:employeeId"
                  element={<EmployeeReport />}
                />
                <Route
                  path="/EmployeeHistorySearch"
                  element={<EmployeeHistorySearch />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["certificate", "reports"]}
                  />
                }
              >
                <Route
                  path="/lms/courses/:courseId/certificate"
                  element={<CertificatePage />}
                />
                <Route
                  path="/lms/certificateHome"
                  element={<CertificateHome />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["notifications_page", "notifications"]}
                  />
                }
              >
                <Route
                  path="/lms/notifications"
                  element={<NotificationPage selectedRole={"Administrator"} />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["lesson_materials", "courses"]}
                  />
                }
              >
                <Route path="/documents" element={<LessonAttachments />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["ai_chat_bot", "ai_tools"]}
                  />
                }
              >
                <Route path="/lms/ai-features" element={<AIFeatures />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["ai_assistant", "ai_tools"]}
                  />
                }
              >
                <Route path="/ai-assistant" element={<AIAssistant />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["schedule", "planning"]}
                  />
                }
              >
                <Route path="/lms/calendar" element={<TrainingCalendar />} />
                <Route
                  path="/lms/employee-calendar"
                  element={<TrainingCalendar />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["tni", "planning"]}
                  />
                }
              >
                <Route path="/refreshment" element={<RefreshmentTraining />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["multiskill_schedule", "planning"]}
                  />
                }
              >
                <Route path="/Scheduling" element={<Scheduling />} />
                <Route path="/scheduling" element={<Scheduling />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["level_wise_sheet", "users", "assessments"]}
                  />
                }
              >
                <Route path="/lms/usertables" element={<AssementTable />} />
                <Route path="/lms/AnalysisSheet" element={<AnalysisSheet />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["level_assessment", "assessments"]}
                  />
                }
              >
                <Route
                  path="/CompetencySystem"
                  element={<CompetencySystem />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["competency_dashboard", "assessments"]}
                  />
                }
              >
                <Route
                  path="/lms/competency-matrix"
                  element={<CompetencyDashboard />}
                />
                <Route
                  path="/CompetencyDashboard"
                  element={<CompetencyMatrix />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["method_settings", "method"]}
                  />
                }
              >
                <Route path="/methodsettings" element={<MethodPage />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["hierarchy", "method"]}
                  />
                }
              >
                <Route
                  path="/lms/organization/setup"
                  element={<OrganizationSetup />}
                />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["ar_vr_experience", "ai_tools"]}
                  />
                }
              >
                <Route path="/ArVrComponent" element={<ArVrComponent />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["animations", "ai_tools"]}
                  />
                }
              >
                <Route path="/materials" element={<VideoMaterials />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["skill_matrix"]}
                  />
                }
              >
                <Route path="/skillmatrix" element={<SkillMatrixPage />} />
              </Route>

              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={["course_catalog", "courses"]}
                  />
                }
              >
                <Route path="/lms/courses" element={<CoursesView />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/lms/courses/:courseId" element={<CoursePage />} />
                <Route
                  path="/lms/courses/:courseId/lesson/:lessonId"
                  element={<CourseLessonPage />}
                />
                <Route
                  path="/lms/courses/:courseId/test/:testId"
                  element={<CourseMcqExam />}
                />
                <Route
                  path="/lms/courses/:courseId/results"
                  element={<CourseResultSummary />}
                />
                <Route
                  path="/lms/growth/compare/employee/:courseId"
                  element={<EmployeeGrowthReportsPage />}
                />
              </Route>

              {/* A. ADMIN ONLY ROUTES */}
              {/* ONLY Admins can see these. Employees cannot access these. */}
              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={[
                      "admin_dashboard",
                      "reports",
                      "course_reports",
                      "notifications",
                      "user_table",
                      "users",
                      "method_settings",
                    ]}
                  />
                }
              >
                <Route
                  path="/lms/growth/compare/:courseId"
                  element={<GrowthReportPage />}
                />
                <Route
                  path="/lms/admin/request-review/:requestId"
                  element={<RequestReviewPage />}
                />

                {/* Settings & Masters */}
                <Route path="/MasterTable" element={<MasterTable />} />
                <Route path="/methodsettings" element={<MethodPage />} />
                <Route path="/Level1Settings" element={<Level1Settings />} />
                <Route
                  path="/manage-criteria"
                  element={<CriteriaManagement />}
                />
                <Route
                  path="/matrixconfiguration"
                  element={<MatrixConfiguration />}
                />
                <Route
                  path="/globalmatrixcontrol"
                  element={<GlobalMatrixControls />}
                />
                <Route path="/biometricsystem" element={<BiometricSystem />} />
                <Route
                  path="/TrainingOptionsPage"
                  element={<TrainingOptionsPage />}
                />
                <Route
                  path="/TrainingOptionsPageNew"
                  element={<TrainingOptionsPageNew />}
                />
                <Route
                  path="/quantitydaysettings"
                  element={<OJTRequirements />}
                />

                {/* Exam Creation */}
                <Route
                  path="/question-paper-setting"
                  element={<QuestionPaperSetting />}
                />
                <Route path="/questions-upload" element={<QuestionUpload />} />
                <Route
                  path="/bulk-upload-questions"
                  element={<BulkQuestionsrevision />}
                />
              </Route>

              {/* B. MANAGEMENT ROUTES (Admin + Team Leader) */}
              {/* Admin can see these. Team Leader can see these. Employee CANNOT. */}
              <Route
                element={
                  <RoleBasedRoute
                    allowedModules={[
                      "team_leader_dashboard",
                      "planning",
                      "schedule",
                      "reports",
                    ]}
                  />
                }
              >
                <Route path="/Management" element={<Management />} />
                <Route path="/Hanchou" element={<Hanchou />} />
                <Route path="/Shokuchou" element={<Shokuchou />} />

                {/* Approvals & Reports */}
                <Route path="/approvallist" element={<Approvallist />} />
                <Route path="/ojt-status" element={<OJTStatusList />} />
                <Route
                  path="/tencycle-status"
                  element={<TenCycleStatusList />}
                />
                <Route path="/results-matrix" element={<ResultsMatrixView />} />
                <Route
                  path="/answersheet/:scoreId"
                  element={<AnswerSheetView />}
                />

                {/* Assignments & Planning */}
                <Route path="/assign-employees" element={<AssignEmployees />} />
                <Route path="/assign-remote" element={<AssignEmployees />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/planlist" element={<ProductionPlanList />} />
                <Route path="/allocation" element={<Allocation />} />
                <Route path="/Scheduling" element={<Scheduling />} />
                <Route
                  path="/machine-allocations"
                  element={<MachineAllocationsPage />}
                />
                <Route
                  path="/machineallocationslist"
                  element={<MachineAllocationList />}
                />
                <Route path="/SchedulePlanner" element={<SchedulePlanner />} />

                {/* Analytics */}
                <Route path="/analytics" element={<Anlitics />} />
                <Route path="/report" element={<Report />} />
              </Route>

              {/* C. GENERAL/EMPLOYEE ROUTES (Everyone) */}
              {/* Everyone is allowed here. Admin sees this. Employee sees only this. */}
              <Route
                element={
                  <RoleBasedRoute allowedModules={["employee_dashboard"]} />
                }
              >
                {/* Dashboards */}
                {/* <Route path="/home" element={<HomePage />} /> */}
                <Route path="/home" element={<HomePageContainer />} />
                <Route path="/employee/dashboard" element={<HomePage />} />
                {/* Courses & Learning */}
                {/* <Route path="/lms/courses" element={<CoursesView />} /> */}
                {/* <Route path="/lms/course-list" element={<CourseList />} /> */}
                <Route path="/dojoTraining/" element={<DojoDetail />} />
                <Route path="/ContentPage" element={<SimpleContentPage />} />
                <Route path="/ProcessDojo" element={<ProcessDojo />} />
                <Route path="/PROCESSDOJONEW" element={<PROCESSDOJONEW />} />

                {/* Levels & Forms */}
                <Route path="/Level0" element={<Level0 />} />
                <Route path="/Level1" element={<Level1 />} />
                <Route path="/level1/:id" element={<Level1Detailed />} />
                <Route path="/Level2" element={<Level2 />} />
                <Route path="/Level3" element={<Level3 />} />
                <Route path="/Level4" element={<Level4 />} />
                <Route path="/Levelwise" element={<Levelwise />} />
                <Route path="/level1revision" element={<Level1revision />} />

                <Route path="/OJTForm" element={<OJTForm />} />
                <Route path="/HandoverSheet" element={<HandOverSheet />} />
                <Route path="/Level1/attendance" element={<AttendancePage />} />
                <Route
                  path="/Level1/feedbackform"
                  element={<TrainingFeedbackForm />}
                />
                <Route path="/TenCyclePage" element={<TenCyclePage />} />
                <Route
                  path="/TenCycleMethod"
                  element={<TenCycleMethodPage />}
                />

                {/* Personal Info & Self Service */}
                <Route path="/retraining" element={<Retraining />} />
                <Route
                  path="/TempEmployeeSearch"
                  element={<TempEmployeeSearch />}
                />
                <Route path="/notification" element={<AppNotification />} />
                <Route
                  path="/multinotification"
                  element={<MultiNotification />}
                />

                {/* Misc */}
                <Route path="/machines" element={<MachinesPage />} />
                <Route path="/advanced" element={<Advanced />} />
                <Route path="/advance" element={<Advance />} />
                <Route
                  path="/ProductionDataTable"
                  element={<ProductionDataTable />}
                />
                <Route path="/OjtSearch" element={<OjtSearch />} />
                <Route
                  path="/human-body-checkpoint/:employeeId"
                  element={<HumanBodyCheckpointPage />}
                />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route
                  path="/VersionControl"
                  element={<PrivacyPolicyVersionControl />}
                />
                <Route
                  path="/TermsAndConditions"
                  element={<TermsAndConditions />}
                />

                {/* Quizzes & Evals Start */}
                {/* <Route path="/courses/:courseId/test/:testId" element={<CourseMcqExam />} /> */}
                <Route
                  path="/ExamModeSelector"
                  element={<ExamModeSelector />}
                />
                <Route path="/quiz-results" element={<QuizResults />} />
                <Route path="/results-explorer" element={<ResultsExplorer />} />
                <Route
                  path="/SkillEvaluationleveltwo"
                  element={<SkillEvaluationleveltwo />}
                />
                <Route
                  path="/skillevaluationslist"
                  element={<SkillEvaluationList />}
                />
                <Route path="/DownloadFiles" element={<DownloadFiles />} />
                <Route
                  path="/financial-year"
                  element={<FinancialCompetencyPlanner />}
                />
                <Route
                  path="/competency-matrix"
                  element={<CompetencyMatrixSetup />}
                />
                <Route
                  path="/lms/competency/rules-view"
                  element={<CompetencyRuleList />}
                />
                <Route
                  path="/lms/competency/rules"
                  element={<RuleBasedCompetencySetup />}
                />

                {/* <Route path="/lms/enrollments" element={<AdminEnrollmentPage />} /> */}
              </Route>
            </Route>

            {/* ---> Fullscreen Routes (No Navbar) <--- */}
            {/* Accessible to everyone for taking tests */}
            <Route
              element={
                <RoleBasedRoute allowedModules={["employee_dashboard"]} />
              }
            >
              <Route path="/remote" element={<RemoteQuiz />} />
              <Route path="/IndividualQuiz" element={<IndividualQuiz />} />
              <Route path="/quiz-instructions" element={<InstructionsPage />} />
              <Route path="/test-ended" element={<TestEnded />} />
              <Route path="/add-question" element={<QuestionForm />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <FloatingAI />
      </BrowserRouter>
    </DesignProvider>
  );
}

export default App;
