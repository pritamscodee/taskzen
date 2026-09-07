"use client";

import {
  DndContext,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Chip } from "@heroui/react";
import { GripVertical } from "lucide-react";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { toast } from "sonner";

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "TODO", label: "To do" },
  { id: "IN_PROGRESS", label: "In progress" },
  { id: "DONE", label: "Done" },
];

const PRIORITY_COLOR: Record<TaskPriority, "success" | "warning" | "danger"> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

function TaskCard({
  task,
  onOpen,
}: {
  task: Task;
  onOpen: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), zIndex: isDragging ? 40 : undefined }}
      {...listeners}
      {...attributes}
    >
      <button
        type="button"
        className="w-full cursor-grab text-left active:cursor-grabbing"
        onClick={() => onOpen(task)}
      >
        <div
          className={`group/card rounded-xl border border-white/10 bg-surface-dark-elevated p-3.5 transition-all duration-150 ${
            isDragging
              ? "rotate-1 scale-[1.02] border-coral/50 opacity-90 shadow-xl"
              : "shadow-[0_1px_2px_hsl(0_0%_0%/0.4)] hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_10px_24px_-12px_hsl(0_0%_0%/0.6)]"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[0.925rem] leading-snug font-medium text-on-dark">
              {task.title}
            </p>
            <GripVertical className="mt-0.5 size-4 shrink-0 text-on-dark-soft/50 opacity-0 transition-opacity group-hover/card:opacity-100" />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Chip color={PRIORITY_COLOR[task.priority]} size="sm">
              {task.priority.toLowerCase()}
            </Chip>
            {task.dueDate ? (
              <span className="text-xs text-on-dark-soft">
                {task.dueDate.slice(0, 10)}
              </span>
            ) : null}
          </div>
          {task.assignedUser ? (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-coral/15 text-[9px] font-bold text-coral">
                {(
                  task.assignedUser.name?.trim() ||
                  task.assignedUser.email.split("@")[0]
                )
                  .split(/\s+/)
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <span className="truncate text-xs text-on-dark-soft">
                {task.assignedUser.name?.trim() ||
                  task.assignedUser.email.split("@")[0]}
              </span>
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
}

function Column({
  status,
  label,
  tasks,
  onOpen,
}: {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onOpen: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-72 flex-col rounded-2xl border border-white/10 bg-white/5 p-3 transition-shadow ${isOver ? "ring-2 ring-coral/40" : ""}`}
    >
      <h2 className="mb-3 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.14em] text-on-dark-soft">
        <span>{label}</span>
        <span className="grid min-w-5 place-items-center rounded-full bg-white/15 px-1.5 py-0.5 text-[0.7rem] font-semibold text-on-dark">
          {tasks.length}
        </span>
      </h2>
      <div className="flex flex-col gap-2.5">
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 px-3 py-10 text-center text-sm text-on-dark-soft">
            Drop a card here
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} />
          ))
        )}
      </div>
    </section>
  );
}

export function KanbanBoard({
  workspaceId,
  tasks,
  onOpenTask,
}: {
  workspaceId: string;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  const update = useUpdateTask(workspaceId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  async function onDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    const task = event.active.data.current?.task as Task | undefined;
    if (!overId || !task) return;
    const nextStatus = String(overId) as TaskStatus;
    if (!COLUMNS.some((c) => c.id === nextStatus) || task.status === nextStatus) {
      return;
    }
    try {
      await update.mutateAsync({
        taskId: task.id,
        body: { status: nextStatus },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Move failed");
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            status={col.id}
            label={col.label}
            tasks={tasks.filter((t) => t.status === col.id)}
            onOpen={onOpenTask}
          />
        ))}
      </div>
    </DndContext>
  );
}