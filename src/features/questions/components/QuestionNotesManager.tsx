"use client";

import { useState } from "react";
import type { JSONContent } from "@tiptap/react";

import {
  attachNoteToQuestion,
  detachNoteFromQuestion,
  createNoteForQuestion,
} from "@/server/questions/mutations";

import type { Note } from "@/features/notes/types/note";
import RichTextEditor from "@/components/editor/RichTextEditor";

type RelatedNote = {
  id: string;
  title: string;
  topicPath: string[];
};

type QuestionNotesManagerProps = {
  questionId: string;
  questionTopicId: string | null;
  notes: Note[];
  relatedNotes: RelatedNote[];
};

const emptyDocument: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function hasRichTextContent(content: JSONContent): boolean {
  if (!content.content) {
    return false;
  }

  return content.content.some((node: JSONContent) => {
    if (node.type === "text") {
      return Boolean(node.text?.trim());
    }

    return hasRichTextContent(node);
  });
}

export default function QuestionNotesManager({
  questionId,
  questionTopicId,
  notes,
  relatedNotes,
}: QuestionNotesManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const relatedIds = new Set(
    relatedNotes.map((note) => note.id),
  );

  const availableNotes = notes.filter(
    (note) => !relatedIds.has(note.id),
  );

  async function handleAttach() {
    if (!selectedNoteId || isWorking) {
      return;
    }

    setIsWorking(true);

    try {
      await attachNoteToQuestion(
        questionId,
        selectedNoteId,
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDetach(noteId: string) {
    if (isWorking) {
      return;
    }

    setIsWorking(true);

    try {
      await detachNoteFromQuestion(
        questionId,
        noteId,
      );
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
      >
        {isOpen ? "Hide management" : "Manage notes"}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-5 rounded-md border border-border bg-background p-4">
          <div>
            <p className="text-xs font-medium text-text-muted">
              Attached Notes
            </p>

            {relatedNotes.length > 0 ? (
              <div className="mt-2 divide-y divide-border rounded-md border border-border">
                {relatedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <p className="min-w-0 truncate text-sm text-text-primary">
                      {note.title}
                    </p>

                    <button
                      type="button"
                      disabled={isWorking}
                      onClick={() =>
                        void handleDetach(note.id)
                      }
                      className="shrink-0 text-xs text-text-muted transition-colors hover:text-red-400 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-text-muted">
                No related notes.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted">
              Attach an existing note
            </p>

            <div className="mt-2 flex gap-2">
              <select
                value={selectedNoteId}
                onChange={(event) =>
                  setSelectedNoteId(event.target.value)
                }
                disabled={
                  isWorking ||
                  availableNotes.length === 0
                }
                className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              >
                <option value="">
                  {availableNotes.length > 0
                    ? "Select a note..."
                    : "No notes available"}
                </option>

                {availableNotes.map((note) => (
                  <option
                    key={note.id}
                    value={note.id}
                  >
                    {note.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={
                  !selectedNoteId || isWorking
                }
                onClick={() => void handleAttach()}
                className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Attach
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                setShowCreateForm(
                  (value) => !value,
                )
              }
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {showCreateForm
                ? "Cancel"
                : "+ Create Note"}
            </button>

            {showCreateForm && (
              <CreateQuestionNoteForm
                questionId={questionId}
                questionTopicId={questionTopicId}
                disabled={isWorking}
                onCreated={() =>
                  setShowCreateForm(false)
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type CreateQuestionNoteFormProps = {
  questionId: string;
  questionTopicId: string | null;
  disabled: boolean;
  onCreated: () => void;
};

function CreateQuestionNoteForm({
  questionId,
  questionTopicId,
  disabled,
  onCreated,
}: CreateQuestionNoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] =
    useState<JSONContent>(emptyDocument);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim() || !hasRichTextContent(content)) {
      return;
    }

    setIsSaving(true);

    try {
      await createNoteForQuestion(questionId, {
        title: title.trim(),
        content: JSON.parse(JSON.stringify(content)),
        topicId: questionTopicId,
      });

      onCreated();
    } finally {
      setIsSaving(false);
    }
  }

  const hasContent = hasRichTextContent(content);

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-3"
    >
      <input
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        placeholder="Note title"
        disabled={disabled || isSaving}
        className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
      />

      <RichTextEditor
        initialContent={emptyDocument}
        onChange={setContent}
        placeholder="Write the note..."
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            disabled ||
            isSaving ||
            !title.trim() ||
            !hasContent
          }
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Creating..." : "Create Note"}
        </button>
      </div>
    </form>
  );
}