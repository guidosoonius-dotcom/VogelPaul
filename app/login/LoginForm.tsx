"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Field";
import { clsx } from "@/lib/utils/clsx";

type Mode = "password" | "magic_link";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("magic_link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Inloggen mislukt. Controleer je e-mailadres en wachtwoord.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError("Versturen van de magische link is mislukt. Probeer het opnieuw.");
      return;
    }

    setMagicLinkSent(true);
  }

  return (
    <div className="rounded-3xl border-2 border-line-soft bg-card p-6 shadow-sm">
      <div className="mb-6 flex rounded-full border border-line-soft bg-ground-deep p-1 text-sm font-bold">
        <button
          type="button"
          aria-pressed={mode === "magic_link"}
          onClick={() => {
            setMode("magic_link");
            setError(null);
            setMagicLinkSent(false);
          }}
          className={clsx(
            "flex-1 cursor-pointer rounded-full px-3 py-1.5 transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
            mode === "magic_link"
              ? "bg-ink text-card-raised"
              : "text-ink-soft hover:text-ink",
          )}
        >
          Magische link
        </button>
        <button
          type="button"
          aria-pressed={mode === "password"}
          onClick={() => {
            setMode("password");
            setError(null);
            setMagicLinkSent(false);
          }}
          className={clsx(
            "flex-1 cursor-pointer rounded-full px-3 py-1.5 transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
            mode === "password"
              ? "bg-ink text-card-raised"
              : "text-ink-soft hover:text-ink",
          )}
        >
          Wachtwoord
        </button>
      </div>

      {mode === "magic_link" ? (
        magicLinkSent ? (
          <p className="text-sm text-ink-soft">
            We hebben een inloglink gestuurd naar <strong className="text-ink">{email}</strong>.
            Open je e-mail en klik op de link om in te loggen.
          </p>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <FieldWrapper label="E-mailadres" htmlFor="email-magic">
              <Input
                id="email-magic"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
              />
            </FieldWrapper>
            {error && <p className="text-sm text-brick">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Bezig..." : "Stuur inloglink"}
            </Button>
          </form>
        )
      ) : (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <FieldWrapper label="E-mailadres" htmlFor="email-password">
            <Input
              id="email-password"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
            />
          </FieldWrapper>
          <FieldWrapper label="Wachtwoord" htmlFor="password">
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldWrapper>
          {error && <p className="text-sm text-brick">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Bezig..." : "Inloggen"}
          </Button>
        </form>
      )}
    </div>
  );
}
