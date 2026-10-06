import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { renderRichText } from "@/components/editor/renderRichText";
import DeleteQuestionButton from "@/features/questions/components/DeleteQuestionButton";
import QuestionNotesReader from "@/features/questions/components/QuestionNotesReader";
import QuestionStatusButton from "@/features/questions/components/QuestionStatusButton";
import TagList from "@/features/tags/components/TagList";

import { getNotes } from "@/server/notes/queries";
import { getQuestionById } from "@/server/questions/queries";
import { getTopics } from "@/server/topics/queries";
import QuestionNotesManager from "@/features/questions/components/QuestionNotesManager";

type QuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Question",
};

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { id } = await params;

  const [question, notes] = await Promise.all([
    getQuestionById(id),
    getNotes(),
  ]);

  if (!question) {
    notFound();
  }

  const answerHtml = question.answer ? renderRichText(question.answer) : null;

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          <Link
            href="/questions"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Questions
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.9fr)]">
          {" "}
          <article className="min-w-0">
            <header>
              <div>
                {question.topicPath.length > 0 && (
                  <p className="text-sm font-medium text-accent">
                    {question.topicPath.join(" / ")}
                  </p>
                )}

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
                  {question.question}
                </h1>

                <p className="mt-3 text-sm text-text-muted">
                  Updated {new Date(question.updatedAt).toLocaleDateString()}
                </p>

                {question.tags.length > 0 && (
                  <div className="mt-4">
                    <TagList tags={question.tags} />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <QuestionStatusButton
                  questionId={question.id}
                  status={question.status}
                />

                <Link
                  href={`/questions/${question.id}/edit`}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                >
                  Edit
                </Link>

                <DeleteQuestionButton questionId={question.id} />
              </div>
            </header>

            <section className="mt-10">
              <h2 className="text-sm font-medium text-text-primary">Answer</h2>

              {answerHtml ? (
                <div
                  className="devcore-editor prose prose-invert mt-4 max-w-none"
                  dangerouslySetInnerHTML={{ __html: answerHtml }}
                />
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-border p-6">
                  <p className="text-sm text-text-muted">
                    No answer yet. Come back when you've figured it out.
                  </p>
                </div>
              )}
            </section>
          </article>
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <QuestionNotesReader
                relatedNotes={question.relatedNotes}
                notes={notes}
              />

              <QuestionNotesManager
                questionId={question.id}
                questionTopicId={question.topicId}
                notes={notes}
                relatedNotes={question.relatedNotes}
              />
            </aside>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
