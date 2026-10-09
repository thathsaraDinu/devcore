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

      <div className="relative z-10 mx-auto grid min-h-screen lg:grid-cols-2">
        {/* Branding */}
        <section className="flex flex-col justify-between border-b border-white/10 px-6 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12 xl:px-20">
          <div className="brand-topline flex items-center gap-3 text-[0.65rem] tracking-[0.18em] text-muted-foreground sm:text-xs">
            <span className="status-dot size-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_16px_var(--cyan)]" />
            <span>DEVCORE / KNOWLEDGE SYSTEM</span>
          </div>

          <div className="brand-content my-12 max-w-2xl lg:my-0">
            <p className="eyebrow mb-4 text-xs tracking-[0.18em] text-cyan-400 uppercase">
              A calmer place to think.
            </p>

            <h1 className="text-4xl leading-[1.05] font-normal tracking-[-0.06em] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              Your knowledge,
              <br />
              <em className="text-violet-300">finally connected.</em>
            </h1>

            <p className="brand-copy mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:mt-8 sm:text-base">
              Keep notes, questions, snippets, and hard-won lessons in one
              beautiful learning place. Organize everything by topic and custom
              tags, then find the thread when you need it.
            </p>

            <div className="feature-row mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[0.65rem] tracking-[0.15em] text-violet-200 sm:mt-10 sm:gap-x-8 sm:text-xs">
              <span>NOTES</span>
              <span>QUESTIONS</span>
              <span>SNIPPETS</span>
              <span>TAGS</span>
            </div>
          </div>

          <div className="brand-footer flex items-center gap-3 text-[0.6rem] tracking-[0.12em] text-muted-foreground sm:gap-4 sm:text-[0.65rem]">
            <span className="shrink-0">© 2026 DEVCORE</span>
            <span className="h-px min-w-4 flex-1 bg-white/15" />
            <span className="shrink-0">EST. FOR CURIOUS MINDS</span>
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
