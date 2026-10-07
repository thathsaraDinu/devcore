import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { renderRichText } from "@/components/editor/renderRichText";
import DeleteQuestionButton from "@/features/questions/components/DeleteQuestionButton";
import QuestionStatusButton from "@/features/questions/components/QuestionStatusButton";
import TagList from "@/features/tags/components/TagList";
import QuestionSidebar from "@/features/questions/components/QuestionSidebar";

import { getNotes } from "@/server/notes/queries";
import { getQuestionById } from "@/server/questions/queries";

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

  const questionHtml = renderRichText(question.question);
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
          {/* Left column - Question */}
          <article className="min-w-0">
            <header>
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  {question.topicPath.length > 0 ? (
                    <p className="text-sm font-medium text-accent">
                      {question.topicPath.join(" / ")}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-text-muted">
                      No topic
                    </p>
                  )}

                  {question.tags.length > 0 && (
                    <div className="mt-4">
                      <TagList tags={question.tags} />
                    </div>
                  )}

                  <div className="mt-2">
                    <div
                      className="devcore-editor prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: questionHtml }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-text-muted">
                    Updated {new Date(question.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
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
              </div>
            </header>
          </article>

          {/* Right column - Tabs */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <QuestionSidebar
              answer={question.answer}
              relatedNotes={question.relatedNotes}
              notes={notes}
              questionId={question.id}
              questionTopicId={question.topicId}
            />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
