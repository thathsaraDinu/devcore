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
        <div className="mb-6">
          <Link
            href={`/notes/${note.id}`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Note
          </Link>
        </div>

        <header>
          <p className="text-sm font-medium text-accent">Notes</p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Edit Note
          </h1>
        </header>

        <section className="mt-8 max-w-5xl">
          <NoteEditor initialNote={note} topics={topics} tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}
