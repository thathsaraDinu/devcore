import { requireGuest } from "@/server/users/queries";
import AuthForm from "@/features/auth/components/AuthForm";
import DevCoreLogo from "@/components/ui/DevCoreLogo";

export const metadata = {
  title: "Create Account",
};

export default async function RegisterPage() {
  await requireGuest();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,var(--ds-accent-muted)_0%,transparent_35%)] opacity-50" />

        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] bg-accent/[0.05] blur-3xl" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(var(--ds-text-primary)_1px,transparent_1px),linear-gradient(90deg,var(--ds-text-primary)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Branding */}
        <section className="hidden flex-col justify-center items-center px-12 lg:flex xl:px-20">
          <DevCoreLogo size={128} />

          <h2 className="mt-6 text-6xl font-semibold font-display tracking-tight text-text-primary">
            DevCore
          </h2>

          <p className="mt-4 max-w-md text-lg leading-8 text-text-secondary">
            Your developer knowledge system.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {["Notes", "Questions", "Snippets", "Topics"].map((item) => (
              <span
                key={item}
                className="rounded-md border border-border bg-surface/50 px-3 py-1.5 text-xs text-text-secondary"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Login */}
        <section className="flex items-center justify-center px-6 py-12">
          <AuthForm mode="register" />
        </section>
      </div>
    </main>
  );
}
