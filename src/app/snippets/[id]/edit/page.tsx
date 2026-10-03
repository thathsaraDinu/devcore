import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import SnippetEditor from "@/features/snippets/components/SnippetEditor";

import { getSnippetById } from "@/server/snippets/queries";
import { getTags } from "@/server/tags/queries";
import { getTopics } from "@/server/topics/queries";

type EditSnippetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Edit Snippet",
};

export default async function EditSnippetPage({
  params,
}: EditSnippetPageProps) {
  const { id } = await params;

  const [snippet, topics, tags] = await Promise.all([
    getSnippetById(id),
    getTopics(),
    getTags(),
  ]);

  if (!snippet) {
    notFound();
  }

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-8">
          <Link
            href={`/snippets/${snippet.id}`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Snippet
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Knowledge</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Edit Snippet
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Update the code or the context around it.
          </p>
        </header>

        <section className="mt-10 max-w-4xl">
          <SnippetEditor topics={topics} tags={tags} initialSnippet={snippet} />
        </section>
      </div>
    </AppShell>
  );
}
