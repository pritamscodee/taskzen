"use client";

import { Button, Input, Label } from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspace } from "@/hooks/use-workspaces";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

export function WorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const create = useCreateWorkspace();
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="app-dark rounded-2xl !border-white/10 !bg-surface-dark text-on-dark shadow-2xl">
        <DialogHeader>
          <span className="mb-2 grid size-10 place-items-center rounded-xl bg-white/10 text-coral">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight text-on-dark">
            New workspace
          </DialogTitle>
          <DialogDescription className="text-sm text-on-dark-soft">
            A space for your team&apos;s tasks — boards and lists you can
            shape.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5 pt-2"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const workspace = await create.mutateAsync(name.trim());
              toast.success("Workspace created");
              setName("");
              onOpenChange(false);
              router.push(`/workspaces/${workspace.id}`);
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Could not create",
              );
            }
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product"
              autoFocus
              required
              minLength={1}
              className="h-11 rounded-xl px-3.5"
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
              isDisabled={create.isPending || !name.trim()}
              className="rounded-xl !bg-coral text-white hover:!bg-coral-active"
            >
              {create.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}