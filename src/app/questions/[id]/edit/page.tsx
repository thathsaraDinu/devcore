import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import QuestionEditor from "@/features/questions/components/QuestionEditor";
import { getQuestionById } from "@/server/questions/queries";
import { getTopics } from "@/server/topics/queries";
import { getTags } from "@/server/tags/queries";

type EditQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Edit Question",
};

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { id } = await params;

  const [question, topics, tags] = await Promise.all([
    getQuestionById(id),
    getTopics(),
    getTags(),
  ]);

  if (!question) {
    notFound();
  }

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-8">
          <Link
            href={`/questions/${question.id}`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Question
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Knowledge</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Edit Question
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Update the question, answer, or topic.
          </p>
        </header>

        <section className="mt-10 max-w-3xl">
          <QuestionEditor
            topics={topics}
            tags={tags}
            initialQuestion={question}
          />
        </section>
      </div>
    </AppShell>
  );
}
