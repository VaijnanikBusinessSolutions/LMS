from django.db import migrations, models


RBAC_MODULES = [
    ('dashboard', 'Dashboard', 'Dashboards and summary widgets'),
    ('users', 'Users', 'User provisioning and account lifecycle'),
    ('roles', 'Roles', 'Role creation and permission governance'),
    ('courses', 'Courses', 'Course catalog and assignments'),
    ('groups', 'Groups', 'LMS groups and memberships'),
    ('reports', 'Reports', 'Operational and LMS reports'),
    ('notifications', 'Notifications', 'Alerts, inbox, and broadcasts'),
    ('planning', 'Planning', 'Training plans and schedules'),
    ('method', 'Method', 'Method settings and hierarchy management'),
    ('skill_matrix', 'Skill Matrix', 'Skill matrix setup and analytics'),
    ('assessments', 'Assessments', 'Tests, evaluations, and scoring'),
    ('ai_tools', 'AI Tools', 'AI-powered authoring and assistants'),
]

RBAC_ACTIONS = ['view', 'create', 'update', 'delete', 'approve', 'export', 'manage']


def forwards(apps, schema_editor):
    Role = apps.get_model('app1', 'Role')
    PermissionModule = apps.get_model('app1', 'PermissionModule')
    RoleModulePermission = apps.get_model('app1', 'RoleModulePermission')
    Permission = apps.get_model('auth', 'Permission')
    ContentType = apps.get_model('contenttypes', 'ContentType')

    content_type = ContentType.objects.get(app_label='app1', model='permissionmodule')

    module_slug_map = {}
    for slug, name, description in RBAC_MODULES:
        module, _ = PermissionModule.objects.get_or_create(
            slug=slug.replace('_', '-'),
            defaults={
                'name': name,
                'description': description,
                'sort_order': len(module_slug_map) + 1,
                'is_active': True,
            },
        )
        module_slug_map[module.slug] = slug

    permission_ids_by_codename = {}
    for slug, name, _ in RBAC_MODULES:
        for action in RBAC_ACTIONS:
            codename = f'{action}_{slug}'
            permission, _ = Permission.objects.get_or_create(
                content_type=content_type,
                codename=codename,
                defaults={'name': f'Can {action} {name}'},
            )
            permission_ids_by_codename[codename] = permission.id

    for role in Role.objects.all():
        permission_ids = []
        for mapping in RoleModulePermission.objects.filter(role=role).select_related('module'):
            normalized_slug = module_slug_map.get(mapping.module.slug, mapping.module.slug.replace('-', '_'))
            action_map = {
                'view': mapping.can_view,
                'create': mapping.can_create,
                'update': mapping.can_update,
                'delete': mapping.can_delete,
                'approve': mapping.can_approve,
                'export': mapping.can_export,
                'manage': mapping.can_manage,
            }
            for action, enabled in action_map.items():
                if enabled:
                    permission_ids.append(permission_ids_by_codename[f'{action}_{normalized_slug}'])
        if permission_ids:
            role.permissions.add(*permission_ids)


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0154_permissionmodule_rolemodulepermission'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='permissions',
            field=models.ManyToManyField(blank=True, related_name='rbac_roles', to='auth.permission'),
        ),
        migrations.RunPython(forwards, migrations.RunPython.noop),
    ]
