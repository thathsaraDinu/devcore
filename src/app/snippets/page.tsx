import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import SnippetsBrowser from "@/features/snippets/components/SnippetsBrowser";

import { getSnippets } from "@/server/snippets/queries";
import { getTopics } from "@/server/topics/queries";
import { getTags } from "@/server/tags/queries";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Snippets",
};

export default async function SnippetsPage() {
  const [snippets, topics, tags] = await Promise.all([
    getSnippets(),
    getTopics(),
    getTags(),
  ]);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <PageHeader
          eyebrow="Knowledge"
          title="Snippets"
          description="Keep small, reusable pieces of code and the context around them."
          action={
            <Link
              href="/snippets/new"
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              New Snippet
            </Link>
          }
        />

        <section className="mt-10">
          <SnippetsBrowser
            initialSnippets={snippets}
            topics={topics}
            tags={tags}
          />
        </section>
      </div>
    </AppShell>
  );
}
