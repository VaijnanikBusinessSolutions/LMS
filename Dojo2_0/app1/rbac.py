from collections import OrderedDict


RBAC_MODULES = OrderedDict(
    [
        (
            'admin_dashboard',
            {
                'name': 'Admin Dashboard',
                'description': 'Administrative dashboard for platform-wide controls, audit widgets, and system oversight.',
                'category': 'Analytics',
                'features': ['Admin dashboard', 'Platform controls', 'System overview'],
            },
        ),
        (
            'team_leader_dashboard',
            {
                'name': 'Team Leader Dashboard',
                'description': 'Supervisor dashboard for approvals, handover visibility, and team monitoring.',
                'category': 'Analytics',
                'features': ['Supervisor dashboard', 'Team monitoring', 'Approval visibility'],
            },
        ),
        (
            'employee_dashboard',
            {
                'name': 'User Dashboard',
                'description': 'User learning dashboard for assigned courses, progress tracking, and self-service training.',
                'category': 'Analytics',
                'features': ['User dashboard', 'Learning progress', 'Assigned training'],
            },
        ),
        (
            'users',
            {
                'name': 'Users',
                'description': 'User provisioning, employee onboarding, bulk import, and account lifecycle.',
                'category': 'Administration',
                'features': ['User access control', 'Bulk employee upload', 'Account lifecycle'],
            },
        ),
        (
            'user_registration',
            {
                'name': 'User Registration',
                'display_name': 'Registration',
                'description': 'Access for the Registration card and registration page used for onboarding users.',
                'category': 'Administration',
                'features': ['Registration', 'User ID Registration', 'Onboarding form'],
            },
        ),
        (
            'user_creation',
            {
                'name': 'User Creation',
                'description': 'Dedicated access for the create-user icon and add user page.',
                'category': 'Administration',
                'features': ['User creation icon', 'Create user page', 'Account creation'],
            },
        ),
        (
            'user_table',
            {
                'name': 'User Table',
                'description': 'User table and user listing visibility for employee and account records.',
                'category': 'Administration',
                'features': ['User table icon', 'User table page', 'User listing'],
            },
        ),
        (
            'employee_history_card',
            {
                'name': 'Employee History Card',
                'description': 'Employee history card and past employee learning history access.',
                'category': 'Administration',
                'features': ['Employee history card icon', 'History page', 'Employee details'],
            },
        ),
        (
            'level_wise_sheet',
            {
                'name': 'Level Wise Sheet',
                'description': 'Level-wise sheet and assessment sheet views from the UI cards.',
                'category': 'Administration',
                'features': ['Level wise sheet icon', 'Assessment table', 'Analysis sheet'],
            },
        ),
        (
            'roles',
            {
                'name': 'Roles',
                'description': 'Role creation, permission governance, and RBAC administration.',
                'category': 'Administration',
                'features': ['Role management', 'Permission matrix', 'Access governance'],
            },
        ),
        (
            'courses',
            {
                'name': 'Courses',
                'description': 'Course catalog, lesson materials, enrollments, and training content delivery.',
                'category': 'LMS',
                'features': ['Learning access', 'Training content delivery', 'Lesson materials'],
            },
        ),
        (
            'course_catalog',
            {
                'name': 'Courses Catalog',
                'display_name': 'Courses',
                'description': 'Access for the Courses card and course learning pages.',
                'category': 'LMS',
                'features': ['Courses', 'Course catalog', 'Learning pages'],
            },
        ),
        (
            'create_course',
            {
                'name': 'Create Course',
                'description': 'Create Course icon access for course authoring and LMS course setup pages.',
                'category': 'LMS',
                'features': ['Create Course icon', 'Course list', 'Course content manager'],
            },
        ),
        (
            'enrollments',
            {
                'name': 'Enrollments',
                'description': 'Enrollment management access for assigning courses and reviewing active enrollments.',
                'category': 'LMS',
                'features': ['Enrollments icon', 'Enrollment page', 'Course assignment'],
            },
        ),
        (
            'groups',
            {
                'name': 'Groups',
                'description': 'LMS groups, team structures, and course/group assignments.',
                'category': 'LMS',
                'features': ['Group access', 'Team structure', 'Assignments'],
            },
        ),
        (
            'group_creation',
            {
                'name': 'Group Creation',
                'description': 'Group Creation icon access for creating and editing LMS groups.',
                'category': 'LMS',
                'features': ['Group creation icon', 'Create group page', 'Edit group page'],
            },
        ),
        (
            'groups_directory',
            {
                'name': 'Groups Directory',
                'description': 'Groups icon access for listing groups and viewing group details.',
                'category': 'LMS',
                'features': ['Groups icon', 'Groups list', 'Group detail view'],
            },
        ),
        (
            'reports',
            {
                'name': 'Reports',
                'description': 'Operational, employee, course, certificate, and compliance reporting.',
                'category': 'Analytics',
                'features': ['Reporting access', 'Insights', 'Compliance exports'],
            },
        ),
        (
            'course_reports',
            {
                'name': 'Course Reports',
                'description': 'Course Reports icon access for LMS course reporting and growth analysis.',
                'category': 'Analytics',
                'features': ['Course reports icon', 'Course report page', 'Growth reports'],
            },
        ),
        (
            'employee_reports',
            {
                'name': 'Employee Reports',
                'description': 'Employee Reports icon access for employee-oriented reporting screens.',
                'category': 'Analytics',
                'features': ['Employee reports icon', 'Employee reports page', 'Employee report detail'],
            },
        ),
        (
            'certificate',
            {
                'name': 'Certificate',
                'description': 'Certificate icon access for learner certificates and certificate home pages.',
                'category': 'Analytics',
                'features': ['Certificate icon', 'Certificate home', 'Course certificate'],
            },
        ),
        (
            'notifications',
            {
                'name': 'Notifications',
                'description': 'Alerts, broadcasts, inbox items, and approval-related communication.',
                'category': 'Communication',
                'features': ['Alerts', 'Read status', 'System messages'],
            },
        ),
        (
            'notifications_page',
            {
                'name': 'Notifications Inbox',
                'display_name': 'Notification',
                'description': 'Access for the Notification card and LMS notification inbox.',
                'category': 'Communication',
                'features': ['Notification', 'Notifications page', 'Inbox access'],
            },
        ),
        (
            'planning',
            {
                'name': 'Planning',
                'description': 'Training calendars, schedules, TNI, and planning workflows.',
                'category': 'Operations',
                'features': ['Planning access', 'Training batches', 'Workflow control'],
            },
        ),
        (
            'schedule',
            {
                'name': 'Schedule',
                'description': 'Schedule icon access for training calendar and schedule planner pages.',
                'category': 'Operations',
                'features': ['Schedule icon', 'Training calendar', 'Planner access'],
            },
        ),
        (
            'tni',
            {
                'name': 'TNI',
                'description': 'TNI icon access for training needs and refreshment planning pages.',
                'category': 'Operations',
                'features': ['TNI icon', 'Refreshment page', 'Training needs'],
            },
        ),
        (
            'multiskill_schedule',
            {
                'name': 'Multiskill Schedule',
                'description': 'Multiskill Schedule icon access for scheduling in the multiskilling module.',
                'category': 'Operations',
                'features': ['Multiskill schedule icon', 'Scheduling page', 'Skill schedules'],
            },
        ),
        (
            'core_configuration',
            {
                'name': 'Core Configuration',
                'description': 'Core Configuration icon access for system planning and global configuration pages.',
                'category': 'Operations',
                'features': ['Core configuration icon', 'Planning page', 'System configuration'],
            },
        ),
        (
            'method',
            {
                'name': 'Method',
                'description': 'Method settings, organization hierarchy, and process structure management.',
                'category': 'Operations',
                'features': ['Method control', 'Hierarchy setup', 'Configuration access'],
            },
        ),
        (
            'method_settings',
            {
                'name': 'Method Settings',
                'description': 'Method Settings icon access for process method configuration screens.',
                'category': 'Operations',
                'features': ['Method Settings icon', 'Method settings page', 'Configuration'],
            },
        ),
        (
            'hierarchy',
            {
                'name': 'Hierarchy',
                'description': 'Hierarchy icon access for organization structure and hierarchy setup pages.',
                'category': 'Operations',
                'features': ['Hierarchy icon', 'Organization setup', 'Structure management'],
            },
        ),
        (
            'skill_matrix',
            {
                'name': 'Skill Matrix',
                'description': 'Skill matrix setup, competency mapping, multiskilling, and gap analysis.',
                'category': 'Capability',
                'features': ['Skill matrix', 'Competency matrix', 'Gap analysis'],
            },
        ),
        (
            'assessments',
            {
                'name': 'Assessments',
                'description': 'Tests, evaluations, OJT, retraining, and competency scoring.',
                'category': 'Capability',
                'features': ['Assessment access', 'OJT', 'Competency scoring'],
            },
        ),
        (
            'level_assessment',
            {
                'name': 'Level Assessment',
                'description': 'Level Assessment icon access for competency and level assessment screens.',
                'category': 'Capability',
                'features': ['Level Assessment icon', 'Competency system', 'Assessment page'],
            },
        ),
        (
            'competency_dashboard',
            {
                'name': 'Competency Dashboard',
                'description': 'Competency Dashboard icon access for competency matrix and dashboard views.',
                'category': 'Capability',
                'features': ['Competency dashboard icon', 'Competency dashboard', 'Matrix overview'],
            },
        ),
        (
            'lesson_materials',
            {
                'name': 'Lesson Materials',
                'description': 'Lesson Materials icon access for learning documents and lesson attachments.',
                'category': 'LMS',
                'features': ['Lesson materials icon', 'Documents page', 'Attachments'],
            },
        ),
        (
            'ai_tools',
            {
                'name': 'AI Tools',
                'description': 'AI assistant, chatbot, and AI-powered content features.',
                'category': 'Innovation',
                'features': ['AI access', 'Content tools', 'Assistant features'],
            },
        ),
        (
            'ai_chat_bot',
            {
                'name': 'AI Chat Bot',
                'description': 'AI Chat Bot icon access for the AI features assistant experience.',
                'category': 'Innovation',
                'features': ['AI Chat Bot icon', 'AI features page', 'Chat experience'],
            },
        ),
        (
            'ai_assistant',
            {
                'name': 'AI Assistant',
                'description': 'AI Assistant icon access for the standalone AI assistant page.',
                'category': 'Innovation',
                'features': ['AI Assistant icon', 'Assistant page', 'AI helper'],
            },
        ),
        (
            'ar_vr_experience',
            {
                'name': 'AR/VR Experience',
                'description': 'AR/VR Experience icon access for immersive media screens.',
                'category': 'Innovation',
                'features': ['AR/VR icon', 'AR/VR page', 'Immersive content'],
            },
        ),
        (
            'animations',
            {
                'name': 'Animations',
                'description': 'Animations icon access for video materials and animation content pages.',
                'category': 'Innovation',
                'features': ['Animations icon', 'Materials page', 'Media library'],
            },
        ),
    ]
)

RBAC_ACTIONS = OrderedDict(
    [
        ('view', 'View'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('approve', 'Approve'),
        ('export', 'Export'),
        ('manage', 'Manage'),
    ]
)

RBAC_MODULE_INHERITANCE = {
    'users': [
        'user_registration',
        'user_creation',
        'user_table',
        'employee_history_card',
        'level_wise_sheet',
    ],
    'courses': [
        'course_catalog',
        'create_course',
        'enrollments',
        'lesson_materials',
    ],
    'groups': [
        'group_creation',
        'groups_directory',
        'enrollments',
    ],
    'reports': [
        'course_reports',
        'employee_reports',
        'certificate',
    ],
    'notifications': [
        'notifications_page',
    ],
    'planning': [
        'schedule',
        'tni',
        'multiskill_schedule',
        'core_configuration',
    ],
    'method': [
        'method_settings',
        'hierarchy',
    ],
    'assessments': [
        'level_assessment',
        'competency_dashboard',
    ],
    'ai_tools': [
        'ai_chat_bot',
        'ai_assistant',
        'ar_vr_experience',
        'animations',
    ],
}


def normalize_module_slug(module_slug):
    return (module_slug or '').replace('-', '_').strip().lower()


def normalize_action(action):
    action_map = {
        'list': 'view',
        'retrieve': 'view',
        'read': 'view',
        'partial_update': 'update',
        'edit': 'update',
    }
    normalized = action_map.get(action, action)
    return normalized if normalized in RBAC_ACTIONS else 'view'


def build_permission_codename(module_slug, action):
    return f'{normalize_action(action)}_{normalize_module_slug(module_slug)}'


def permission_label(module_slug, action):
    module = RBAC_MODULES[normalize_module_slug(module_slug)]
    return f"Can {RBAC_ACTIONS[normalize_action(action)].lower()} {module['name']}"


def inherited_parent_modules(module_slug):
    normalized_slug = normalize_module_slug(module_slug)
    return [
        parent_slug
        for parent_slug, children in RBAC_MODULE_INHERITANCE.items()
        if normalized_slug in children
    ]
