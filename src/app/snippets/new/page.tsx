import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import SnippetEditor from "@/features/snippets/components/SnippetEditor";
import { getTags } from "@/server/tags/queries";
import { getTopics } from "@/server/topics/queries";

export const metadata = {
  title: "New Snippet",
};

export default async function NewSnippetPage() {
  const [topics, tags] = await Promise.all([getTopics(), getTags()]);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-6">
          <Link
            href="/snippets"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Snippets
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Knowledge</p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            New Snippet
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Save a reusable piece of code with the context you'll need later.
          </p>
        </header>

        <section className="mt-8 max-w-5xl">
          <SnippetEditor topics={topics} tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}
