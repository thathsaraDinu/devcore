"use client";

import { useMemo, useState } from "react";

import type { Note } from "@/features/notes/types/note";

type NotePickerProps = {
  notes: Note[];
  value: string;
  onChange: (noteId: string) => void;
  disabled?: boolean;
};

export default function NotePicker({
  notes,
  value,
  onChange,
  disabled = false,
}: NotePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedNote = notes.find((note) => note.id === value);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return notes;
    }

    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery) ||
        note.topicPath.some((topic) =>
          topic.toLowerCase().includes(normalizedQuery),
        )
      );
    });
  }, [notes, searchQuery]);

  function handleSelect(noteId: string) {
    onChange(noteId);
    setSearchQuery("");
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left text-sm text-text-primary outline-none transition-colors hover:border-border-hover focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="min-w-0 truncate">
          {selectedNote
            ? selectedNote.title
            : "Select a note..."}
        </span>

        <span className="shrink-0 text-text-muted">
          {isOpen ? "↑" : "↓"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border bg-surface shadow-xl">
          <div className="border-b border-border p-2">
            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search notes..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
            />
          </div>

          <div className="max-h-64 overflow-y-auto subtle-scrollbar">
            {filteredNotes.length > 0 ? (
              <div className="p-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => handleSelect(note.id)}
                    className="w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-surface-hover"
                  >
                    {note.topicPath.length > 0 && (
                      <p className="text-xs font-medium text-accent">
                        {note.topicPath.join(" / ")}
                      </p>
                    )}

                    <p className="mt-1 text-sm font-medium text-text-primary">
                      {note.title}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-text-muted">
                      {note.content}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-text-muted">
                No notes found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
