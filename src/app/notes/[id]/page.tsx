import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { renderRichText } from "@/components/editor/renderRichText";
import DeleteNoteButton from "@/features/notes/components/DeleteNoteButton";
import TagList from "@/features/tags/components/TagList";
import { getNoteById } from "@/server/notes/queries";

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  const html = renderRichText(note.content);

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          <Link
            href="/notes"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to Notes
          </Link>
        </div>

        <article className="max-w-5xl">
          <header>
            <div className="flex items-start justify-between gap-6">
              <div>
                {note.topicPath.length > 0 ? (
                  <p className="text-sm font-medium text-accent">
                    {note.topicPath.join(" / ")}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-text-muted">
                    No topic
                  </p>
                )}

                {note.tags.length > 0 && (
                  <div className="mt-4">
                    <TagList tags={note.tags} />
                  </div>
                )}

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {note.title}
                </h1>

                <p className="mt-3 text-sm text-text-muted">
                  Updated{" "}
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/notes/${note.id}/edit`}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                >
                  Edit
                </Link>

                <DeleteNoteButton noteId={note.id} />
              </div>
            </div>
          </header>

          <div
            className="devcore-editor prose prose-invert mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </AppShell>
  );
}