"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/lib/api";

export function useWorkspaceSocket(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    const socket: Socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("workspace:join", { workspaceId });
    });

    const invalidate = () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
    };

    socket.on("task.created", invalidate);
    socket.on("task.updated", invalidate);
    socket.on("task.deleted", invalidate);

    const invalidateMembers = () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "members"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
    };
    socket.on("workspace.member.added", invalidateMembers);

    return () => {
      socket.emit("workspace:leave", { workspaceId });
      socket.disconnect();
    };
  }, [queryClient, workspaceId]);
}
