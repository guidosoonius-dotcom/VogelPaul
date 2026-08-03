import Image from "next/image";
import FeatherMark from "@/components/ui/FeatherMark";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative h-96 overflow-hidden sm:h-[26rem] lg:h-full">
        <Image
          src="/hero-bird.jpg"
          alt="Gele zangvogel op een bloesemtak"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/5" />

        <span className="absolute right-[14%] top-[14%] hidden items-center gap-2 rounded-full bg-card-raised/95 px-3.5 py-2 text-xs font-bold text-ink shadow-lg sm:inline-flex">
          4 generaties zichtbaar
        </span>

        <span className="absolute bottom-[30%] right-[22%] hidden h-2 w-2 rounded-full bg-brass shadow-[0_0_0_4px_rgba(226,161,59,0.35)] sm:block" />
        <span className="absolute bottom-[22%] right-[8%] hidden w-40 items-start gap-2 sm:flex">
          <span className="mt-1 h-px w-6 shrink-0 bg-card-raised/70" />
          <span className="rounded-full bg-card-raised/95 px-3 py-1.5 text-xs font-bold text-ink shadow-lg">
            Ringkleur automatisch herkend
          </span>
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <h1 className="font-display text-3xl font-black leading-[1.05] text-card-raised sm:text-4xl lg:text-5xl">
            Elke ring.
            <br />
            Elke generatie.
            <br />
            Eén stamboek.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-card-raised/85 sm:mt-4 sm:text-base">
            Van ringkleur tot stamboom &mdash; VogelPaul houdt je volière moeiteloos bij.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-ground px-4 py-12 lg:py-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="mb-3 flex justify-center text-brass">
              <FeatherMark className="h-9 w-9" veinColor="var(--card-raised)" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              VogelPaul
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Log in om je vogels, koppels en broedsels te beheren.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
