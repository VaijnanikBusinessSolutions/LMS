// src/constants/permissions.ts

export const rolePermissions = {
  admin: 'ALL', // admin can see everything
  'team-leader': [
    'lms-dashboard',
    'courses',
    'User Managements',
    'notifications',
    'observance-sheet',
    'reports',
    'level-curriculum',
    'groups',
    // add more tile IDs as needed
  ],
  employee: [
    'lms-dashboard',
    'courses',
    'notifications',
    'observance-sheet',
    'reports',
    'level-curriculum',
    'groups'    // add more tile IDs as needed
  ],
};

// (Optional) If you want to restrict links inside tiles, add this:
export const linkPermissions = {
  'admin': {
    'lms-dashboard': ['Admin Dashboard', 'Management Review Dashboard', 'Advanced Manpower Planning'], // Excluded 'Employee Dashboard'
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
    'groups':['Groups','Group Creation']
  },
  
  'team-leader': {
    'lms-dashboard': ['Dashboard', 'Notification', 'Level Assessment'],
    'courses': ['Courses', 'Enrolments'],
    'User Managements': ['Department Wise Training', 'Level Wise Sheet'],
    'notifications': ['Notification'],
    'observance-sheet': ['Level Assessment'],
    'reports': ['Course Reports', 'Training Report'],
    'level-curriculum': ['Lesson Materials','AI Chat Bot','AI Assistant'],
    'groups':['Groups','Group Creation']
  },
  'employee': {
    'lms-dashboard': ['Dashboard', 'Level Assessment'],
    'courses': ['Courses'],
    'groups':['Groups'],
    // 'User Managements': ['Group Creation'],
    'notifications': ['Notification'],
    'observance-sheet': ['Level Assessment'],
    'reports': ['Certificate'],
    'level-curriculum': ['Lesson Materials','AI Chat Bot','AI Assistant'],
  },
};