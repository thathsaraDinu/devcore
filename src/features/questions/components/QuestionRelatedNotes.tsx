"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  attachNoteToQuestion,
  detachNoteFromQuestion,
} from "@/server/questions/mutations";

import type { QuestionRelatedNote } from "../types/question";

import type { Note } from "@/features/notes/types/note";
import { Topic } from "@/features/topics/types/topic";
import QuestionNoteComposer from "./QuestionNoteComposer";
import NotePicker from "./NotePicker";

type QuestionRelatedNotesProps = {
  questionId: string;
  question: string;
  answer: string | null;
  questionTopicId: string | null;
  questionTopicPath: string[];
  relatedNotes: QuestionRelatedNote[];
  notes: Note[];
  topics: Topic[];
};

export default function QuestionRelatedNotes({
  questionId,
  question,
  answer,
  questionTopicId,
  questionTopicPath,
  relatedNotes,
  notes,
  topics,
}: QuestionRelatedNotesProps) {
  const router = useRouter();

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relatedNoteIds = new Set(relatedNotes.map((note) => note.id));

  const availableNotes = notes.filter((note) => !relatedNoteIds.has(note.id));

  async function handleAttach() {
    if (!selectedNoteId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await attachNoteToQuestion(questionId, selectedNoteId);

      setSelectedNoteId("");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDetach(noteId: string) {
    setIsSubmitting(true);

    try {
      await detachNoteFromQuestion(questionId, noteId);

      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Related Notes
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Notes that helped you investigate this question.
            </p>
          </div>

          <QuestionNoteComposer
            questionId={questionId}
            question={question}
            answer={answer}
            topicId={questionTopicId}
            topicPath={questionTopicPath}
            topics={topics}
          />
        </div>
      </div>

      {relatedNotes.length > 0 ? (
        <div className="space-y-3">
          {relatedNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <Link href={`/notes/${note.id}`} className="min-w-0">
                {note.topicPath.length > 0 && (
                  <p className="text-xs font-medium text-accent">
                    {note.topicPath.join(" / ")}
                  </p>
                )}

                <p className="mt-1 truncate text-sm font-medium text-text-primary">
                  {note.title}
                </p>
              </Link>

              <button
                type="button"
                onClick={() => handleDetach(note.id)}
                disabled={isSubmitting}
                className="shrink-0 text-sm text-text-muted transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6">
          <p className="text-sm text-text-muted">No related notes yet.</p>
        </div>
      )}

      {availableNotes.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1">
            <NotePicker
              notes={availableNotes}
              value={selectedNoteId}
              onChange={setSelectedNoteId}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="button"
            onClick={handleAttach}
            disabled={!selectedNoteId || isSubmitting}
            className="shrink-0 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Attach Note"}
          </button>
        </div>
      )}
    </section>
  );
}
