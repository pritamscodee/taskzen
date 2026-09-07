"use client";

import { Chip } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";

const PRIORITY_COLOR: Record<TaskPriority, "success" | "warning" | "danger"> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

const STATUS_DOT: Record<TaskStatus, string> = {
  TODO: "bg-accent-amber",
  IN_PROGRESS: "bg-coral",
  DONE: "bg-accent-teal",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function TaskList({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/15 px-4 py-14 text-center text-sm text-on-dark-soft">
        No tasks match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-dark-elevated">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.12em] text-on-dark-soft">
            <th className="px-5 py-3.5">Title</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Priority</th>
            <th className="px-5 py-3.5">Assignee</th>
            <th className="px-5 py-3.5">Due</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="group border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.04]"
            >
              <td className="px-5 py-4 font-medium text-on-dark">{task.title}</td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2 text-on-dark-soft">
                  <span className={`size-2 rounded-full ${STATUS_DOT[task.status]}`} />
                  {STATUS_LABEL[task.status]}
                </span>
              </td>
              <td className="px-5 py-4">
                <Chip color={PRIORITY_COLOR[task.priority]} size="sm">
                  {task.priority.toLowerCase()}
                </Chip>
              </td>
              <td className="px-5 py-4 text-on-dark-soft">
                {task.assignedUser ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="grid size-5 place-items-center rounded-full bg-coral/15 text-[9px] font-bold text-coral">
                      {(
                        task.assignedUser.name?.trim() ||
                        task.assignedUser.email.split("@")[0]
                      )
                        .split(/\s+/)
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    {task.assignedUser.name?.trim() ||
                      task.assignedUser.email.split("@")[0]}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-5 py-4 text-on-dark-soft">
                {task.dueDate ? task.dueDate.slice(0, 10) : "—"}
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onOpenTask(task)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-on-dark-soft transition-colors hover:bg-white/10 hover:text-on-dark"
                >
                  Open
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}