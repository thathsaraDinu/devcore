import Link from "next/link";

type OpenQuestionsProps = {
  questions: {
    id: string;
    question: string;
    topic: {
      name: string;
    } | null;
    updatedAt: string;
  }[];
};

export default function OpenQuestions({
  questions,
}: OpenQuestionsProps) {
  return (
    <section className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 bg-indigo-muted/40">
        <div>
          <h2 className="font-semibold text-indigo">
            Open Questions
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Things you still want to figure out.
          </p>
        </div>

        <Link
          href="/questions?status=open"
          className="shrink-0 text-xs text-text-secondary transition-colors hover:text-text-primary"
        >
          View all
        </Link>
      </div>

      {questions.length > 0 ? (
        <div className="divide-y divide-border">
          {questions.map((question) => (
            <Link
              key={question.id}
              href={`/questions/${question.id}`}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {question.question}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span>
                    {question.topic?.name ?? "No topic"}
                  </span>

                  <span aria-hidden="true">·</span>

                  <span>
                    Updated{" "}
                    {new Date(
                      question.updatedAt,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <span className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-5 py-8">
          <p className="text-sm text-text-muted">
            No open questions. Nice work.
          </p>
        </div>
      )}
    </section>
  );
}
