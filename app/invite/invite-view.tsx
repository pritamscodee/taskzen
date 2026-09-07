"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button, Skeleton } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useAcceptInvitation } from "@/hooks/use-invitations";
import { toast } from "sonner";
import {
  CheckCircle2,
  KeyRound,
  Loader2,
  XCircle,
} from "lucide-react";

export function InviteView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const accept = useAcceptInvitation();

  useEffect(() => {
    if (sessionPending) return;
    if (!session) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/invite?token=${encodeURIComponent(token)}`,
        )}`,
      );
      return;
    }
    if (!token || !accept.isIdle) return;
    accept
      .mutateAsync({ token })
      .then((res) => toast.success(`You joined ${res.workspace.name}`))
      .catch(() => undefined);
  }, [accept, router, session, sessionPending, token]);

  return (
    <main className="app-dark flex min-h-svh items-center justify-center bg-surface-dark px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30">
        {sessionPending || !session ? (
          <div className="grid justify-items-center gap-4">
            <Skeleton className="size-14 rounded-2xl !bg-white/10" />
            <Skeleton className="h-5 w-40 !bg-white/10" />
          </div>
        ) : !token ? (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/10 text-coral">
              <KeyRound className="size-6" strokeWidth={2} />
            </span>
            <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-on-dark">
              Missing invite code
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-on-dark-soft">
              This invite link has no code. Ask the inviter to resend it.
            </p>
            <Button
              size="lg"
              className="mt-6 h-11 w-full rounded-xl !bg-coral text-white hover:!bg-coral-active"
              onPress={() => router.push("/workspaces")}
            >
              Go to my workspaces
            </Button>
          </>
        ) : accept.isPending ? (
          <div className="grid justify-items-center gap-4">
            <Loader2 className="size-7 animate-spin text-coral" />
            <p className="text-sm text-on-dark-soft">Joining workspace…</p>
          </div>
        ) : accept.isError ? (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
              <XCircle className="size-6" strokeWidth={2} />
            </span>
            <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-on-dark">
              Invite not accepted
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-on-dark-soft">
              {accept.error instanceof Error
                ? accept.error.message
                : "This invitation could not be accepted."}
            </p>
            <div className="mt-6 grid gap-2.5">
              <Button
                size="lg"
                className="h-11 rounded-xl !bg-coral text-white hover:!bg-coral-active"
                onPress={() => router.push("/workspaces")}
              >
                Go to my workspaces
              </Button>
              <p className="text-xs text-on-dark-soft">
                Ask the inviter to send you a fresh invite link.
              </p>
            </div>
          </>
        ) : accept.isSuccess && accept.data ? (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-coral/15 text-coral">
              <CheckCircle2 className="size-6" strokeWidth={2} />
            </span>
            <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-on-dark">
              You joined {accept.data.workspace.name}
            </h1>
            <p className="mt-2 text-sm text-on-dark-soft">
              The workspace is ready — open it to start collaborating.
            </p>
            <Button
              size="lg"
              className="mt-6 h-11 w-full rounded-xl !bg-coral text-white hover:!bg-coral-active"
              onPress={() =>
                router.push(`/workspaces/${accept.data!.workspace.id}`)
              }
            >
              <KeyRound className="size-4" />
              Open workspace
            </Button>
          </>
        ) : (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/10 text-coral">
              <KeyRound className="size-6" strokeWidth={2} />
            </span>
            <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-on-dark">
              You&apos;re invited
            </h1>
            <p className="mt-2 text-sm text-on-dark-soft">
              Preparing your workspace join…
            </p>
          </>
        )}
      </div>
    </main>
  );
}