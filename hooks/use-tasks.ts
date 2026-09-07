import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { Task, TaskFilters } from "@/lib/types";

export function useTasks(workspaceId: string, filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks(workspaceId, filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.assignedTo) params.set("assignedTo", filters.assignedTo);
      const qs = params.toString();
      return api<Task[]>(
        `/workspaces/${workspaceId}/tasks${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: Boolean(workspaceId),
  });
}

type CreateTaskInput = {
  title: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  assignedTo?: string;
  dueDate?: string;
};

type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: Task["status"];
  priority?: Task["priority"];
  assignedTo?: string | null;
  dueDate?: string | null;
};

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTaskInput) =>
      api<Task>(`/workspaces/${workspaceId}/tasks`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
    },
  });
}

export function useUpdateTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, body }: { taskId: string; body: UpdateTaskInput }) =>
      api<Task>(`/workspaces/${workspaceId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
    },
  });
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      api<void>(`/workspaces/${workspaceId}/tasks/${taskId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
    },
  });
}
