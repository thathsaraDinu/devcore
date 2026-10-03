import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import NoteEditor from "@/features/notes/components/NoteEditor";
import { getNoteById } from "@/server/notes/queries";
import { getTopics } from "@/server/topics/queries";
import { getTags } from "@/server/tags/queries";

type EditNotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Edit Note",
};

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;

  const [note, topics, tags] = await Promise.all([
    getNoteById(id),
    getTopics(),
    getTags(),
  ]);

  if (!note) {
    notFound();
  }

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <div className="mb-8">
          <Link
            href={`/notes/${note.id}`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Note
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Notes</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Edit Note
          </h1>

          <p className="mt-2 max-w-2xl text-text-secondary">
            Update your understanding or change the topic associated with this
            note.
          </p>
        </header>

        <section className="mt-10 max-w-3xl">
          <NoteEditor initialNote={note} topics={topics} tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}
