import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type {
  AcceptInvitationResult,
  CreateInvitationResult,
  PendingInvitation,
  WorkspaceInvitation,
  WorkspaceRole,
} from "@/lib/types";

export function useInvitations(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.invitations(workspaceId),
    queryFn: () =>
      api<WorkspaceInvitation[]>(`/workspaces/${workspaceId}/invitations`),
    enabled: Boolean(workspaceId),
  });
}

export function useMyInvitations() {
  return useQuery({
    queryKey: queryKeys.myInvitations,
    queryFn: () => api<PendingInvitation[]>("/invitations/me"),
  });
}

export function useCreateInvitation(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { email: string; role?: WorkspaceRole }) =>
      api<CreateInvitationResult>(`/workspaces/${workspaceId}/invitations`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.invitations(workspaceId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myInvitations });
    },
  });
}

export function useRevokeInvitation(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      api<void>(`/workspaces/${workspaceId}/invitations/${invitationId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.invitations(workspaceId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myInvitations });
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { token?: string; invitationId?: string }) =>
      api<AcceptInvitationResult>("/invitations/accept", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspaces });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myInvitations });
    },
  });
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      api<void>(`/invitations/me/${invitationId}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myInvitations });
    },
  });
}