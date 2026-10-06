import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import TopicForm from "@/features/topics/components/TopicForm";
import { getTopics } from "@/server/topics/queries";

export const metadata = {
  title: "New Topic",
};

export default async function NewTopicPage() {
  const topics = await getTopics();

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-6">
          <Link
            href="/topics"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Topics
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Topics</p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Create Topic
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Create a personal topic for something that doesn't fit neatly into
            the system knowledge structure.
          </p>
        </header>

        <section className="mt-10 max-w-3xl">
          <TopicForm topics={topics} />
        </section>
      </div>
    </AppShell>
  );
}
