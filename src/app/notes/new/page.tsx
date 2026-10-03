import AppShell from "@/components/layout/AppShell";
import NoteEditor from "@/features/notes/components/NoteEditor";
import { getTags } from "@/server/tags/queries";
import { getTopics } from "@/server/topics/queries";

export const metadata = {
  title: "New Note",
};

export default async function NewNotePage() {
  const [topics, tags] = await Promise.all([getTopics(), getTags()]);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <header>
          <p className="text-sm font-medium text-accent">Notes</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Create Note
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Capture something you learned and connect it to the relevant topic.
          </p>
        </header>

        <section className="mt-10 max-w-3xl">
          <NoteEditor topics={topics} tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}
