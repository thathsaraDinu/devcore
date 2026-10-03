import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import QuestionsBrowser from "@/features/questions/components/QuestionsBrowser";
import { getQuestions } from "@/server/questions/queries";
import { getTags } from "@/server/tags/queries";
import { getTopics } from "@/server/topics/queries";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Questions",
};

export default async function QuestionsPage() {
  const [questions, topics, tags] = await Promise.all([
    getQuestions(),
    getTopics(),
    getTags(),
  ]);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <PageHeader
          eyebrow="Knowledge"
          title="Questions"
          description="Capture things you don't understand yet and come back to resolve them."
          action={
            <Link
              href="/questions/new"
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              New Question
            </Link>
          }
        />

        <section className="mt-10" aria-labelledby="questions-heading">
          <div className="mb-6">
            <h2 id="questions-heading" className="text-xl font-semibold">
              Your Questions
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Questions you've captured while learning.
            </p>
          </div>

          <QuestionsBrowser
            initialQuestions={questions}
            topics={topics}
            tags={tags}
          />
        </section>
      </div>
    </AppShell>
  );
}
