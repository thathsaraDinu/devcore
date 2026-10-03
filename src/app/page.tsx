import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentKnowledge from "@/features/dashboard/components/RecentKnowledge";
import { getDashboardData } from "@/server/dashboard/queries";
import OpenQuestions from "@/features/dashboard/components/OpenQuestions";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10">
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="Your technical knowledge at a glance."
        />

        <section className="mt-10">
          <DashboardStats counts={dashboard.counts} />
        </section>

        <section className="mt-10">
          <OpenQuestions questions={dashboard.openQuestions} />
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-text-primary">
              Recent Knowledge
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Continue where you left off.
            </p>
          </div>

          <RecentKnowledge
            recentNotes={dashboard.recentNotes}
            recentQuestions={dashboard.recentQuestions}
            recentSnippets={dashboard.recentSnippets}
          />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-text-primary">
            Quick Actions
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/notes/new"
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              New Note
            </Link>

            <Link
              href="/questions/new"
              className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              New Question
            </Link>

            <Link
              href="/snippets/new"
              className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              New Snippet
            </Link>

            <Link
              href="/topics/new"
              className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              New Topic
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
