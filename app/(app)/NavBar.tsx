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
    <header className="bg-moss text-card-raised">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md font-display text-lg font-bold focus-visible:outline-card-raised"
          >
            <FeatherMark />
            VogelPaul
          </Link>
          <nav className="flex flex-wrap gap-x-1 gap-y-1 text-sm">
            {LINKS.slice(0, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-full px-3 py-1.5 font-bold transition-colors duration-150 focus-visible:outline-card-raised",
                  pathname?.startsWith(link.href)
                    ? "bg-card-raised/15 text-card-raised"
                    : "text-card-raised/80 hover:bg-card-raised/10 hover:text-card-raised",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-card-raised/85">
          <Link
            href="/instellingen"
            className={clsx(
              "hidden rounded-md sm:inline focus-visible:outline-card-raised",
              pathname?.startsWith("/instellingen") && "font-bold text-card-raised",
            )}
          >
            {email}
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-full border border-card-raised/45 px-3.5 py-1.5 text-xs font-bold transition-[background-color,transform] duration-150 hover:bg-card-raised/12 active:scale-95 focus-visible:outline-card-raised"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </header>
  );
}
