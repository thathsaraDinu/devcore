"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { createNoteForQuestion } from "@/server/questions/mutations";

type QuestionNoteComposerProps = {
  questionId: string;
  question: string;
  answer: string | null;
  topicId: string | null;
  topicPath: string[];
  topics: Topic[];
};

export default function QuestionNoteComposer({
  questionId,
  question,
  answer,
  topicId,
  topicPath,
  topics,
}: QuestionNoteComposerProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState(topicId ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function openComposer() {
    setError("");
    setSelectedTopicId(topicId ?? "");
    setTitle("");
    setContent("");
    setIsOpen(true);
  }

  function closeComposer() {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedContent) {
      setError("Content is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createNoteForQuestion(questionId, {
        title: trimmedTitle,
        content: trimmedContent,
        topicId: selectedTopicId || null,
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create note.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openComposer}
        className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
      >
        + Create Note
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeComposer();
            }
          }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-note-title"
          >
            <div className="shrink-0 border-b border-border p-6">
              {" "}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-accent">
                    Investigation Note
                  </p>

                  <h2
                    id="create-note-title"
                    className="mt-2 text-xl font-semibold tracking-tight text-text-primary"
                  >
                    Create Note
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeComposer}
                  disabled={isSubmitting}
                  aria-label="Close"
                  className="text-xl leading-none text-text-muted transition-colors hover:text-text-primary disabled:opacity-50"
                >
                  ×
                </button>
              </div>
              <div className="mt-5 max-h-56 overflow-y-auto rounded-md border border-border bg-background p-4 subtle-scrollbar">
                {" "}
                <p className="text-xs font-medium text-text-muted">
                  Related Question
                </p>
                {topicPath.length > 0 && (
                  <p className="mt-1 text-xs text-accent">
                    {topicPath.join(" / ")}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {question}
                </p>
                {answer && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-medium text-text-muted">
                      Current Answer
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                      {answer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6 subtle-scrollbar"
            >
              <div>
                <label
                  htmlFor="question-note-title"
                  className="block text-sm font-medium text-text-primary"
                >
                  Title
                </label>

                <input
                  id="question-note-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What did you learn?"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="question-note-content"
                  className="block text-sm font-medium text-text-primary"
                >
                  Content
                </label>

                <textarea
                  id="question-note-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write what you found..."
                  rows={8}
                  disabled={isSubmitting}
                  className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="question-note-topic"
                  className="block text-sm font-medium text-text-primary"
                >
                  Topic
                </label>

                <div className="mt-2">
                  <TopicPicker
                    topics={topics}
                    value={selectedTopicId}
                    onChange={setSelectedTopicId}
                  />
                </div>

                <p className="mt-2 text-xs text-text-muted">
                  The question's topic is selected by default.
                </p>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeComposer}
                  disabled={isSubmitting}
                  className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
