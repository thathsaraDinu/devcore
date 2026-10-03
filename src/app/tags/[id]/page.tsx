import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import TagBadge from "@/features/tags/components/TagBadge";
import DeleteTagButton from "@/features/tags/components/DeleteTagButton";
import TagNameEditor from "@/features/tags/components/TagNameEditor";
import { formatRelativeDate } from "@/lib/date/formatRelativeDate";
import { getTagById } from "@/server/tags/queries";

type TagPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Tag",
};

export default async function TagPage({
  params,
}: TagPageProps) {
  const { id } = await params;

  const tag = await getTagById(id);

  if (!tag) {
    notFound();
  }

  const notes = tag.noteTags.map(({ note }) => note);
  const questions = tag.questionTags.map(
    ({ question }) => question,
  );
  const snippets = tag.snippetTags.map(
    ({ snippet }) => snippet,
  );

  const totalItems =
    notes.length + questions.length + snippets.length;

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 lg:py-10">
        <div className="mb-6">
          <Link
            href="/tags"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Tags
          </Link>
        </div>

        <PageHeader
          eyebrow="Tag"
          title={
            <TagNameEditor
              tagId={tag.id}
              initialName={tag.name}
            />
          }
          description={
            totalItems === 0
              ? "This tag is not attached to any knowledge yet."
              : `Used across ${totalItems} ${
                  totalItems === 1 ? "item" : "items"
                } in DevCore.`
          }
          action={
            <TagBadge
              tag={{
                id: tag.id,
                name: tag.name,
              }}
            />
          }
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface px-5 py-4">
            <p className="text-xs font-medium text-cyan">
              Notes
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
              {notes.length}
            </p>

            <p className="mt-1 text-xs text-text-muted">
              {notes.length === 1
                ? "note uses this tag"
                : "notes use this tag"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface px-5 py-4">
            <p className="text-xs font-medium text-rose">
              Questions
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
              {questions.length}
            </p>

            <p className="mt-1 text-xs text-text-muted">
              {questions.length === 1
                ? "question uses this tag"
                : "questions use this tag"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface px-5 py-4">
            <p className="text-xs font-medium text-accent">
              Snippets
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
              {snippets.length}
            </p>

            <p className="mt-1 text-xs text-text-muted">
              {snippets.length === 1
                ? "snippet uses this tag"
                : "snippets use this tag"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <section className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="border-b border-border bg-cyan-muted/30 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Notes
                  </h2>

                  <p className="mt-1 text-xs text-text-muted">
                    Notes carrying this tag.
                  </p>
                </div>

                <span className="text-xs font-medium text-cyan">
                  {notes.length}
                </span>
              </div>
            </div>

            {notes.length > 0 ? (
              <div className="divide-y divide-border">
                {notes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="group block px-5 py-4 transition-colors hover:bg-surface-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="line-clamp-2 text-sm font-medium text-text-primary transition-colors group-hover:text-cyan">
                        {note.title}
                      </p>

                      <span
                        aria-hidden="true"
                        className="shrink-0 text-sm text-text-muted transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-text-muted">
                      Updated{" "}
                      {formatRelativeDate(note.updatedAt)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-text-muted">
                  No notes use this tag yet.
                </p>
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="border-b border-border bg-rose-muted/30 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Questions
                  </h2>

                  <p className="mt-1 text-xs text-text-muted">
                    Questions carrying this tag.
                  </p>
                </div>

                <span className="text-xs font-medium text-rose">
                  {questions.length}
                </span>
              </div>
            </div>

            {questions.length > 0 ? (
              <div className="divide-y divide-border">
                {questions.map((question) => {
                  const isResolved =
                    question.status === "RESOLVED";

                  return (
                    <Link
                      key={question.id}
                      href={`/questions/${question.id}`}
                      className="group block px-5 py-4 transition-colors hover:bg-surface-hover"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="line-clamp-2 text-sm font-medium text-text-primary transition-colors group-hover:text-rose">
                          {question.question}
                        </p>

                        <span
                          aria-hidden="true"
                          className="shrink-0 text-sm text-text-muted transition-transform group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        <span
                          className={
                            isResolved
                              ? "text-xs font-medium text-success"
                              : "text-xs font-medium text-warning"
                          }
                        >
                          {isResolved
                            ? "Resolved"
                            : "Open"}
                        </span>

                        <span className="text-xs text-text-muted">
                          Updated{" "}
                          {formatRelativeDate(
                            question.updatedAt,
                          )}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-text-muted">
                  No questions use this tag yet.
                </p>
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="border-b border-border bg-accent-muted/30 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Snippets
                  </h2>

                  <p className="mt-1 text-xs text-text-muted">
                    Snippets carrying this tag.
                  </p>
                </div>

                <span className="text-xs font-medium text-accent">
                  {snippets.length}
                </span>
              </div>
            </div>

            {snippets.length > 0 ? (
              <div className="divide-y divide-border">
                {snippets.map((snippet) => (
                  <Link
                    key={snippet.id}
                    href={`/snippets/${snippet.id}`}
                    className="group block px-5 py-4 transition-colors hover:bg-surface-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="line-clamp-2 text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
                        {snippet.title}
                      </p>

                      <span className="shrink-0 font-mono text-[11px] text-text-muted">
                        {snippet.language}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-text-muted">
                      Updated{" "}
                      {formatRelativeDate(
                        snippet.updatedAt,
                      )}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-text-muted">
                  No snippets use this tag yet.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="mt-10 rounded-lg border border-red-500/20 bg-red-500/[0.02]">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Danger Zone
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-text-muted">
                Delete this tag and remove it from all
                associated Notes, Questions, and Snippets.
                The knowledge itself will not be deleted.
              </p>
            </div>

            <DeleteTagButton tagId={tag.id} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}