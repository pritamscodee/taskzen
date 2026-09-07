"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { JoinCodeDialog } from "@/components/join-code-dialog";
import { WorkspaceDialog } from "@/components/workspace-dialog";
import { Button, Card, Skeleton } from "@heroui/react";
import { ArrowUpRightIcon, Check, KeyRound, PlusIcon, X } from "lucide-react";
import {
  useAcceptInvitation,
  useDeclineInvitation,
  useMyInvitations,
} from "@/hooks/use-invitations";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { toast } from "sonner";

export default function WorkspacesPage() {
  const { data, isLoading, isError, error } = useWorkspaces();
  const myInvitations = useMyInvitations();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();
  const [open, setOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">
              Your spaces
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-on-dark">
              Workspaces
            </h1>
            <p className="mt-1.5 text-sm text-on-dark-soft">
              Pick a space, then plan the work.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="ghost"
              className="h-10 gap-1.5 rounded-xl !text-on-dark-soft hover:!bg-white/10 hover:!text-on-dark"
              onPress={() => setJoinOpen(true)}
            >
              <KeyRound className="size-4" />
              Join with a code
            </Button>
            <Button
              size="lg"
              className="h-10 rounded-xl !bg-coral text-white hover:!bg-coral-active"
              onPress={() => setOpen(true)}
            >
              <PlusIcon className="size-4" />
              New workspace
            </Button>
          </div>
        </div>

        {myInvitations.data && myInvitations.data.length > 0 ? (
          <div className="mb-8 grid gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-on-dark-soft">
              Invites for you
            </p>
            {myInvitations.data.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-on-dark">
                    {inv.workspaceName}
                  </p>
                  <p className="text-xs text-on-dark-soft">
                    {inv.role.charAt(0) + inv.role.slice(1).toLowerCase()} role ·{" "}
                    {inv.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    isDisabled={acceptInvitation.isPending}
                    className="rounded-lg !bg-coral text-white hover:!bg-coral-active"
                    onPress={async () => {
                      try {
                        await acceptInvitation.mutateAsync({
                          invitationId: inv.id,
                        });
                      } catch (err) {
                        toast.error(
                          err instanceof Error ? err.message : "Accept failed",
                        );
                      }
                    }}
                  >
                    <Check className="size-3.5" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    isDisabled={declineInvitation.isPending}
                    className="rounded-lg !text-on-dark-soft hover:!bg-white/10 hover:!text-on-dark"
                    onPress={async () => {
                      try {
                        await declineInvitation.mutateAsync(inv.id);
                      } catch (err) {
                        toast.error(
                          err instanceof Error ? err.message : "Decline failed",
                        );
                      }
                    }}
                  >
                    <X className="size-3.5" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 rounded-2xl !bg-white/10" />
            <Skeleton className="h-40 rounded-2xl !bg-white/10" />
            <Skeleton className="h-40 rounded-2xl !bg-white/10" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Could not load workspaces"}
          </p>
        ) : !data?.length ? (
          <div className="rounded-3xl bg-surface-dark px-6 py-16 text-center text-on-dark">
            <p className="font-serif text-3xl font-medium tracking-tight">
              No workspaces yet
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-on-dark-soft">
              Create your own workspace for a fresh board, or join a team&apos;s
              workspace with the code they share with you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="ghost"
                className="rounded-xl !text-on-dark-soft hover:!bg-white/10 hover:!text-on-dark"
                onPress={() => setJoinOpen(true)}
              >
                <KeyRound className="size-4" />
                Join with a code
              </Button>
              <Button
                className="rounded-xl !bg-coral text-white hover:!bg-coral-active"
                onPress={() => setOpen(true)}
              >
                <PlusIcon className="size-4" />
                Create workspace
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((ws) => (
              <Link key={ws.id} href={`/workspaces/${ws.id}`} className="group">
                <Card
                  variant="secondary"
                  className="h-full rounded-2xl !border-white/10 bg-white/5 p-6 shadow-none transition-all duration-200 group-hover:-translate-y-1 group-hover:!border-coral/40 group-hover:shadow-[0_18px_40px_-22px_hsl(0_0%_0%/0.6)]"
                >
                  <Card.Header className="flex items-start justify-between gap-3 p-0">
                    <Card.Title className="font-serif text-xl font-medium tracking-tight text-on-dark">
                      {ws.name}
                    </Card.Title>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-dark-elevated text-coral transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRightIcon className="size-4" />
                    </span>
                  </Card.Header>
                  <Card.Description className="mt-2 text-sm text-on-dark-soft">
                    {ws.role === "OWNER"
                      ? "Your workspace"
                      : `Shared with you · Owned by ${ws.owner?.name ?? "someone"}`}
                  </Card.Description>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <WorkspaceDialog open={open} onOpenChange={setOpen} />
      <JoinCodeDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </AppShell>
  );
}