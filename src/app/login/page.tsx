import { requireGuest } from "@/server/users/queries";
import AuthForm from "@/features/auth/components/AuthForm";
import DevCoreLogo from "@/components/ui/DevCoreLogo";

export const metadata = {
  title: "Sign In",
};

export default async function LoginPage() {
  await requireGuest();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,var(--ds-accent-muted)_0%,transparent_35%)] opacity-50" />

        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] bg-accent/[0.05] blur-3xl" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(var(--ds-text-primary)_1px,transparent_1px),linear-gradient(90deg,var(--ds-text-primary)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen  lg:grid-cols-2">
        {/* Branding */}
        <section className="brand-panel">
          <div className="brand-topline">
            <span className="status-dot" />
            <span>DEVCORE / KNOWLEDGE SYSTEM</span>
          </div>

          <div className="brand-content">
            <p className="eyebrow">A calmer place to think.</p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl">
              Your knowledge,
              <br />
              <em>finally connected.</em>
            </h1>

            <p className="brand-copy">
              Keep notes, questions, snippets, and hard-won lessons in one
              beautiful learning place. Organize everything by topic and custom
              tags, then find the thread when you need it.
            </p>

            <div className="feature-row">
              <span>NOTES</span>
              <span>QUESTIONS</span>
              <span>SNIPPETS</span>
              <span>TAGS</span>
            </div>
          </div>

          <div className="brand-footer">
            <span>© 2026 DEVCORE</span>
            <span className="footer-line" />
            <span>EST. FOR CURIOUS MINDS</span>
          </div>
        </section>

        {/* Login */}
        <section className="flex items-center justify-center px-6 py-12">
          <AuthForm mode="login" />
        </section>
      </div>
    </main>
  );
}
