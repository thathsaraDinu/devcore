import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import TopicForm from "@/features/topics/components/TopicForm";
import { getTopicById, getTopics } from "@/server/topics/queries";
import { getTopicDescendantIds } from "@/features/topics/utils/getTopicDescendantIds";

type EditTopicPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Edit Topic",
};

export default async function EditTopicPage({ params }: EditTopicPageProps) {
  const { id } = await params;

  const [topic, topics] = await Promise.all([getTopicById(id), getTopics()]);

  if (!topic) {
    notFound();
  }

  const descendantIds = getTopicDescendantIds(topics, topic.id);

  const blockedIds = new Set([topic.id, ...descendantIds]);

  const selectableTopics = topics.filter((item) => !blockedIds.has(item.id));

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
            Edit Topic
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Update this personal topic or move it within your topic hierarchy.
          </p>
        </header>

        <section className="mt-10 max-w-3xl">
          <TopicForm topics={selectableTopics} initialTopic={topic} />
        </section>
      </div>
    </AppShell>
  );
}
