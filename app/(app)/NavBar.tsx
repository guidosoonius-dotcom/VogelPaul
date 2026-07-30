"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "@/lib/utils/clsx";

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
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/dashboard" className="text-lg font-semibold text-emerald-800">
            VogelPaul
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {LINKS.slice(0, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-2 py-1 transition-colors",
                  pathname?.startsWith(link.href)
                    ? "bg-emerald-50 text-emerald-800 font-medium"
                    : "text-zinc-600 hover:text-zinc-900",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-600">
          <Link
            href="/instellingen"
            className={clsx(
              "hidden sm:inline",
              pathname?.startsWith("/instellingen") && "font-medium text-emerald-800",
            )}
          >
            {email}
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </header>
  );
}
