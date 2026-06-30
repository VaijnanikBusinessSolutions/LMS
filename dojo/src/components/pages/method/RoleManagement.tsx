import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Shield, Users } from 'lucide-react';
import { normalizeListResponse } from '../../../utils/api';

type AvailablePermission = {
  id: number;
  codename: string;
  name: string;
};

type PermissionModule = {
  id: number;
  slug: string;
  name: string;
  description: string;
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

const ACTIONS = ['view', 'create', 'update', 'delete', 'approve', 'export', 'manage'] as const;

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

const RoleManagement = () => {
  const auth = useMemo(() => JSON.parse(localStorage.getItem('auth') || '{}'), []);
  const token = auth?.accessToken;

  const [roleName, setRoleName] = useState('');
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token],
  );

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
      if (!selectedRoleId && nextRoles.length > 0) {
        setSelectedRoleId(nextRoles[0].id);
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
      const response = await api.post(
        '/roles/',
        {
          name: roleName.trim(),
          is_active: true,
          permission_ids: selectedPermissionIds,
        },
        { headers },
      );

      setSuccess(`Role "${response.data.name}" created successfully.`);
      setRoleName('');
      setSelectedPermissionIds([]);
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

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) || null,
    [roles, selectedRoleId],
  );

  const roleActionCounts = useMemo(() => {
    return roles.reduce<Record<number, number>>((accumulator, role) => {
      accumulator[role.id] = role.permissions.reduce(
        (total, permission) => total + ACTIONS.filter((action) => permission[action]).length,
        0,
      );
      return accumulator;
    }, {});
  }, [roles]);

  const selectedRoleValues = useMemo(() => {
    if (!selectedRole) return [];

    return ACTIONS.map((action) => ({
      action,
      count: selectedRole.permissions.filter((permission) => permission[action]).length,
    })).filter((item) => item.count > 0);
  }, [selectedRole]);

  return (
    <div className="min-h-full w-full bg-background px-3 py-3 text-text sm:px-4 lg:px-5">
      <div className="flex min-h-full w-full flex-col">
        <div className="mb-5 flex flex-col gap-4 rounded-[1.75rem] border border-border bg-surface px-5 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-text">Role-Based Access Control</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">
              Standard permission matrix using role-to-permission assignments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-auto">
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Roles</div>
              <div className="mt-1 text-2xl font-black">{roles.length}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Modules</div>
              <div className="mt-1 text-2xl font-black">{modules.length}</div>
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
              <h2 className="text-xl font-black tracking-tight">Create Role</h2>
              <p className="mt-1 text-sm text-muted">Assign standard permissions by module and action.</p>
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
                      {modules.map((module, index) => (
                        <tr key={module.id} className={`align-top ${index % 2 === 0 ? 'bg-surface' : 'bg-background/30'}`}>
                          <td className="px-4 py-4">
                            <div className="font-medium text-text">{module.name}</div>
                            <div className="mt-1 text-sm text-muted">{module.description}</div>
                          </td>
                          {ACTIONS.map((action) => {
                            const permission = module.available_permissions.find(
                              (item) => item.codename === `${action}_${module.slug.replace(/-/g, '_')}`,
                            );

                            return (
                              <td key={action} className="px-3 py-4 text-center">
                                {permission ? (
                                  <input
                                    type="checkbox"
                                    checked={selectedPermissionIds.includes(permission.id)}
                                    onChange={() => togglePermission(permission.id)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                                  />
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted">
                  {selectedPermissionIds.length} permissions selected
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !roleName.trim()}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Create role'}
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-5 xl:grid-rows-[minmax(280px,0.9fr)_minmax(360px,1.1fr)]">
            <div className="rounded-[1.75rem] border border-border bg-surface shadow-sm">
              <div className="border-b border-border px-5 py-5 lg:px-6">
                <h2 className="text-xl font-black tracking-tight">Existing Roles</h2>
                <p className="mt-1 text-sm text-muted">Select a role to review its permission matrix.</p>
              </div>
              <div className="h-[34vh] min-h-[260px] space-y-3 overflow-y-auto p-4 lg:h-[38vh]">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedRoleId === role.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:bg-background/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-text">{role.name}</div>
                        <div className="mt-1 text-sm text-muted">{role.user_count || 0} assigned users</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted">
                            {roleActionCounts[role.id] || 0} enabled values
                          </span>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${role.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {role.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </button>
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
                {selectedRole ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border bg-background px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-black">{selectedRole.name}</div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                            <Users className="h-4 w-4" />
                            {selectedRole.user_count || 0} assigned users
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedRole.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedRole.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

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
                            {selectedRole.permissions.map((permission, index) => (
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
                ) : (
                  <div className="py-10 text-center text-sm text-muted">Select a role to review permissions.</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
