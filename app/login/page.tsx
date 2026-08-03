import FeatherMark from "@/components/ui/FeatherMark";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mb-3 flex justify-center text-moss">
            <FeatherMark className="h-9 w-9" veinColor="var(--card-raised)" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            VogelPaul
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Log in om je vogels, koppels en broedsels te beheren.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
