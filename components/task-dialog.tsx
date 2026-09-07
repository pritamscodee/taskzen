"use client";

import { Button, Input, Label } from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from "@/hooks/use-tasks";
import { useWorkspaceMembers } from "@/hooks/use-workspaces";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { ListChecks, Loader2 } from "lucide-react";

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

const selectClass =
  "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-on-dark outline-none transition-colors focus:border-coral/60 focus:ring-2 focus:ring-coral/30 [color-scheme:dark]";

type TaskFormProps = {
  workspaceId: string;
  task: Task | null;
  onDone: () => void;
};

function TaskForm({ workspaceId, task, onDone }: TaskFormProps) {
  const members = useWorkspaceMembers(workspaceId);
  const create = useCreateTask(workspaceId);
  const update = useUpdateTask(workspaceId);
  const remove = useDeleteTask(workspaceId);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "MEDIUM",
  );
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.slice(0, 10) : "",
  );

  const pending = create.isPending || update.isPending || remove.isPending;

  return (
    <form
      className="grid gap-5 pt-1"
      onSubmit={async (e) => {
        e.preventDefault();
        const body = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          assignedTo: assignedTo || undefined,
          dueDate: dueDate || undefined,
        };
        try {
          if (task) {
            await update.mutateAsync({
              taskId: task.id,
              body: {
                ...body,
                assignedTo: assignedTo || null,
                dueDate: dueDate || null,
                description: description.trim() || null,
              },
            });
            toast.success("Task updated");
          } else {
            await create.mutateAsync(body);
            toast.success("Task created");
          }
          onDone();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Save failed");
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
          className="h-10 rounded-xl px-3.5"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="!border-white/10 !bg-white/5 !text-on-dark placeholder:!text-on-dark-soft"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            className={selectClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="assignee">Assignee</Label>
        <select
          id="assignee"
          className={selectClass}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Unassigned</option>
          {(members.data ?? []).map((m) => (
            <option key={m.id} value={m.userId}>
              {m.user?.name?.trim() ||
                (m.user?.email
                  ? m.user.email.split("@")[0]
                  : m.userId.slice(0, 8))}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="due">Due date</Label>
        <Input
          id="due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-10 rounded-xl px-3.5"
        />
      </div>
      <DialogFooter className="mt-1 gap-2">
        {task ? (
          <Button
            type="button"
            variant="danger-soft"
            isDisabled={pending}
            onPress={async () => {
              try {
                await remove.mutateAsync(task.id);
                toast.success("Task deleted");
                onDone();
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Delete failed",
                );
              }
            }}
          >
            Delete
          </Button>
        ) : null}
        <Button
          type="submit"
          isDisabled={pending || !title.trim()}
          className="rounded-xl !bg-coral text-white hover:!bg-coral-active"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {task ? "Save changes" : "Create task"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function TaskDialog({
  workspaceId,
  task,
  open,
  onOpenChange,
}: {
  workspaceId: string;
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="app-dark max-h-[90vh] overflow-y-auto rounded-2xl !border-white/10 !bg-surface-dark text-on-dark shadow-2xl">
        <DialogHeader>
          <span className="mb-2 inline-grid size-10 place-items-center rounded-xl bg-white/10 text-coral">
            <ListChecks className="size-5" strokeWidth={2.25} />
          </span>
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight text-on-dark">
            {task ? "Edit task" : "New task"}
          </DialogTitle>
        </DialogHeader>
        <TaskForm
          key={task?.id ?? `new-${open}`}
          workspaceId={workspaceId}
          task={task}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}