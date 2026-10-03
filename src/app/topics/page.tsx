import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import TopicList from "@/features/topics/components/TopicList";
import { getTopics } from "@/server/topics/queries";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Topics",
};

export default async function TopicsPage() {
  const topics = await getTopics();

  const rootTopicCount = topics.filter(
    (topic) => topic.parentId === null,
  ).length;

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10">
        <PageHeader
          eyebrow="Knowledge"
          title="Topics"
          description="Explore the structure that organizes your knowledge across DevCore."
          action={
            <Link
              href="/topics/new"
              className="shrink-0 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              New Topic{" "}
            </Link>
          }
        />

        <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
          <span>
            {topics.length} {topics.length === 1 ? "topic" : "topics"}
          </span>

          <span aria-hidden="true">·</span>

          <span>{rootTopicCount} top-level</span>
        </div>

        <section className="mt-10" aria-labelledby="topics-heading">
          <div className="mb-5">
            <h2
              id="topics-heading"
              className="text-base font-semibold text-text-primary"
            >
              Knowledge Map
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Browse your topics and their child concepts.
            </p>
          </div>

          <TopicList topics={topics} />
        </section>
      </div>
    </AppShell>
  );
}
