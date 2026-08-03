"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "@/lib/utils/clsx";
import FeatherMark from "@/components/ui/FeatherMark";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vogels", label: "Vogels" },
  { href: "/koppels", label: "Koppels" },
  { href: "/broedsels", label: "Broedsels" },
  { href: "/wedstrijden", label: "Wedstrijden" },
  { href: "/instellingen", label: "Instellingen" },
];

export default function NavBar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="px-4 pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-3xl bg-ink px-4 py-3 text-card-raised shadow-[0_16px_32px_-18px_rgba(24,20,15,0.55)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full font-display text-lg font-bold focus-visible:outline-brass"
          >
            <FeatherMark veinColor="var(--brass)" />
            VogelPaul
          </Link>
          <nav className="flex flex-wrap gap-x-1 gap-y-1 text-sm">
            {LINKS.slice(0, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-full px-3.5 py-1.5 font-bold transition-colors duration-150 focus-visible:outline-brass",
                  pathname?.startsWith(link.href)
                    ? "bg-brass text-ink"
                    : "text-card-raised/75 hover:bg-card-raised/10 hover:text-card-raised",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-card-raised/80">
          <Link
            href="/instellingen"
            className={clsx(
              "hidden rounded-full sm:inline focus-visible:outline-brass",
              pathname?.startsWith("/instellingen") && "font-bold text-card-raised",
            )}
          >
            {email}
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-full border-2 border-card-raised/30 px-3.5 py-1.5 text-xs font-bold transition-[background-color,transform] duration-150 hover:bg-card-raised/10 active:scale-95 focus-visible:outline-brass"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </header>
  );
}
