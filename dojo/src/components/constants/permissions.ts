type ModuleAccess = {
  name?: string;
  view?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  approve?: boolean;
  export?: boolean;
  manage?: boolean;
};

type AccessMap = Record<string, ModuleAccess>;

type AppUser = { role?: string; userType?: string; permissions?: AccessMap } | null | undefined;

const isAdminLikeUser = (user: AppUser) => {
  const normalizedRole = String(user?.role || user?.userType || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  return normalizedRole === 'admin' || normalizedRole === 'administrator';
};

const tileToModuleMap: Record<string, string | string[]> = {
  'lms-dashboard': ['admin_dashboard', 'team_leader_dashboard', 'employee_dashboard'],
  'User Managements': ['users', 'user_creation', 'user_table', 'level_wise_sheet', 'employee_history_card'],
  'master-employee': ['users', 'user_table', 'employee_history_card'],
  'process-dojo': ['users', 'user_registration'],
  'courses': ['courses', 'course_catalog', 'create_course', 'enrollments'],
  'groups': ['groups', 'group_creation', 'groups_directory', 'enrollments'],
  'reports': ['reports', 'course_reports', 'employee_reports', 'certificate'],
  'notifications': ['notifications', 'notifications_page'],
  'planning': ['planning', 'schedule', 'tni', 'multiskill_schedule', 'core_configuration'],
  'schedules': ['planning', 'schedule', 'multiskill_schedule'],
  'method': ['method', 'method_settings', 'hierarchy'],
  'skill-matrix': ['skill_matrix'],
  'observance-sheet': ['assessments', 'level_assessment', 'competency_dashboard'],
  'level-curriculum': ['lesson_materials', 'ai_chat_bot', 'ai_assistant', 'assessments'],
  'analytics': ['reports', 'course_reports', 'employee_reports'],
  'settings': 'roles',
  'ar-vr': ['ai_tools', 'ar_vr_experience', 'animations'],
};

const linkToModuleMap: Record<string, string | string[]> = {
  'Admin Dashboard': 'admin_dashboard',
  'Team Leader Dashboard': 'team_leader_dashboard',
  'User Dashboard': 'employee_dashboard',
  'User Creation': ['user_creation', 'users'],
  'User Table': ['user_table', 'users'],
  'Employee History Card': ['employee_history_card', 'users'],
  'User Id Registration': ['user_registration', 'users'],
  'Registration': ['user_registration', 'users'],
  'Level Wise Sheet': ['level_wise_sheet', 'users'],
  'Create Course': ['create_course', 'courses'],
  'Courses': ['course_catalog', 'courses'],
  'Enrollments': ['enrollments', 'courses', 'groups'],
  'Group Creation': ['group_creation', 'groups'],
  'Groups': ['groups_directory', 'groups'],
  'Course Reports': ['course_reports', 'reports'],
  'Employee Reports': ['employee_reports', 'reports'],
  'Certificate': ['certificate', 'reports'],
  'Notification': ['notifications_page', 'notifications'],
  'Lesson Materials': 'lesson_materials',
  'AI Chat Bot': ['ai_chat_bot', 'ai_tools'],
  'AI Assistant': ['ai_assistant', 'ai_tools'],
  'Schedule': ['schedule', 'planning'],
  'TNI': ['tni', 'planning'],
  'Method Settings': ['method_settings', 'method'],
  'Hierarchy': ['hierarchy', 'method'],
  'Level Assessment': ['level_assessment', 'assessments'],
  'Competency Dashboard': ['competency_dashboard', 'assessments'],
  'AR/VR Experience': ['ar_vr_experience', 'ai_tools'],
  'Animations': ['animations', 'ai_tools'],
  'Multiskill Schedule': ['multiskill_schedule', 'planning'],
  'Core Configuration': ['core_configuration', 'planning'],
  'Skill Matrix': 'skill_matrix',
};

const normalizeModuleSlug = (moduleSlug: string) => moduleSlug.replace(/-/g, '_');

const canUseAccess = (access?: ModuleAccess) =>
  Boolean(
    access?.view ||
      access?.create ||
      access?.update ||
      access?.delete ||
      access?.approve ||
      access?.export ||
      access?.manage,
  );

export function hasModuleAccess(user: AppUser, moduleSlug: string) {
  if (isAdminLikeUser(user)) {
    return true;
  }

  if (user && normalizeModuleSlug(moduleSlug) === 'employee_dashboard') {
    return true;
  }

  const normalizedSlug = normalizeModuleSlug(moduleSlug);
  const access = user?.permissions?.[normalizedSlug];
  return canUseAccess(access);
}

export function hasModuleAction(
  user: AppUser,
  moduleSlug: string,
  actions: Array<keyof ModuleAccess>,
) {
  if (isAdminLikeUser(user)) {
    return true;
  }
  const normalizedSlug = normalizeModuleSlug(moduleSlug);
  const access = user?.permissions?.[normalizedSlug];

  if (access) {
    return actions.some((action) => Boolean(access[action]));
  }

  return false;
}

export function hasAnyModuleAction(
  user: AppUser,
  moduleSlugs: string[],
  actions: Array<keyof ModuleAccess>,
) {
  return moduleSlugs.some((moduleSlug) => hasModuleAction(user, moduleSlug, actions));
}

export function hasAnyModuleAccess(user: AppUser, moduleSlugs: string[]) {
  return moduleSlugs.some((moduleSlug) => hasModuleAccess(user, moduleSlug));
}

export function resolveDashboardRoute(user: AppUser) {
  if (hasModuleAccess(user, 'admin_dashboard')) {
    return '/lms/admin';
  }
  if (hasModuleAccess(user, 'team_leader_dashboard')) {
    return '/team-lead/dashboard';
  }
  if (hasModuleAccess(user, 'employee_dashboard')) {
    return '/lms/dashboard';
  }
  return '/home';
}

export function resolveDefaultLandingPath(user: AppUser) {
  return '/home';
}

export const rolePermissions: Record<string, never> = {};
export const linkPermissions: Record<string, never> = {};

export function canAccessTile(user: AppUser, tileId: string) {
  const moduleSlug = tileToModuleMap[tileId];
  if (Array.isArray(moduleSlug)) {
    return hasAnyModuleAccess(user, moduleSlug);
  }

  if (!moduleSlug) {
    return false;
  }

  return hasModuleAccess(user, moduleSlug);
}

export function getAllowedLinksForTile<T extends { name: string }>(
  user: AppUser,
  tileId: string,
  links: T[],
): T[] {
  return links.filter((link) => {
    const linkedModule = linkToModuleMap[link.name];
    if (linkedModule) {
      return Array.isArray(linkedModule)
        ? hasAnyModuleAccess(user, linkedModule)
        : hasModuleAccess(user, linkedModule);
    }

    return canAccessTile(user, tileId);
  });
}
