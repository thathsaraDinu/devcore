import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import QuestionEditor from "@/features/questions/components/QuestionEditor";
import { getTopics } from "@/server/topics/queries";
import { getTags } from "@/server/tags/queries";

export const metadata = {
  title: "New Question",
};

export default async function NewQuestionPage() {
  const [topics, tags] = await Promise.all([getTopics(), getTags()]);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-6">
          <Link
            href="/questions"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Questions
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Knowledge</p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            New Question
          </h1>
        </header>

        <section className="mt-8 max-w-8xl">
          <QuestionEditor topics={topics} tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}
