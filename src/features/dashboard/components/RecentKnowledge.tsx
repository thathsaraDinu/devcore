import Link from "next/link";

type RecentKnowledgeProps = {
  recentNotes: {
    id: string;
    title: string;
    updatedAt: string;
  }[];

  recentQuestions: {
    id: string;
    question: string;
    status: "OPEN" | "RESOLVED";
    updatedAt: string;
  }[];

  recentSnippets: {
    id: string;
    title: string;
    language: string;
    updatedAt: string;
  }[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function RecentKnowledge({
  recentNotes,
  recentQuestions,
  recentSnippets,
}: RecentKnowledgeProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="overflow-hidden rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-rose-muted/30">
          <h2 className="font-semibold text-rose">
            Recent Notes
          </h2>

          <Link
            href="/notes"
            className="text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            View all
          </Link>
        </div>

        {recentNotes.length > 0 ? (
          <div className="divide-y divide-border">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group block px-5 py-4 transition-colors hover:bg-surface-hover"
              >
                <p className="truncate text-sm font-medium text-text-primary">
                  {note.title}
                </p>

                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-text-muted">
                  <span>
                    Updated {formatDate(note.updatedAt)}
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-text-muted"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8">
            <p className="text-sm text-text-muted">
              No notes yet.
            </p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-accent-muted/30">
          <h2 className="font-semibold text-accent">
            Recent Questions
          </h2>

          <Link
            href="/questions"
            className="text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            View all
          </Link>
        </div>

        {recentQuestions.length > 0 ? (
          <div className="divide-y divide-border">
            {recentQuestions.map((question) => (
              <Link
                key={question.id}
                href={`/questions/${question.id}`}
                className="group block px-5 py-4 transition-colors hover:bg-surface-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-text-primary">
                    {question.question}
                  </p>

                  <span className="shrink-0 text-xs text-text-muted">
                    {question.status === "OPEN"
                      ? "Open"
                      : "Resolved"}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-text-muted">
                  <span>
                    Updated{" "}
                    {formatDate(question.updatedAt)}
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-text-muted"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8">
            <p className="text-sm text-text-muted">
              No questions yet.
            </p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-cyan-muted/30">
          <h2 className="font-semibold text-cyan">
            Recent Snippets
          </h2>

          <Link
            href="/snippets"
            className="text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            View all
          </Link>
        </div>

        {recentSnippets.length > 0 ? (
          <div className="divide-y divide-border">
            {recentSnippets.map((snippet) => (
              <Link
                key={snippet.id}
                href={`/snippets/${snippet.id}`}
                className="group block px-5 py-4 transition-colors hover:bg-surface-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-text-primary">
                    {snippet.title}
                  </p>

                  <span className="shrink-0 font-mono text-xs text-text-muted">
                    {snippet.language}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-text-muted">
                  <span>
                    Updated{" "}
                    {formatDate(snippet.updatedAt)}
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-text-muted"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8">
            <p className="text-sm text-text-muted">
              No snippets yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
