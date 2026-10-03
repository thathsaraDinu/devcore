import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import CopyCodeButton from "@/features/snippets/components/CopyCodeButton";
import DeleteSnippetButton from "@/features/snippets/components/DeleteSnippetButton";

import { getSnippetById } from "@/server/snippets/queries";
import TagList from "@/features/tags/components/TagList";

type SnippetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Snippet",
};

export default async function SnippetPage({ params }: SnippetPageProps) {
  const { id } = await params;

  const snippet = await getSnippetById(id);

  if (!snippet) {
    notFound();
  }

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-8">
          <Link
            href="/snippets"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Snippets
          </Link>
        </div>

        <article className="max-w-5xl">
          <header>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                {snippet.topicPath.length > 0 ? (
                  <p className="text-sm font-medium text-accent">
                    {snippet.topicPath.join(" / ")}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-text-muted">
                    No topic
                  </p>
                )}
                {snippet.tags.length > 0 && (
                  <div className="mt-4">
                    <TagList tags={snippet.tags} />
                  </div>
                )}

                <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
                    {snippet.title}
                  </h1>

                  <span className="shrink-0 rounded-md border border-border px-2 py-1 font-mono text-xs text-text-muted">
                    {snippet.language}
                  </span>
                </div>

                <p className="mt-3 text-sm text-text-muted">
                  Updated {new Date(snippet.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <CopyCodeButton code={snippet.code} />

                <Link
                  href={`/snippets/${snippet.id}/edit`}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                >
                  Edit
                </Link>

                <DeleteSnippetButton snippetId={snippet.id} />
              </div>
            </div>
          </header>

          {snippet.description && (
            <section className="mt-8">
              <p className="whitespace-pre-wrap text-base leading-8 text-text-secondary">
                {snippet.description}
              </p>
            </section>
          )}

          <section className="mt-8">
            <pre className="overflow-x-auto rounded-lg border border-border bg-background p-5 subtle-scrollbar">
              <code className="font-mono text-sm leading-6 text-text-primary">
                {snippet.code}
              </code>
            </pre>
          </section>
        </article>
      </div>
    </AppShell>
  );
}
