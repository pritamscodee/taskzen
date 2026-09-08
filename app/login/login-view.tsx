"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@heroui/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth/auth-layout";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/workspaces";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <AuthLayout
      eyebrow="Welcome back"
      footer={
        <>
          New here?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirect)}`}
            className="font-medium text-coral underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">
        Welcome back
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink">
        Sign in to Taskzen
      </h1>
      <p className="mt-2 text-sm text-body">
        Pick up where you left off — your boards are waiting.
      </p>

      <form
        className="mt-8 grid gap-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setFormError(null);
          setPending(true);
          const { error } = await authClient.signIn.email({
            email,
            password,
          });
          setPending(false);
          if (error) {
            const message = error.message ?? "Could not sign in";
            setFormError(message);
            toast.error(message);
            return;
          }
          toast.success("Signed in — welcome back.");
          router.replace(redirect);
        }}
        noValidate
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.example"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl px-3.5"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs text-coral underline-offset-4 hover:underline"
              onClick={() => toast.info("Reset flow coming soon.")}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl py-0 pr-10 pl-3.5"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 grid place-items-center text-muted-soft transition-colors hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="size-4.5" />
              ) : (
                <Eye className="size-4.5" />
              )}
            </button>
          </div>
        </div>

        {formError ? (
          <p className="rounded-xl border border-[color-mix(in_oklch,var(--coral)_35%,var(--hairline))] bg-[color-mix(in_oklch,var(--coral)_8%,var(--canvas))] px-3.5 py-2.5 text-sm text-coral-deep">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          fullWidth
          size="lg"
          isDisabled={pending}
          className="h-11 !bg-coral text-white hover:!bg-coral-active transition-colors"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}