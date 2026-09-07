import type { TaskFilters } from './types';

export const queryKeys = {
  workspaces: ['workspaces'] as const,
  workspace: (id: string) => ['workspaces', id] as const,
  members: (id: string) => ['workspaces', id, 'members'] as const,
  invitations: (id: string) => ['workspaces', id, 'invitations'] as const,
  myInvitations: ['invitations', 'me'] as const,
  tasks: (id: string, filters?: TaskFilters) =>
    ['workspaces', id, 'tasks', filters ?? {}] as const,
};
