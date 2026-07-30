import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            VogelPaul
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Log in om je vogels, koppels en broedsels te beheren.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
