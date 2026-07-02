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

type AppUser = { role?: string; permissions?: AccessMap } | null | undefined;

const fallbackRolePermissions: Record<string, string[] | 'ALL'> = {
  admin: 'ALL',
  'team-leader': [
    'lms-dashboard',
    'courses',
    'User Managements',
    'notifications',
    'observance-sheet',
    'reports',
    'level-curriculum',
    'groups',
  ],
  employee: [
    'lms-dashboard',
    'courses',
    'notifications',
    'observance-sheet',
    'reports',
    'level-curriculum',
    'groups',
  ],
};

const fallbackLinkPermissions: Record<string, Record<string, string[]>> = {
  admin: {
    'lms-dashboard': ['Admin Dashboard', 'Team Leader Dashboard', 'User Dashboard'],
    'courses': ['Courses', 'Create Course', 'Enrollments'],
    'User Managements': ['Department Wise Training', 'Level Wise Sheet'],
    'notifications': ['Notification', 'Approval List'],
    'observance-sheet': ['Retraining', 'Level Assessment','Competency Dashboard'],
    'reports': ['Course Reports', 'Employee Reports', 'Training Report', 'Certificate', 'Courses'],
    'level-curriculum': ['Lesson Materials', 'Question Paper Settings','AI Chat Bot','AI Assistant'],
    'process-dojo': ['User Id Registration', 'Department Wise Training'],
    'planning': ['Schedule', 'Plan', 'Plan List','TNI'],
    'analytics': ['Analytics Graph', 'Analytics Table'],
    'master-employee': ['User Table', 'Employee History Card'],
    'schedules': ['Multiskill Schedule', 'TNI'],
    'skill-matrix': ['Skill Matrix'],
    'ar-vr': ['AR/VR Experience', 'Animations'],
    'settings': ['List', 'Core Configuration'],
    'method': ['Method Settings','Hierarchy'],
    'groups':['Groups','Group Creation'],
  },
  'team-leader': {
    'lms-dashboard': ['Team Leader Dashboard'],
    'courses': ['Courses', 'Enrolments'],
    'User Managements': ['Department Wise Training', 'Level Wise Sheet'],
    'notifications': ['Notification'],
    'observance-sheet': ['Level Assessment'],
    'reports': ['Course Reports', 'Training Report'],
    'level-curriculum': ['Lesson Materials','AI Chat Bot','AI Assistant'],
    'groups':['Groups','Group Creation'],
  },
  employee: {
    'lms-dashboard': ['User Dashboard'],
    'courses': ['Courses'],
    'groups':['Groups'],
    'notifications': ['Notification'],
    'observance-sheet': ['Level Assessment'],
    'reports': ['Certificate'],
    'level-curriculum': ['Lesson Materials','AI Chat Bot','AI Assistant'],
  },
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
  Boolean(access?.view || access?.manage || access?.create || access?.update);

export function hasModuleAccess(user: AppUser, moduleSlug: string) {
  const roleName = String(user?.role || '').toLowerCase();
  if (roleName === 'admin') {
    return true;
  }

  const normalizedSlug = normalizeModuleSlug(moduleSlug);
  if (user?.permissions) {
    return canUseAccess(user.permissions[normalizedSlug]);
  }
  if (normalizedSlug === 'team_leader_dashboard') {
    return roleName === 'team-leader';
  }
  if (normalizedSlug === 'employee_dashboard') {
    return roleName === 'employee';
  }
  return false;
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
  return resolveDashboardRoute(user);
}

export const rolePermissions = fallbackRolePermissions;
export const linkPermissions = fallbackLinkPermissions;

export function canAccessTile(user: AppUser, tileId: string) {
  const moduleSlug = tileToModuleMap[tileId];
  if (Array.isArray(moduleSlug)) {
    if (user?.permissions) {
      return hasAnyModuleAccess(user, moduleSlug);
    }
  } else if (user?.permissions && moduleSlug && user.permissions[normalizeModuleSlug(moduleSlug)]) {
    const access = user.permissions[normalizeModuleSlug(moduleSlug)];
    return canUseAccess(access);
  }

  const fallback = user?.role ? fallbackRolePermissions[user.role] : undefined;
  if (fallback === 'ALL') {
    return true;
  }
  return Array.isArray(fallback) ? fallback.includes(tileId) : false;
}

export function getAllowedLinksForTile<T extends { name: string }>(
  user: AppUser,
  tileId: string,
  links: T[],
): T[] {
  if (user?.permissions) {
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

  const fallback = user?.role ? fallbackLinkPermissions[user.role]?.[tileId] : undefined;
  if (!fallback) {
    return [];
  }
  return links.filter((link) => fallback.includes(link.name));
}
