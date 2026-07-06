import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  Search,
  Shield,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { normalizeListResponse } from '../../../utils/api';
import { tiles } from '../../constants/tileData';

type AvailablePermission = {
  id: number;
  codename: string;
  name: string;
};

type PermissionModule = {
  id: number;
  slug: string;
  name: string;
  display_name?: string;
  description: string;
  category?: string;
  features?: string[];
  available_permissions: AvailablePermission[];
};

type RolePermissionRow = {
  module_slug: string;
  module_name: string;
  view?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  approve?: boolean;
  export?: boolean;
  manage?: boolean;
};

type Role = {
  id: number;
  name: string;
  is_active: boolean;
  permissions: RolePermissionRow[];
  user_count?: number;
};

type ModulePresentation = {
  label: string;
  Icon: LucideIcon;
  groupLabel: string;
};

const ACTIONS = ['view', 'create', 'update', 'delete', 'approve', 'export', 'manage'] as const;

const BASE_MODULE_SLUGS = new Set([
  'users',
  'courses',
  'groups',
  'reports',
  'notifications',
  'planning',
  'method',
  'assessments',
  'ai-tools',
  'roles',
]);

const HIDDEN_ROLE_MANAGEMENT_MODULE_SLUGS = new Set([
  'user_creation',
]);

const CATEGORY_STYLES: Record<string, string> = {
  Administration: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25',
  Courses: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/25',
  LMS: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/25',
  Analytics: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/25',
  Communication: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/25',
  Operations: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25',
  Capability: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25',
  Innovation: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/15 dark:text-fuchsia-300 dark:border-fuchsia-500/25',
  General: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/25',
};

const ACTION_STYLES: Record<(typeof ACTIONS)[number], string> = {
  view: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/25',
  create: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25',
  update: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25',
  delete: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25',
  approve: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/25',
  export: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/25',
  manage: 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-400/15 dark:text-slate-200 dark:border-slate-400/25',
};

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const MODULE_ICON_SOURCE: Record<string, { linkName?: string; tileTitle?: string; label?: string }> = {
  admin_dashboard: { linkName: 'Admin Dashboard' },
  team_leader_dashboard: { linkName: 'Team Leader Dashboard' },
  employee_dashboard: { linkName: 'User Dashboard', label: 'User Dashboard' },
  user_registration: { linkName: 'User Id Registration', label: 'Registration' },
  user_creation: { linkName: 'User Creation' },
  user_table: { linkName: 'User Table' },
  employee_history_card: { linkName: 'Employee History Card' },
  level_wise_sheet: { linkName: 'Level Wise Sheet' },
  roles: { tileTitle: 'Settings', label: 'Role Management' },
  users: { tileTitle: 'Master Employee', label: 'Users' },
  courses: { tileTitle: 'Courses', label: 'Courses' },
  course_catalog: { linkName: 'Courses', label: 'Courses' },
  create_course: { linkName: 'Create Course' },
  enrollments: { linkName: 'Enrollments' },
  groups: { tileTitle: 'Groups', label: 'Groups' },
  group_creation: { linkName: 'Group Creation' },
  groups_directory: { linkName: 'Groups', label: 'Groups' },
  reports: { tileTitle: 'Reports', label: 'Reports' },
  course_reports: { linkName: 'Course Reports' },
  employee_reports: { linkName: 'Employee Reports' },
  certificate: { linkName: 'Certificate' },
  notifications: { tileTitle: 'Notifications', label: 'Notifications' },
  notifications_page: { linkName: 'Notification', label: 'Notification' },
  planning: { tileTitle: 'Planning', label: 'Planning' },
  schedule: { linkName: 'Schedule' },
  tni: { linkName: 'TNI' },
  multiskill_schedule: { linkName: 'Multiskill Schedule' },
  core_configuration: { linkName: 'Core Configuration' },
  method: { tileTitle: 'Method', label: 'Method' },
  method_settings: { linkName: 'Method Settings' },
  hierarchy: { linkName: 'Hierarchy' },
  skill_matrix: { linkName: 'Skill Matrix' },
  assessments: { tileTitle: 'Level Assessment', label: 'Assessments' },
  level_assessment: { linkName: 'Level Assessment' },
  competency_dashboard: { linkName: 'Competency Dashboard' },
  lesson_materials: { linkName: 'Lesson Materials' },
  ai_tools: { tileTitle: 'Knowledge Center', label: 'AI Tools' },
  ai_chat_bot: { linkName: 'AI Chat Bot' },
  ai_assistant: { linkName: 'AI Assistant' },
  ar_vr_experience: { linkName: 'AR/VR Experience' },
  animations: { linkName: 'Animations' },
};

const ROLE_MANAGEMENT_CATEGORY_OVERRIDES: Record<string, string> = {
  courses: 'Courses',
  course_catalog: 'Courses',
  create_course: 'Courses',
  enrollments: 'Courses',
};

const formatActionLabel = (action: (typeof ACTIONS)[number]) =>
  action === 'update' ? 'Edit' : action === 'manage' ? 'Full control' : action;

const RoleManagement = () => {
  const auth = useMemo(() => JSON.parse(localStorage.getItem('auth') || '{}'), []);
  const token = auth?.accessToken;

  const [roleName, setRoleName] = useState('');
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBasePermissions, setShowBasePermissions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
  const [loadingRoleId, setLoadingRoleId] = useState<number | null>(null);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token],
  );

  const clearRoleSelection = () => {
    setSelectedRoleId(null);
    setSelectedRole(null);
    setIsViewModalOpen(false);
  };

  const resetRoleForm = () => {
    setEditingRoleId(null);
    setRoleName('');
    setSelectedPermissionIds([]);
  };

  const fetchData = async () => {
    if (!token) {
      setError('Please log in again to manage roles.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [roleResponse, moduleResponse] = await Promise.all([
        api.get('/roles/', { headers }),
        api.get('/permission-modules/', { headers }),
      ]);

      const nextRoles = normalizeListResponse<Role>(roleResponse.data);
      const nextModules = normalizeListResponse<PermissionModule>(moduleResponse.data);

      setRoles(nextRoles);
      setModules(nextModules);
      if (selectedRoleId) {
        const refreshedSelectedRole = nextRoles.find((role) => role.id === selectedRoleId) || null;
        setSelectedRole(refreshedSelectedRole);
      }
    } catch (requestError) {
      console.error(requestError);
      setError('Failed to load roles and permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const getModulePermissionMap = (module: PermissionModule) =>
    ACTIONS.reduce<Partial<Record<(typeof ACTIONS)[number], AvailablePermission>>>((accumulator, action) => {
      const permission = module.available_permissions.find(
        (item) => item.codename === `${action}_${module.slug.replace(/-/g, '_')}`,
      );

      if (permission) {
        accumulator[action] = permission;
      }

      return accumulator;
    }, {});

  const fetchRoleDetail = async (roleId: number, options?: { editMode?: boolean }) => {
    if (!token) {
      setError('Please log in again to manage roles.');
      return null;
    }

    setError('');
    setLoadingRoleId(roleId);

    try {
      const response = await api.get(`/roles/${roleId}/`, { headers });
      const roleDetail = response.data as Role;

      setSelectedRoleId(roleId);
      setSelectedRole(roleDetail);

      if (options?.editMode) {
        setEditingRoleId(roleId);
        setIsViewModalOpen(false);
      } else {
        setEditingRoleId(null);
        setRoleName('');
        setSelectedPermissionIds([]);
        setIsViewModalOpen(true);
      }

      return roleDetail;
    } catch (requestError: any) {
      console.error(requestError);
      const responseData = requestError.response?.data;
      const message =
        responseData?.detail ||
        Object.values(responseData || {}).flat().join(' ') ||
        'Unable to load role details.';
      setError(message);
      return null;
    } finally {
      setLoadingRoleId(null);
    }
  };

  const submitRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!roleName.trim()) {
      setError('Role name is required.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: roleName.trim(),
        is_active: true,
        permission_ids: selectedPermissionIds,
      };

      const response = editingRoleId
        ? await api.patch(`/roles/${editingRoleId}/`, payload, { headers })
        : await api.post('/roles/', payload, { headers });

      setSuccess(
        editingRoleId
          ? `Role "${response.data.name}" updated successfully.`
          : `Role "${response.data.name}" created successfully.`,
      );
      resetRoleForm();
      clearRoleSelection();
      await fetchData();
    } catch (requestError: any) {
      console.error(requestError);
      const message =
        requestError.response?.data?.detail ||
        Object.values(requestError.response?.data || {}).flat().join(' ') ||
        'Unable to create role.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (role: Role) => {
    if (!token) {
      setError('Please log in again to manage roles.');
      return;
    }

    const confirmed = window.confirm(
      (role.user_count || 0) > 0
        ? `Delete role "${role.name}"? ${role.user_count} assigned user${role.user_count === 1 ? '' : 's'} will also be deleted.`
        : `Delete role "${role.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');
    setDeletingRoleId(role.id);

    try {
      const response = await api.delete(`/roles/${role.id}/`, { headers });

      if (selectedRoleId === role.id) {
        clearRoleSelection();
        resetRoleForm();
      }

      setSuccess(response.data?.detail || `Role "${role.name}" deleted successfully.`);
      await fetchData();
    } catch (requestError: any) {
      console.error(requestError);
      const responseData = requestError.response?.data;
      const message =
        responseData?.detail ||
        Object.values(responseData || {}).flat().join(' ') ||
        'Unable to delete role.';
      setError(message);
    } finally {
      setDeletingRoleId(null);
    }
  };

  const roleManagementModules = useMemo(
    () =>
      modules.filter(
        (module) => !HIDDEN_ROLE_MANAGEMENT_MODULE_SLUGS.has(module.slug.replace(/-/g, '_')),
      ),
    [modules],
  );

  useEffect(() => {
    if (!editingRoleId || !selectedRole || modules.length === 0) {
      if (!editingRoleId) {
        setRoleName('');
        setSelectedPermissionIds([]);
      }
      return;
    }

    const nextPermissionIds: number[] = [];

    modules.forEach((module) => {
      const rolePermissionRow = selectedRole.permissions.find(
        (permission) => permission.module_slug === module.slug.replace(/-/g, '_'),
      );

      if (!rolePermissionRow) return;

      module.available_permissions.forEach((permission) => {
        const matchingAction = ACTIONS.find(
          (action) => permission.codename === `${action}_${module.slug.replace(/-/g, '_')}`,
        );

        if (matchingAction && rolePermissionRow[matchingAction]) {
          nextPermissionIds.push(permission.id);
        }
      });
    });

    setRoleName(selectedRole.name);
    setSelectedPermissionIds(nextPermissionIds);
  }, [selectedRole, editingRoleId, modules]);

  const roleActionCounts = useMemo(() => {
    return roles.reduce<Record<number, number>>((accumulator, role) => {
      accumulator[role.id] = role.permissions.reduce(
        (total, permission) => total + ACTIONS.filter((action) => permission[action]).length,
        0,
      );
      return accumulator;
    }, {});
  }, [roles]);

  const displayedSelectedRolePermissions = useMemo(
    () =>
      selectedRole?.permissions.filter(
        (permission) =>
          !HIDDEN_ROLE_MANAGEMENT_MODULE_SLUGS.has(permission.module_slug.replace(/-/g, '_')),
      ) || [],
    [selectedRole],
  );

  const selectedRoleValues = useMemo(() => {
    if (!selectedRole) return [];

    return ACTIONS.map((action) => ({
      action,
      count: displayedSelectedRolePermissions.filter((permission) => permission[action]).length,
    })).filter((item) => item.count > 0);
  }, [displayedSelectedRolePermissions, selectedRole]);

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const modulePresentations = useMemo(() => {
    const tileLinks = tiles.flatMap((tile) =>
      tile.links.map((link) => ({
        ...link,
        tileTitle: tile.title,
        tileIcon: tile.icon,
      })),
    );

    const byLinkName = new Map(tileLinks.map((link) => [link.name, link]));
    const byTileTitle = new Map(tiles.map((tile) => [tile.title, tile]));

    return roleManagementModules.reduce<Record<string, ModulePresentation>>((accumulator, module) => {
      const key = module.slug.replace(/-/g, '_');
      const source = MODULE_ICON_SOURCE[key];
      const linkedItem = source?.linkName ? byLinkName.get(source.linkName) : undefined;
      const parentTile = source?.tileTitle ? byTileTitle.get(source.tileTitle) : undefined;
      const Icon = linkedItem?.icon || parentTile?.icon || Shield;

      accumulator[key] = {
        label: source?.label || linkedItem?.name || module.display_name || module.name,
        Icon,
        groupLabel: linkedItem?.tileTitle || parentTile?.title || module.category || 'General',
      };

      return accumulator;
    }, {});
  }, [roleManagementModules]);

  const groupedModules = useMemo(() => {
    const groups = roleManagementModules.reduce<Record<string, PermissionModule[]>>((accumulator, module) => {
      const moduleKey = module.slug.replace(/-/g, '_');
      const category = ROLE_MANAGEMENT_CATEGORY_OVERRIDES[moduleKey] || module.category || 'General';
      accumulator[category] = accumulator[category] || [];
      accumulator[category].push(module);
      return accumulator;
    }, {});

    return Object.entries(groups).sort(([left], [right]) => left.localeCompare(right));
  }, [roleManagementModules]);

  const matchesSearch = (module: PermissionModule) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const haystacks = [
      module.name,
      module.display_name,
      module.slug,
      module.description,
      ROLE_MANAGEMENT_CATEGORY_OVERRIDES[module.slug.replace(/-/g, '_')] || module.category,
      ...(module.features || []),
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    return haystacks.some((value) => value.includes(term));
  };

  const visibleGroupedModules = useMemo(
    () =>
      groupedModules
        .map(([category, categoryModules]) => [
          category,
          categoryModules.filter(
            (module) => !BASE_MODULE_SLUGS.has(module.slug) && matchesSearch(module),
          ),
        ] as const)
        .filter(([, categoryModules]) => categoryModules.length > 0),
    [groupedModules, searchTerm],
  );

  const baseModules = useMemo(
    () =>
      roleManagementModules.filter(
        (module) => BASE_MODULE_SLUGS.has(module.slug) && matchesSearch(module),
      ),
    [roleManagementModules, searchTerm],
  );

  const selectedCardCount = useMemo(
    () =>
      selectedPermissionIds.length
        ? roleManagementModules.filter((module) =>
            module.available_permissions.some((permission) =>
              selectedPermissionIds.includes(permission.id),
            ),
          ).length
        : 0,
    [roleManagementModules, selectedPermissionIds],
  );

  const selectedModulesByCategory = useMemo(() => {
    return groupedModules
      .map(([category, categoryModules]) => {
        const arrangedModules = categoryModules
          .map((module) => {
            const permissionMap = getModulePermissionMap(module);
            const enabledActions = ACTIONS.filter((action) => {
              const permissionId = permissionMap[action]?.id;
              return permissionId ? selectedPermissionIds.includes(permissionId) : false;
            });

            if (!enabledActions.length) {
              return null;
            }

            return {
              ...module,
              enabledActions,
            };
          })
          .filter(Boolean) as Array<PermissionModule & { enabledActions: (typeof ACTIONS)[number][] }>;

        return {
          category,
          modules: arrangedModules,
        };
      })
      .filter((group) => group.modules.length > 0);
  }, [groupedModules, selectedPermissionIds]);

  const enabledModuleCount = useMemo(
    () => selectedModulesByCategory.reduce((total, group) => total + group.modules.length, 0),
    [selectedModulesByCategory],
  );

  const functionalIconCount = useMemo(
    () =>
      roleManagementModules.filter((module) => {
        const key = module.slug.replace(/-/g, '_');
        return Boolean(MODULE_ICON_SOURCE[key]);
      }).length,
    [roleManagementModules],
  );

  return (
    <div className="min-h-full w-full bg-background px-3 py-3 text-text sm:px-4 lg:px-5">
      <div className="flex min-h-full w-full flex-col">
        <div className="mb-5 flex flex-col gap-4 rounded-[1.75rem] border border-border bg-surface px-5 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-text">Role-Based Access Control</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">
              Clean card-by-card permission control for what users actually see in the app.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:w-auto">
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Roles</div>
              <div className="mt-1 text-2xl font-black">{roles.length}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Cards</div>
              <div className="mt-1 text-2xl font-black">
                {roleManagementModules.length - baseModules.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Base</div>
              <div className="mt-1 text-2xl font-black">{baseModules.length}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Icons</div>
              <div className="mt-1 text-2xl font-black">{functionalIconCount}</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid flex-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-[1.75rem] border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-5 py-5 lg:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tight">
                    {editingRoleId ? 'Edit Role' : 'Create Role'}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    The main list below shows user-facing cards and pages. Advanced base permissions are tucked away separately.
                  </p>
                </div>
                {editingRoleId ? (
                  <button
                    type="button"
                    onClick={resetRoleForm}
                    className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-text transition hover:bg-background/80"
                  >
                    Fresh Role
                  </button>
                ) : null}
              </div>
            </div>

            <form onSubmit={submitRole} className="space-y-5 p-5 lg:p-6">
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <label htmlFor="role-name" className="mb-2 block text-sm font-medium text-text">
                  Role name
                </label>
                <input
                  id="role-name"
                  value={roleName}
                  onChange={(event) => setRoleName(event.target.value)}
                  placeholder="Example: HR, Management, Auditor"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <label htmlFor="permission-search" className="mb-2 block text-sm font-medium text-text">
                  Search cards / pages
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    id="permission-search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search registration, course, enrollments, reports..."
                    className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                    <div className="text-xs uppercase tracking-wide text-muted">Enabled values</div>
                    <div className="mt-2 text-2xl font-black text-text">{selectedPermissionIds.length}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                    <div className="text-xs uppercase tracking-wide text-muted">Accessible pages</div>
                    <div className="mt-2 text-2xl font-black text-text">{enabledModuleCount}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                    <div className="text-xs uppercase tracking-wide text-muted">Branches used</div>
                    <div className="mt-2 text-2xl font-black text-text">{selectedModulesByCategory.length}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                    <div className="text-xs uppercase tracking-wide text-muted">Functional icons</div>
                    <div className="mt-2 text-2xl font-black text-text">{functionalIconCount}</div>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface px-4 py-4">
                  <div className="text-sm font-semibold text-text">Icon-wise functionality</div>
                  <div className="mt-2 grid gap-2 text-sm text-muted md:grid-cols-4">
                    <div><span className="font-semibold text-text">Total icons:</span> {functionalIconCount} functional entries are mapped in the system</div>
                    <div><span className="font-semibold text-text">Each page:</span> shows its own icon, not only the parent card</div>
                    <div><span className="font-semibold text-text">Understandable labels:</span> icon names follow the actual functionality name</div>
                    <div><span className="font-semibold text-text">Branch-wise:</span> icons are still grouped under their branch for clarity</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {visibleGroupedModules.map(([category, categoryModules]) => (
                  <div key={category} className="rounded-2xl border border-border bg-background/60 p-4">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${CATEGORY_STYLES[category] || CATEGORY_STYLES.General}`}>
                        {category}
                      </span>
                      <span className="text-sm text-muted">{categoryModules.length} cards / pages in this branch</span>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      {categoryModules.map((module) => {
                        const permissionMap = getModulePermissionMap(module);
                        const presentation =
                          modulePresentations[module.slug.replace(/-/g, '_')] || {
                            label: module.display_name || module.name,
                            Icon: Shield,
                            groupLabel: category,
                          };
                        const enabledActions = ACTIONS.filter((action) => {
                          const permissionId = permissionMap[action]?.id;
                          return permissionId ? selectedPermissionIds.includes(permissionId) : false;
                        });

                        return (
                          <div key={module.id} className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-text">
                                  <presentation.Icon className="h-5 w-5" />
                                </div>
                                <div>
                                <div className="text-base font-bold text-text">{presentation.label}</div>
                                <div className="mt-1 text-sm text-muted">{module.description}</div>
                                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                                  Icon-based functionality
                                </div>
                                </div>
                              </div>
                              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted">
                                {enabledActions.length}/{Object.keys(permissionMap).length} enabled
                              </span>
                            </div>

                            {module.features?.length ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {module.features.slice(0, 3).map((feature) => (
                                  <span
                                    key={feature}
                                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <div className="mt-4 rounded-2xl border border-border bg-background/70 p-3">
                              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                                Permission Buttons
                              </div>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                              {ACTIONS.map((action) => {
                                const permission = permissionMap[action];

                                if (!permission) {
                                  return (
                                    <span
                                      key={action}
                                      className="flex min-h-[52px] items-center justify-center rounded-2xl border border-dashed border-border px-3 py-2 text-center text-xs font-medium text-muted/70"
                                    >
                                      {formatActionLabel(action)} unavailable
                                    </span>
                                  );
                                }

                                const isSelected = selectedPermissionIds.includes(permission.id);

                                return (
                                  <button
                                    key={action}
                                    type="button"
                                    onClick={() => togglePermission(permission.id)}
                                    className={`min-h-[52px] rounded-2xl border px-3 py-2 text-center text-xs font-bold uppercase tracking-wide transition ${
                                      isSelected
                                        ? `${ACTION_STYLES[action]} shadow-sm`
                                        : 'border-border bg-background text-muted hover:bg-background/80'
                                    }`}
                                  >
                                    {formatActionLabel(action)}
                                  </button>
                                );
                              })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!visibleGroupedModules.length ? (
                  <div className="rounded-2xl border border-border bg-background/60 px-4 py-10 text-center text-sm text-muted">
                    No cards or pages match your search.
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border bg-background/60">
                <button
                  type="button"
                  onClick={() => setShowBasePermissions((current) => !current)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <div>
                    <div className="text-sm font-semibold text-text">Advanced Base Permissions</div>
                    <div className="mt-1 text-xs text-muted">
                      Parent modules used for fallback access and technical grouping.
                    </div>
                  </div>
                  {showBasePermissions ? (
                    <ChevronUp className="h-4 w-4 text-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted" />
                  )}
                </button>

                {showBasePermissions ? (
                  <div className="border-t border-border px-4 py-4">
                    {baseModules.length ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {baseModules.map((module) => (
                        <div
                          key={module.id}
                          className="rounded-2xl border border-border bg-surface px-4 py-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-medium text-text">
                                {module.display_name || module.name}
                              </div>
                              <div className="mt-1 text-sm text-muted">
                                {module.description}
                              </div>
                            </div>
                            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                              Base
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {module.features?.slice(0, 3).map((feature) => (
                              <span
                                key={feature}
                                className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 rounded-2xl border border-border bg-background/70 p-3">
                            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                              Permission Buttons
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                            {ACTIONS.map((action) => {
                              const permission = module.available_permissions.find(
                                (item) =>
                                  item.codename === `${action}_${module.slug.replace(/-/g, '_')}`,
                              );

                              const isSelected = permission
                                  ? selectedPermissionIds.includes(permission.id)
                                  : false;

                              return (
                                <button
                                  key={action}
                                  type="button"
                                  onClick={() => permission && togglePermission(permission.id)}
                                  disabled={!permission}
                                  className={`min-h-[52px] rounded-2xl border px-3 py-2 text-center text-xs font-bold uppercase tracking-wide transition ${
                                    permission
                                      ? isSelected
                                        ? `${ACTION_STYLES[action]} shadow-sm`
                                        : 'border-border bg-background text-muted hover:bg-background/80'
                                      : 'border-dashed border-border bg-background text-muted/70'
                                  }`}
                                >
                                  {permission ? (
                                    formatActionLabel(action)
                                  ) : (
                                    `${formatActionLabel(action)} unavailable`
                                  )}
                                </button>
                              );
                            })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    ) : (
                      <div className="py-6 text-center text-sm text-muted">
                        No base permissions match your search.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted">
                  {editingRoleId
                    ? `${selectedPermissionIds.length} permission values across ${selectedCardCount} cards/pages for ${roleName || 'selected role'}`
                    : `${selectedPermissionIds.length} permission values across ${selectedCardCount} cards/pages selected`}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !roleName.trim()}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingRoleId ? 'Update role' : 'Create role'}
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-5 xl:grid-rows-[auto_auto]">
            <div className="rounded-[1.75rem] border border-border bg-surface shadow-sm">
              <div className="border-b border-border px-5 py-5 lg:px-6">
                <h2 className="text-xl font-black tracking-tight">Existing Roles</h2>
                <p className="mt-1 text-sm text-muted">Select a role to review its permission matrix.</p>
              </div>
              <div className="space-y-3 px-4 py-4 lg:px-5">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`w-full rounded-3xl border px-4 py-4 transition sm:px-5 ${
                      selectedRoleId === role.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-background hover:bg-background/80'
                    }`}
                  >
                    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1 text-left">
                        <div className="break-words text-lg font-bold text-text">{role.name}</div>
                        <div className="mt-1 text-sm text-muted">{role.user_count || 0} assigned users</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted">
                            {roleActionCounts[role.id] || 0} enabled values
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[260px] lg:items-end">
                        <div className="flex w-full justify-start lg:justify-end">
                          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${role.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {role.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto lg:min-w-[250px]">
                          <button
                            type="button"
                            onClick={() => fetchRoleDetail(role.id)}
                            disabled={loadingRoleId === role.id}
                            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="View role details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {loadingRoleId === role.id ? 'Loading...' : 'View'}
                          </button>
                          <button
                            type="button"
                            onClick={() => fetchRoleDetail(role.id, { editMode: true })}
                            disabled={loadingRoleId === role.id}
                            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Edit this role"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {loadingRoleId === role.id ? 'Loading...' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRole(role)}
                            disabled={deletingRoleId === role.id}
                            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title={(role.user_count || 0) > 0 ? 'Delete this role and its assigned users.' : 'Delete this role'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingRoleId === role.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!roles.length && (
                  <div className="py-10 text-center text-sm text-muted">No roles found.</div>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-surface shadow-sm">
              <div className="border-b border-border px-5 py-5 lg:px-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-black tracking-tight">Role Details</h2>
                </div>
              </div>

              <div className="p-5 lg:p-6">
                <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
                  Use the <span className="font-semibold text-text">View</span> button in the Existing Roles list to open the access table in a popup. Use <span className="font-semibold text-text">Edit</span> to load a role into the form.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isViewModalOpen && selectedRole ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-6 sm:py-10">
          <div className="mt-0 w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 lg:px-6">
              <div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-black tracking-tight text-text">Role Access Details</h2>
                </div>
                <div className="mt-2 text-lg font-bold text-text">{selectedRole.name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedRole.user_count || 0} assigned users
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedRole.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedRole.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeViewModal}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-text transition hover:bg-background/80"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(100vh-140px)] space-y-4 overflow-y-auto p-5 lg:p-6">
              <div className="rounded-2xl border border-border bg-background px-4 py-4">
                <div className="text-sm font-semibold text-text">Role Values</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRoleValues.length ? (
                    selectedRoleValues.map((item) => (
                      <span
                        key={item.action}
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${ACTION_STYLES[item.action]}`}
                      >
                        {item.action}: {item.count}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted">No permission values enabled for this role.</span>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background/70">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Module</th>
                        {ACTIONS.map((action) => (
                          <th key={action} className="px-3 py-3 text-center">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${ACTION_STYLES[action]}`}>
                              {action}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                      {displayedSelectedRolePermissions.map((permission, index) => (
                        <tr key={permission.module_slug} className={index % 2 === 0 ? 'bg-surface' : 'bg-background/30'}>
                          <td className="px-4 py-3 font-medium text-text">{permission.module_name}</td>
                          {ACTIONS.map((action) => (
                            <td key={action} className="px-3 py-3 text-center">
                              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                permission[action]
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-400'
                              }`}>
                                {permission[action] ? 'Y' : '-'}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RoleManagement;
