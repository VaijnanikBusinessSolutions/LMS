from collections import OrderedDict


RBAC_MODULES = OrderedDict(
    [
        (
            'dashboard',
            {
                'name': 'Dashboard',
                'description': 'Dashboards, management review charts, manpower visuals, and KPI summaries.',
                'category': 'Analytics',
                'features': ['Admin dashboard', 'Management review dashboard', 'Live KPI charts'],
            },
        ),
        (
            'users',
            {
                'name': 'Users',
                'description': 'User provisioning, employee onboarding, bulk import, and account lifecycle.',
                'category': 'Administration',
                'features': ['User creation', 'Bulk employee upload', 'User table'],
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
                'features': ['Courses', 'Course creation', 'Lesson materials'],
            },
        ),
        (
            'groups',
            {
                'name': 'Groups',
                'description': 'LMS groups, team structures, and course/group assignments.',
                'category': 'LMS',
                'features': ['Group creation', 'Enrollments', 'Team structure'],
            },
        ),
        (
            'reports',
            {
                'name': 'Reports',
                'description': 'Operational, employee, course, certificate, and compliance reporting.',
                'category': 'Analytics',
                'features': ['Employee reports', 'Course reports', 'Certificates'],
            },
        ),
        (
            'notifications',
            {
                'name': 'Notifications',
                'description': 'Alerts, broadcasts, inbox items, and approval-related communication.',
                'category': 'Communication',
                'features': ['Notifications', 'Read status', 'System alerts'],
            },
        ),
        (
            'planning',
            {
                'name': 'Planning',
                'description': 'Training calendars, schedules, TNI, and planning workflows.',
                'category': 'Operations',
                'features': ['Schedule', 'Planning', 'Training batches'],
            },
        ),
        (
            'method',
            {
                'name': 'Method',
                'description': 'Method settings, organization hierarchy, and process structure management.',
                'category': 'Operations',
                'features': ['Method settings', 'Hierarchy setup', 'Core configuration'],
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
                'features': ['Level assessment', 'OJT', 'Refresher exam'],
            },
        ),
        (
            'ai_tools',
            {
                'name': 'AI Tools',
                'description': 'AI assistant, chatbot, and AI-powered content features.',
                'category': 'Innovation',
                'features': ['AI chatbot', 'AI assistant', 'AI content tools'],
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
