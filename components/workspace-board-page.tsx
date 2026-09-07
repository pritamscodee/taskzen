"use client";

import { AppShell } from "@/components/app-shell";
import { KanbanBoard } from "@/components/kanban-board";
import { MembersInviteDialog } from "@/components/members-invite-dialog";
import { TaskDialog } from "@/components/task-dialog";
import { TaskList } from "@/components/task-list";
import { Button, Skeleton, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { LayoutGrid, List, Plus, Users } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useInvitations } from "@/hooks/use-invitations";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useWorkspaceSocket } from "@/hooks/use-workspace-socket";
import type { Task, TaskStatus } from "@/lib/types";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const STATUS_PILLS: { value: TaskStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

export function WorkspaceBoardPage() {
  const params = useParams<{ id: string }>();
  const workspaceId = params.id;
  const workspace = useWorkspace(workspaceId);
  const [view, setView] = useState<"board" | "list">("board");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);

  const filters = useMemo(
    () => (statusFilter ? { status: statusFilter } : undefined),
    [statusFilter],
  );
  const tasks = useTasks(workspaceId, filters);
  const invitations = useInvitations(workspaceId);
  useWorkspaceSocket(workspaceId);

  function openCreate() {
    setActiveTask(null);
    setDialogOpen(true);
  }

  function openTask(task: Task) {
    setActiveTask(task);
    setDialogOpen(true);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">
              Workspace
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-on-dark">
              {workspace.data?.name ?? "…"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {STATUS_PILLS.map((pill) => {
                const active = statusFilter === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setStatusFilter(pill.value)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-on-dark text-surface-dark"
                        : "text-on-dark-soft hover:text-on-dark"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            <ToggleButtonGroup
              selectedKeys={[view]}
              onSelectionChange={(keys) => {
                const next = Array.from(keys)[0];
                if (next === "board" || next === "list") setView(next);
              }}
              isDetached
              selectionMode="single"
            >
              <ToggleButton
                id="board"
                variant="ghost"
                className="rounded-full !bg-transparent !text-on-dark-soft hover:!bg-white/10 hover:!text-on-dark data-[selected=true]:!bg-on-dark data-[selected=true]:!text-surface-dark"
              >
                <LayoutGrid className="size-4" />
                Board
              </ToggleButton>
              <ToggleButton
                id="list"
                variant="ghost"
                className="rounded-full !bg-transparent !text-on-dark-soft hover:!bg-white/10 hover:!text-on-dark data-[selected=true]:!bg-on-dark data-[selected=true]:!text-surface-dark"
              >
                <List className="size-4" />
                List
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              size="lg"
              variant="ghost"
              className="h-10 gap-1.5 rounded-xl !text-on-dark-soft hover:!bg-white/10 hover:!text-on-dark"
              onPress={() => setMembersOpen(true)}
            >
              <Users className="size-4" />
              Members
              {invitations.data?.some((i) => !i.isAccepted && !i.isExpired) ? (
                <span className="grid size-5 place-items-center rounded-full !bg-coral text-[10px] font-bold text-white">
                  {invitations.data.filter((i) => !i.isAccepted && !i.isExpired).length}
                </span>
              ) : null}
            </Button>

            <Button
              size="lg"
              className="h-10 rounded-xl !bg-coral text-white hover:!bg-coral-active"
              onPress={openCreate}
            >
              <Plus className="size-4" />
              New task
            </Button>
          </div>
        </div>

        {tasks.isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-64 rounded-2xl !bg-white/10" />
            <Skeleton className="h-64 rounded-2xl !bg-white/10" />
            <Skeleton className="h-64 rounded-2xl !bg-white/10" />
          </div>
        ) : tasks.isError ? (
          <p className="text-sm text-destructive">
            {tasks.error instanceof Error
              ? tasks.error.message
              : "Could not load tasks"}
          </p>
        ) : view === "board" ? (
          <KanbanBoard
            workspaceId={workspaceId}
            tasks={tasks.data ?? []}
            onOpenTask={openTask}
          />
        ) : (
          <TaskList tasks={tasks.data ?? []} onOpenTask={openTask} />
        )}
      </div>
      <TaskDialog
        workspaceId={workspaceId}
        task={activeTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <MembersInviteDialog
        workspaceId={workspaceId}
        open={membersOpen}
        onOpenChange={setMembersOpen}
      />
    </AppShell>
  );
}