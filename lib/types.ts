export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type WorkspaceRole = 'OWNER' | 'MANAGER' | 'MEMBER';

export type Workspace = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role?: WorkspaceRole;
  owner?: { id: string; name: string } | null;
};

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user?: { id: string; name: string; email: string } | null;
};

export type Task = {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  assignedTo: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedUser?: { id: string; name: string; email: string } | null;
  createdByUser?: { id: string; name: string; email: string } | null;
};

export type TaskFilters = {
  status?: TaskStatus;
  assignedTo?: string;
};

export type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  invitedBy: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  isAccepted?: boolean;
  isExpired?: boolean;
};

export type CreateInvitationResult = WorkspaceInvitation & {
  token: string;
  inviteUrl: string;
};

export type PendingInvitation = {
  id: string;
  workspaceId: string;
  workspaceName: string;
  email: string;
  role: WorkspaceRole;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
};

export type AcceptInvitationResult = {
  workspace: { id: string; name: string };
  member: WorkspaceMember;
};
