import DevCoreLogo from "@/components/ui/DevCoreLogo";

export default function Loading() {
  return (
    <div className="relative min-h-[60vh] overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/[0.05] blur-3xl"
      />

      {/* Loading line */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px overflow-hidden bg-border/50"
      >
        <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        {/* Brand loading state */}
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative">
            <div className="absolute -inset-5 rounded-full bg-accent/10 blur-xl" />

            <div className="relative">
              <DevCoreLogo size={52} />
            </div>
          </div>

          <p className="mt-5 text-sm font-medium text-text-primary">
            Loading workspace
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Preparing your knowledge base...
          </p>
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="h-8 w-44 animate-pulse rounded-md bg-surface" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-surface" />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-56 animate-pulse rounded-md bg-surface" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-surface" />
            <div className="h-10 w-28 animate-pulse rounded-md bg-surface" />
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-lg border border-border bg-surface"
              >
                <div className="space-y-4 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-surface-hover" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-surface-hover" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-surface-hover" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-surface-hover" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <div className="h-5 w-14 animate-pulse rounded-full bg-surface-hover" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-surface-hover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}