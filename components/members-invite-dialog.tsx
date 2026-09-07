"use client";

import { Button, Input, Label, Chip } from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateInvitation,
  useInvitations,
  useRevokeInvitation,
} from "@/hooks/use-invitations";
import {
  useRemoveMember,
  useUpdateMemberRole,
  useWorkspaceMembers,
} from "@/hooks/use-workspaces";
import type { WorkspaceRole } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Crown,
  KeyRound,
  Loader2,
  MailPlus,
  ShieldCheck,
  Trash2,
  UserX,
} from "lucide-react";

const ROLE_LABEL: Record<WorkspaceRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  MEMBER: "Member",
};

const ROLE_ORDER: WorkspaceRole[] = ["OWNER", "MANAGER", "MEMBER"];

function initialsOf(m: { user?: { name: string; email: string } | null; userId: string }) {
  const source = m.user?.name?.trim() || m.user?.email?.split("@")[0] || m.userId.slice(0, 2);
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export function MembersInviteDialog({
  workspaceId,
  open,
  onOpenChange,
}: {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: session } = authClient.useSession();
  const members = useWorkspaceMembers(workspaceId);
  const invitations = useInvitations(workspaceId);
  const createInvitation = useCreateInvitation(workspaceId);
  const revokeInvitation = useRevokeInvitation(workspaceId);
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveMember(workspaceId);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("MEMBER");
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);

  const me = members.data?.find((m) => m.userId === session?.user?.id);
  const isManager = me?.role === "OWNER" || me?.role === "MANAGER";

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await createInvitation.mutateAsync({ email, role });
      setLastToken(result.token);
      setLastInviteUrl(result.inviteUrl);
      setEmail("");
      toast.success("Invite link created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not invite");
    }
  }

  async function copyLink() {
    if (!lastInviteUrl) return;
    try {
      await navigator.clipboard.writeText(lastInviteUrl);
      toast.success("Invite link copied — share it with them");
    } catch {
      toast.error("Could not copy");
    }
  }

  async function copyCode() {
    if (!lastToken) return;
    try {
      await navigator.clipboard.writeText(lastToken);
      toast.success("Invite code copied");
    } catch {
      toast.error("Could not copy");
    }
  }

  const inviteCount = (invitations.data ?? []).filter(
    (i) => !i.isAccepted && !i.isExpired,
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="app-dark max-h-[85vh] overflow-y-auto rounded-2xl !border-white/10 !bg-surface-dark text-on-dark shadow-2xl">
        <DialogHeader>
          <span className="mb-2 grid size-10 place-items-center rounded-xl bg-white/10 text-coral">
            <MailPlus className="size-5" strokeWidth={2.25} />
          </span>
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight text-on-dark">
            Members &amp; invites
          </DialogTitle>
          <DialogDescription className="text-sm text-on-dark-soft">
            Invite teammates by email, share an invite link, and manage roles.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 pt-1">
          <section className="grid gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-on-dark-soft">
              Invite people
            </p>
            <form className="grid gap-3" onSubmit={handleSend}>
              <div className="grid gap-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@example.com"
                  className="h-10 rounded-xl px-3.5"
                  required
                  disabled={!isManager}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <select
                  id="invite-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                  disabled={!isManager}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-on-dark outline-none transition-colors focus:border-coral/60 focus:ring-2 focus:ring-coral/30 disabled:cursor-not-allowed disabled:opacity-60 [color-scheme:dark]"
                >
                  {ROLE_ORDER.map((r) => (
                    <option key={r} value={r} disabled={r === "OWNER"}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="submit"
                isDisabled={!isManager || createInvitation.isPending || !email}
                className="rounded-xl !bg-coral text-white hover:!bg-coral-active"
              >
                {createInvitation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MailPlus className="size-4" />
                )}
                Send invite
              </Button>
            </form>

            {lastToken && lastInviteUrl ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-on-dark-soft">
                  No email is sent — share this invite link with them to join:
                </p>
                <p className="mt-1.5 break-all text-xs text-on-dark">
                  {lastInviteUrl}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg !bg-white/10 !text-on-dark hover:!bg-white/15"
                    onPress={copyLink}
                  >
                    <Copy className="size-3.5" />
                    Copy link
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-lg !bg-white/10 !text-on-dark hover:!bg-white/15"
                    onPress={copyCode}
                  >
                    <KeyRound className="size-3.5" />
                    Copy code
                  </Button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-on-dark-soft">
                Members · {members.data?.length ?? 0}
              </p>
            </div>
            <div className="grid gap-2">
              {(members.data ?? []).map((m) => {
                const isSelf = m.userId === session?.user?.id;
                const canEdit = isManager && !isSelf && m.role !== "OWNER";
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-dark-elevated text-xs font-semibold text-coral">
                      {initialsOf(m)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-on-dark">
                        {m.user?.name?.trim() ||
                          (m.user?.email
                            ? m.user.email.split("@")[0]
                            : `User ${m.userId.slice(0, 6)}`)}
                        {isSelf ? (
                          <span className="ml-1.5 text-xs font-normal text-on-dark-soft">
                            (you)
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-on-dark-soft">
                        {m.user?.email ?? m.userId.slice(0, 8)}
                        {m.role === "OWNER" ? (
                          <span className="ml-1.5 inline-flex items-center gap-1 text-coral">
                            · <Crown className="size-3" /> Owner
                          </span>
                        ) : null}
                      </p>
                    </div>
                    {canEdit ? (
                      <select
                        value={m.role}
                        onChange={(e) =>
                          void updateRole.mutate({
                            userId: m.userId,
                            role: e.target.value as WorkspaceRole,
                          })
                        }
                        className="h-8 w-28 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-on-dark outline-none transition-colors focus:border-coral/60 [color-scheme:dark]"
                      >
                        {ROLE_ORDER.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    {isManager && m.role !== "OWNER" && !isSelf ? (
                      <button
                        type="button"
                        aria-label={`Remove ${m.userId.slice(0, 8)}`}
                        onClick={() => void removeMember.mutate(m.userId)}
                        className="grid size-7 place-items-center rounded-lg text-on-dark-soft transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <UserX className="size-4" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-on-dark-soft">
              Invites · {inviteCount} active
            </p>
            <div className="grid gap-2">
              {(invitations.data ?? []).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-dark-elevated text-coral">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-dark">
                      {inv.email}
                    </p>
                    <p className="text-xs text-on-dark-soft">
                      {inv.isAccepted
                        ? "Accepted"
                        : inv.isExpired
                          ? "Expired"
                          : `Pending — ${ROLE_LABEL[inv.role].toLowerCase()}`}
                    </p>
                  </div>
                  {!inv.isAccepted ? (
                    <Chip
                      size="sm"
                      className={
                        inv.isExpired
                          ? "!bg-white/5 !text-on-dark-soft"
                          : "!bg-white/10 !text-on-dark-soft"
                      }
                    >
                      {inv.isExpired ? "expired" : "active"}
                    </Chip>
                  ) : null}
                  {isManager && !inv.isAccepted ? (
                    <button
                      type="button"
                      aria-label={`Revoke invite for ${inv.email}`}
                      onClick={() => void revokeInvitation.mutate(inv.id)}
                      className="grid size-7 place-items-center rounded-lg text-on-dark-soft transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : null}
                </div>
              ))}
              {!isManager ? (
                <p className="text-xs text-on-dark-soft">
                  Only owners and managers can manage invitations.
                </p>
              ) : null}
              {(invitations.data ?? []).length === 0 ? (
                <p className="text-xs text-on-dark-soft">
                  No invitations yet.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}