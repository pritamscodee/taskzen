"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  Skeleton,
} from "@heroui/react";
import { LogOutIcon } from "lucide-react";
import { TaskzenMark } from "@/components/landing/logo";

function initialsOf(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  if (isPending) {
    return (
      <div className="app-dark flex min-h-full flex-col bg-surface-dark">
        <header className="flex h-16 shrink-0 items-center border-b border-white/10 px-4 md:px-6">
          <Skeleton className="h-7 w-32 rounded-lg !bg-white/10" />
        </header>
        <div className="p-6">
          <Skeleton className="h-44 w-full rounded-2xl !bg-white/10" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const name = session.user.name || session.user.email;

  return (
    <div className="app-dark flex min-h-full flex-col bg-surface-dark">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-surface-dark/85 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/workspaces" aria-label="Taskzen — workspaces">
            <TaskzenMark />
          </Link>
          {pathname.startsWith("/workspaces/") && (
            <Link
              href="/workspaces"
              className="hidden text-sm font-medium text-on-dark-soft transition-colors hover:text-on-dark sm:block"
            >
              Workspaces
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <span className="group flex items-center gap-3 rounded-full p-0.5 pr-1.5">
                <Avatar size="sm">
                  <span className="grid size-full place-items-center bg-coral text-xs font-semibold text-white">
                    {initialsOf(session.user.name, session.user.email)}
                  </span>
                </Avatar>
                <span className="hidden max-w-40 truncate text-sm font-medium text-on-dark sm:block">
                  {name}
                </span>
              </span>
            </DropdownTrigger>
            <DropdownPopover
              placement="bottom end"
              className="!border !border-white/10 !bg-surface-dark-elevated shadow-2xl shadow-black/40"
            >
              <DropdownMenu className="p-1 !text-on-dark">
                <DropdownItem
                  isDisabled
                  className="pointer-events-none"
                  aria-label="Signed in as"
                >
                  <div className="flex flex-col gap-0.5 py-1">
                    <span className="text-sm font-semibold text-on-dark">
                      {name}
                    </span>
                    <span className="text-xs text-on-dark-soft">
                      {session.user.email}
                    </span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  textValue="Sign out"
                  className="hover:!bg-white/10"
                  onAction={async () => {
                    await authClient.signOut();
                    router.replace("/login");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <LogOutIcon className="size-4 text-on-dark-soft" />
                    Sign out
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}