"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAcceptInvitation } from "@/hooks/use-invitations";
import { toast } from "sonner";
import { Check, KeyRound, Loader2 } from "lucide-react";

export function JoinCodeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const accept = useAcceptInvitation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="app-dark rounded-2xl !border-white/10 !bg-surface-dark text-on-dark shadow-2xl">
        <DialogHeader>
          <span className="mb-2 grid size-10 place-items-center rounded-xl bg-white/10 text-coral">
            <KeyRound className="size-5" strokeWidth={2.25} />
          </span>
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight text-on-dark">
            Join with a code
          </DialogTitle>
          <DialogDescription className="text-sm text-on-dark-soft">
            Someone invited you to a workspace — enter the invite code they
            shared.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5 pt-2"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const result = await accept.mutateAsync({
                token: code.trim(),
              });
              toast.success(`You joined ${result.workspace.name}`);
              setCode("");
              onOpenChange(false);
              router.push(`/workspaces/${result.workspace.id}`);
            } catch (err) {
              toast.error(
                err instanceof Error
                  ? err.message
                  : "Could not join this workspace",
              );
            }
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="join-code">Invite code</Label>
            <Input
              id="join-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the invite code here"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-11 rounded-xl px-3.5 font-mono"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={accept.isPending || !code.trim()}
              className="rounded-xl !bg-coral text-white hover:!bg-coral-active"
            >
              {accept.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Join workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}