"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Note } from "@/features/notes/types/note";

type RelatedNote = {
  id: string;
  title: string;
  topicPath: string[];
};

type QuestionNotesReaderProps = {
  relatedNotes: RelatedNote[];
  notes: Note[];
};

export default function QuestionNotesReader({
  relatedNotes,
  notes,
}: QuestionNotesReaderProps) {
  const availableNotes = useMemo(() => {
    const relatedNoteIds = new Set(
      relatedNotes.map((note) => note.id),
    );

    return notes.filter((note) =>
      relatedNoteIds.has(note.id),
    );
  }, [notes, relatedNotes]);

  const [selectedNoteId, setSelectedNoteId] =
    useState("");

  const selectedNote = availableNotes.find(
    (note) => note.id === selectedNoteId,
  );

  /*
   * Keep the selected note synchronized with
   * the notes currently connected to the question.
   *
   * Handles:
   * - adding the first note
   * - adding another note
   * - removing the selected note
   * - removing the last remaining note
   */
  useEffect(() => {
    setSelectedNoteId((currentSelectedId) => {
      if (availableNotes.length === 0) {
        return "";
      }

      const selectedStillExists =
        currentSelectedId !== "" &&
        availableNotes.some(
          (note) => note.id === currentSelectedId,
        );

      if (selectedStillExists) {
        return currentSelectedId;
      }

      return availableNotes[0].id;
    });
  }, [availableNotes]);

  if (availableNotes.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-border p-5">
        <h2 className="text-sm font-semibold text-text-primary">
          Related Notes
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          No notes are related to this question yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">
          Related Notes
        </h2>

        <p className="mt-1 text-xs text-text-muted">
          Reference related notes while working through this question.
        </p>
      </div>

      {/* Current note */}
      {selectedNote && (
        <article className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                  {selectedNote.title}
                </h3>

                {selectedNote.topicPath.length > 0 && (
                  <p className="mt-2 text-xs font-medium text-accent">
                    {selectedNote.topicPath.join(" / ")}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-xs text-text-muted">
                {availableNotes.length}{" "}
                {availableNotes.length === 1
                  ? "note"
                  : "notes"}
              </span>
            </div>
          </div>

          <div className="max-h-[55vh] overflow-y-auto px-6 py-6 subtle-scrollbar bg-gray-950">
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-text-secondary">
              {selectedNote.content}
            </div>
          </div>

          <div className="border-t border-border px-6 py-4">
            <a
              href={`/notes/${selectedNote.id}`}
              className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Open full note →
            </a>
          </div>
        </article>
      )}

      {/* Other related notes */}
      {availableNotes.length > 1 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Other Related Notes
            </h3>

            <span className="text-xs text-text-muted">
              {availableNotes.length - 1}
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="divide-y divide-border">
              {availableNotes.map((note) => {
                if (note.id === selectedNoteId) {
                  return null;
                }

                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() =>
                      setSelectedNoteId(note.id)
                    }
                    className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                        {note.title}
                      </p>

                      {note.topicPath.length > 0 && (
                        <p className="mt-1 truncate text-xs text-text-muted">
                          {note.topicPath.join(" / ")}
                        </p>
                      )}
                    </div>

                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
                    >
                      <path
                        d="M7.5 5L12.5 10L7.5 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
