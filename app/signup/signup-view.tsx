"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@heroui/react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth/auth-layout";

export function SignupView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/workspaces";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const passwordOk = password.length >= 8;

  return (
    <AuthLayout
      eyebrow="Join us"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-medium text-coral underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">
        Join us
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink">
        Create an account
      </h1>
      <p className="mt-2 text-sm text-body">
        Email and password — your own workspace is created for you
        automatically.
      </p>

      <form
        className="mt-8 grid gap-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setFormError(null);
          setPending(true);
          const { error } = await authClient.signUp.email({
            name,
            email,
            password,
          });
          setPending(false);
          if (error) {
            const message = error.message ?? "Could not sign up";
            setFormError(message);
            toast.error(message);
            return;
          }
          await authClient.getSession();
          toast.success("Account created — welcome to Taskzen.");
          router.replace(redirect);
        }}
        noValidate
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 rounded-xl px-3.5"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
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

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8+ characters"
              minLength={8}
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
          {password ? (
            <p
              className={`flex items-center gap-1.5 text-xs ${
                passwordOk ? "text-accent-teal" : "text-muted-soft"
              }`}
            >
              <Check className="size-3.5" strokeWidth={3} />
              {passwordOk
                ? "Nice — strong enough."
                : "Use at least 8 characters."}
            </p>
          ) : null}
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
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-soft">
          By creating an account you agree to keep each other sane, one
          checked card at a time.
        </p>
      </form>
    </AuthLayout>
  );
}