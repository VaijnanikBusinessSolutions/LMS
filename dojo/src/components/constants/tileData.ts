import {
  // existing
  BarChart3,
  Sword,
  Users,
  Grid,
  RotateCw,
  Bell,
  Calendar,
  Glasses,
  Settings,
  FileText,
  Activity,
  FileBarChart2,
  UserCog,
  Clock,
  Layers,
  FlaskRound,
  FileSearch,
  Target,
  Cpu,
  Brain,
  Database,
  Shield,
  Video,
  BookOpen,
  ClipboardList,
  Server,
  Network,
  CheckCircle,
  Megaphone,
  GitBranch,
  GraduationCap,
  Microscope,
  List,
  TrendingUp,
  ClipboardCheck,
  FileSliders,
  ChartNoAxesCombined,
  FileChartColumn,
  ClipboardPenLine,
  LayoutGrid,
  Table2,
  FilePlus,

  // NEW icons to avoid duplicates
  Gauge,
  LineChart,
  PieChart,
  BarChartBig,
  Presentation,
  Layers3,
  Library,
  BookMarked,
  FolderOpen,
  FolderKanban,
  FolderCog,
  NotebookPen,
  NotepadText,
  FileStack,
  FileSpreadsheet,
  FilePieChart,
  BadgeCheck,
  Award,
  KeyRound,
  Lock,
  ShieldCheck,
  UserPlus,
  UsersRound,
  UserRoundCog,
  UserRoundSearch,
  UserCheck,
  ClipboardSignature,
  ClipboardType,
  CalendarClock,
  CalendarCheck2,
  CalendarDays,
  Repeat2,
  RefreshCw,
  Sparkles,
  Wand2,
  Rocket,
  CpuIcon,
  HardDrive,
  DatabaseZap,
  Cog,
  CogIcon,
  SlidersHorizontal,
  Wrench,
  // Tool,
  BellRing,
  BellDot,
  Send,
  Mail,
  MessageSquareText,
  ClipboardCopy,
  Search,
  ScanSearch,
  FileWarning,
  FileCheck2,
  FileLock2,
  FileCode2,
  PlaySquare,
  Film,
  Image,
  MonitorPlay,
  type LucideIcon,
  IdCard,
  Bot
} from 'lucide-react';

// ==================== TAB TYPES ====================

export type TabId =
  | 'overview'
  | 'lms'
  | 'dojo'
  | 'dashboards'
  | 'tables'
  | 'forms'
  | 'system';

export interface TabDefinition {
  id: TabId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface TileLink {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface TileData {
  id: string;
  title: string;
  links: TileLink[];
  icon: LucideIcon;
  statusText?: string;
  borderTopColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  disabled?: boolean;
  tabCategories: TabId[];
}

export interface QuickLink {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

// ==================== TABS ====================
export const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, description: 'All modules at a glance' },
  { id: 'dashboards', label: 'Dashboards', icon: Gauge, description: 'Visual analytics & graphs' },
  { id: 'tables', label: 'Data Views', icon: Table2, description: 'Tables & reports' },
  { id: 'forms', label: 'Create', icon: FilePlus, description: 'Forms & configurations' },
  { id: 'system', label: 'System', icon: Cog, description: 'Settings & tools' },
];

// ==================== QUICK LINKS ====================
export const dashboardLinks: QuickLink[] = [
  { name: 'Admin Dashboard', path: '/lms/admin', icon: Presentation, description: 'LMS admin', color: 'from-blue-500 to-blue-700' },
  { name: 'Team Leader Dashboard', path: '/team-lead/dashboard', icon: LineChart, description: 'Supervisor overview', color: 'from-purple-500 to-purple-700' },
  { name: 'Employee Dashboard', path: '/lms/dashboard', icon: UsersRound, description: 'Learning progress', color: 'from-blue-600 to-blue-800' },
];


export const tableLinks: QuickLink[] = [
  { name: 'Courses', path: '/lms/courses', icon: IdCard, description: 'Management', color: 'from-blue-500 to-blue-700' },
  { name: 'User Table', path: '/lms/users/table', icon: Database, description: 'User data', color: 'from-teal-500 to-teal-700' },
  { name: 'Employee History Card', path: '/EmployeeHistorySearch', icon: UserRoundSearch, description: 'History', color: 'from-rose-500 to-rose-700' },
  { name: 'Lesson Materials', path: '/documents', icon: FolderOpen, description: 'Materials', color: 'from-green-500 to-green-700' },
  { name: 'Employee Reports', path: '/lms/reports/employees', icon: Users, description: 'Reports', color: 'from-blue-700 to-blue-900' },
  { name: 'Course Reports', path: '/lms/reports/courses', icon: FileBarChart2, description: 'Reports', color: 'from-blue-700 to-blue-900' },
  { name: 'AR/VR Experience', path: '/ArVrComponent', icon: Glasses, description: 'Multimedia', color: 'from-lime-500 to-lime-700' },
  { name: 'Animations', path: '/materials', icon: Film, description: 'Multimedia', color: 'from-lime-500 to-lime-700' },
  { name: 'Certificate', path: '/lms/certificateHome', icon: FileSearch, description: 'Certification', color: 'from-blue-700 to-blue-900' },
];


export const formLinks: QuickLink[] = [
  { name: 'Group Creation', path: '/lms/groups/create', icon: UsersRound, description: 'Groups', color: 'from-orange-500 to-orange-700' },
  { name: 'User Creation', path: '/lms/users/new', icon: UserPlus, description: 'Users', color: 'from-orange-600 to-orange-800' },
  { name: 'Registration', path: '/Roles', icon: ClipboardType, description: 'Dojo Reg', color: 'from-blue-500 to-red-700' },
  { name: 'Planning', path: '/lms/calendar', icon: GitBranch, description: 'New plans', color: 'from-amber-600 to-amber-800' },
  { name: 'Level Wise Sheet', path: '/lms/usertables', icon: FileStack, description: 'Sheets', color: 'from-indigo-500 to-indigo-700' },
  { name: 'Create Course', path: '/lms/course-list', icon: Library, description: 'LMS Create', color: 'from-blue-600 to-blue-800' },
];

// ==================== TILES ====================
// ==================== TILES ====================
export const tiles: TileData[] = [
  // ===== LMS TILES =====
  {
    id: 'lms-dashboard',
    title: 'Dashboards',
    links: [
      { name: 'Admin Dashboard', path: '/lms/admin', icon: Presentation },
      { name: 'Team Leader Dashboard', path: '/team-lead/dashboard', icon: LineChart },
      { name: 'Employee Dashboard', path: '/lms/dashboard', icon: UsersRound },
    ],
    icon: Gauge, // UNIQUE parent icon
    statusText: 'Live',
    borderTopColor: 'border-t-blue-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
    tabCategories: ['overview', 'lms'],
  },
   {
    id: 'process-dojo',
    title: 'Registration',
    links: [
      { name: 'User Id Registration', path: '/Roles', icon: ClipboardType },
      // { name: 'Department Wise Training', path: '/ProcessDojo', icon: GraduationCap },
      // { name: 'Quiz Results', path: '/quiz-results', icon: BadgeCheck },
      // { name: 'Handover Overview', path: '/supervisordashboard', icon: ClipboardCheck },
    ],
    icon: Sword, // UNIQUE parent icon
    statusText: 'Active',
    borderTopColor: 'border-t-red-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-blue-500 to-red-700',
    tabCategories: ['overview', 'dojo'],
  },
  
  {
    id: 'courses',
    title: 'Courses',
    links: [
      { name: 'Create Course', path: '/lms/course-list', icon: Library },
      { name: 'Courses', path: '/lms/courses', icon: BookMarked },
      { name: 'Enrollments', path: '/lms/enrollments', icon: ClipboardSignature },
    ],
    icon: BookOpen, // UNIQUE parent icon (not reused as parent elsewhere below)
    statusText: 'Live',
    borderTopColor: 'border-t-blue-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
    tabCategories: ['overview', 'lms', 'tables'],
  },
  {
    id: 'groups',
    title: 'Groups',
    links: [
      { name: 'Group Creation', path: '/lms/groups/create', icon: UsersRound },
      { name: 'Groups', path: '/lms/groups', icon: Users },
      { name: 'Enrollments', path: '/lms/enrollments', icon: ClipboardSignature },
    ],
    icon: BookOpen, // UNIQUE parent icon (not reused as parent elsewhere below)
    statusText: 'Live',
    borderTopColor: 'border-t-blue-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
    tabCategories: ['overview', 'lms', 'tables'],
  },
 
  {
    id: 'planning',
    title: 'Planning',
    links: [
      // { name: 'Planning', path: '/SchedulePlanner', icon: GitBranch },
      { name: 'Schedule', path: '/lms/calendar', icon: GitBranch },
      { name: 'TNI', path: '/refreshment', icon: CalendarDays },

      // { name: 'Plan', path: '/plan', icon: Target },
      // { name: 'Plan List', path: '/home', icon: ClipboardCopy },
    ],
    icon: CalendarCheck2, // UNIQUE parent icon (not Calendar again)
    statusText: 'Updated',
    borderTopColor: 'border-t-fuchsia-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-700',
    tabCategories: ['overview', 'dojo'],
  },
  // {
  //   id: 'analytics',
  //   title: 'Analytics',
  //   links: [
  //     { name: 'Analytics Graph', path: '/home', icon: ChartNoAxesCombined },
  //     { name: 'Analytics Table', path: '/home', icon: FilePieChart },
  //   ],
  //   icon: BarChart3, // UNIQUE parent icon (used only here as parent)
  //   statusText: 'Updated',
  //   borderTopColor: 'border-t-pink-500',
  //   iconColor: 'text-white',
  //   iconBgColor: 'bg-gradient-to-br from-pink-500 to-pink-700',
  //   tabCategories: ['overview', 'dojo'],
  // },
  {
    id: 'master-employee',
    title: 'Master Employee',
    links: [
      { name: 'User Table', path: '/lms/users/table', icon: DatabaseZap },
      // { name: 'Employee History Card', path: '/EmployeeHistorySearch', icon: UserRoundSearch },
    ],
    icon: Shield, // UNIQUE parent icon
    statusText: 'Live',
    borderTopColor: 'border-t-rose-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-rose-500 to-rose-700',
    tabCategories: ['overview', 'dojo'],
  },
  
  {
    id: 'observance-sheet',
    title: 'Level Assessment',
    links: [
      // { name: 'Retraining', path: '/retraining', icon: RefreshCw },
      { name: 'Level Assessment', path: '/CompetencySystem', icon: UserRoundCog },
      { name: 'Competency Dashboard', path: '/CompetencyDashboard', icon: UserRoundCog },

    ],
    icon: FileCheck2, // UNIQUE parent icon (instead of FileText again)
    statusText: 'Active',
    borderTopColor: 'border-t-amber-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-amber-500 to-amber-700',
    tabCategories: ['overview', 'dojo'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    links: [
      { name: 'Notification', path: '/lms/notifications', icon: BellRing },
      // { name: 'Approval List', path: '/approvallist', icon: CheckCircle },
    ],
    icon: BellDot, // UNIQUE parent icon (instead of Megaphone)
    statusText: 'Live',
    borderTopColor: 'border-t-teal-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-teal-500 to-teal-700',
    tabCategories: ['overview', 'system'],
  },
  
  {
    id: 'level-curriculum',
    title: 'Knowledge Center',
    links: [
      { name: 'Lesson Materials', path: '/documents', icon: FolderOpen },
      { name: 'AI Chat Bot', path: '/lms/ai-features', icon: Bot },
      { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },


      // { name: 'Question Paper Settings', path: '/question-paper-setting', icon: NotepadText },
    ],
    icon: Layers3, // UNIQUE parent icon (instead of BookOpen again)
    statusText: 'Active',
    borderTopColor: 'border-t-green-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-green-500 to-green-700',
    tabCategories: ['overview', 'dojo'],
  },
  {
    id: 'ar-vr',
    title: 'Multimedia',
    links: [
      { name: 'AR/VR Experience', path: '/ArVrComponent', icon: Glasses },
      { name: 'Animations', path: '/materials', icon: Film },
    ],
    icon: MonitorPlay, // UNIQUE parent icon (instead of Video again)
    statusText: 'New',
    borderTopColor: 'border-t-lime-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-lime-500 to-lime-700',
    tabCategories: ['overview', 'dojo'],
  },

  // ===== SYSTEM / ADMIN TILES =====
  {
    id: 'User Managements',
    title: 'Level Wise Training',
    links: [
      // { name: 'Group Creation', path: '/lms/groups/create', icon: UsersRound },
      // { name: 'User Creation', path: '/lms/users/new', icon: UserPlus },
      { name: 'Level Wise Sheet', path: '/lms/usertables', icon: FileStack },
      // { name: 'Department Wise Training', path: '/ProcessDojo', icon: GraduationCap },

    ],
    icon: UserCog, // UNIQUE parent icon (not Settings)
    statusText: 'Active',
    borderTopColor: 'border-t-indigo-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    tabCategories: ['overview', 'lms'],
  },

  {
    id: 'reports',
    title: 'Reports',
    links: [
      { name: 'Course Reports', path: '/lms/reports/courses', icon: FileBarChart2 },
      { name: 'Employee Reports', path: '/lms/reports/employees', icon: Users },
      // { name: 'Training Report', path: '/report', icon: FileSearch },
      { name: 'Certificate', path: '/lms/certificateHome', icon: FileSearch },

    ],
    icon: FileChartColumn, // UNIQUE parent icon (instead of FileBarChart2 again)
    statusText: 'Updated',
    borderTopColor: 'border-t-blue-700',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-blue-700 to-blue-900',
    tabCategories: ['overview', 'lms'],
  },
      
  {
    id: 'settings',
    title: 'Settings',
    links: [
      { name: 'List', path: '', icon: List },
      // { name: 'Roles', path: '/Roles', icon: KeyRound },
      { name: 'Core Configuration', path: '/Planning', icon: GitBranch },

    ],
    icon: SlidersHorizontal, // UNIQUE parent icon (instead of Settings again)
    statusText: 'System',
    borderTopColor: 'border-t-slate-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-slate-500 to-slate-700',
    tabCategories: ['overview', 'system'],
  },
  {
    id: 'method',
    title: 'Method',
    links: [{ name: 'Method Settings', path: '/methodsettings', icon: Wand2 },
            { name: 'Hierarchy', path: '/lms/organization/setup', icon: Wand2 },
          ],
    icon: Microscope, // UNIQUE parent icon (only here)
    statusText: 'Updated',
    borderTopColor: 'border-t-violet-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-violet-500 to-violet-700',
    tabCategories: ['overview', 'dojo'],
  },
  {
    id: 'schedules',
    title: 'Schedules',
    links: [
      { name: 'Multiskill Schedule', path: '/scheduling', icon: CalendarClock },
      // { name: 'TNI', path: '/refreshment', icon: CalendarDays },
    ],
    icon: Calendar, // UNIQUE parent icon (only here)
    statusText: 'Updated',
    borderTopColor: 'border-t-yellow-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
    tabCategories: ['overview', 'dojo'],
  },
  {
    id: 'skill-matrix',
    title: 'Skill Matrix',
    links: [{ name: 'Skill Matrix', path: '/skillmatrix', icon: Brain }],
    icon: Grid, // UNIQUE parent icon (only here)
    statusText: 'Beta',
    borderTopColor: 'border-t-orange-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-orange-500 to-orange-700',
    tabCategories: ['overview', 'dojo'],
  },
];

// ==================== HELPER FUNCTIONS ====================
export const getTilesByTab = (tabId: TabId): TileData[] => {
  return tiles.filter((tile) => tile.tabCategories.includes(tabId));
};

export interface SearchableItem {
  name: string;
  path: string;
  icon: LucideIcon;
  parentTitle: string;
  type: 'link' | 'tile';
}

export const getSearchableItems = (): SearchableItem[] => {
  const items: SearchableItem[] = [];

  tiles.forEach((tile) => {
    items.push({
      name: tile.title,
      path: tile.links[0]?.path || '',
      icon: tile.icon,
      parentTitle: '',
      type: 'tile',
    });

    tile.links.forEach((link) => {
      if (link.path) {
        items.push({
          name: link.name,
          path: link.path,
          icon: link.icon,
          parentTitle: tile.title,
          type: 'link',
        });
      }
    });
  });

  // Add quick links too
  [...dashboardLinks, ...tableLinks, ...formLinks].forEach((link) => {
    items.push({
      name: link.name,
      path: link.path,
      icon: link.icon,
      parentTitle: '',
      type: 'link',
    });
  });

  return items;
};

