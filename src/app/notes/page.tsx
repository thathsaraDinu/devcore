import Link from "next/link";

import AppShell from "@/components/layout/AppShell";
import NotesBrowser from "@/features/notes/components/NotesBrowser";
import { getNotes } from "@/server/notes/queries";
import { getTopics } from "@/server/topics/queries";
import PageHeader from "@/components/ui/PageHeader";
import { getTags } from "@/server/tags/queries";

export const metadata = {
  title: "Notes",
};

export default async function NotesPage() {
  const [notes, topics, tags] = await Promise.all([
    getNotes(),
    getTopics(),
    getTags(),
  ]);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10 ">
        <PageHeader
          eyebrow="Knowledge"
          title="Notes"
          description="Capture and organize the things you've learned."
          action={
            <Link
              href="/notes/new"
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              New Note
            </Link>
          }
        />

        <section className="mt-10" aria-labelledby="notes-heading">
          <div className="mb-6">
            <h2 id="notes-heading" className="text-xl font-semibold">
              Your Notes
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Notes you've created while learning.
            </p>
          </div>

          <NotesBrowser initialNotes={notes} topics={topics} tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}
