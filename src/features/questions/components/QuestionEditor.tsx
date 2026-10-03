"use client";

import { useState } from "react";

import TagPicker from "@/features/tags/components/TagPicker";
import type { Tag } from "@/features/tags/types/tag";
import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { createQuestion, updateQuestion } from "@/server/questions/mutations";

import type { Question } from "../types/question";

type QuestionEditorProps = {
  topics: Topic[];
  tags: Tag[];
  initialQuestion?: Question;
};

type FormErrors = {
  question?: string;
};

export default function QuestionEditor({
  topics,
  tags,
  initialQuestion,
}: QuestionEditorProps) {
  const [question, setQuestion] = useState(initialQuestion?.question ?? "");

  const [answer, setAnswer] = useState(initialQuestion?.answer ?? "");

  const [topicId, setTopicId] = useState(initialQuestion?.topicId ?? "");

  const [selectedTagIds, setSelectedTagIds] = useState(
    initialQuestion?.tags.map((tag) => tag.id) ?? [],
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialQuestion);

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!question.trim()) {
      nextErrors.question = "Question is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const input = {
      question,
      answer: answer.trim() || null,
      topicId: topicId || null,
      tagIds: selectedTagIds,
    };

    if (isEditing) {
      await updateQuestion(initialQuestion!.id, input);
      return;
    }

    await createQuestion(input);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      <div>
        {" "}
        <label
          htmlFor="question"
          className="block text-sm font-medium text-text-primary"
        >
          Question{" "}
        </label>
        <textarea
          id="question"
          name="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What are you trying to understand?"
          rows={4}
          required
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.question)}
          aria-describedby={errors.question ? "question-error" : undefined}
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />
        {errors.question && (
          <p id="question-error" className="mt-2 text-sm text-red-400">
            {errors.question}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-text-primary"
        >
          Answer
        </label>

        <textarea
          id="answer"
          name="answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Write the answer when you figure it out..."
          rows={8}
          disabled={isSubmitting}
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />

        <p className="mt-2 text-sm text-text-muted">
          You can leave this empty and come back to it later.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-text-primary"
          >
            Topic
          </label>

          <div className="mt-2">
            <TopicPicker
              topics={topics}
              value={topicId}
              onChange={setTopicId}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">
            Tags
          </label>

          <div className="mt-2">
            <TagPicker
              tags={tags}
              selectedTagIds={selectedTagIds}
              onChange={setSelectedTagIds}
              disabled={isSubmitting}
            />
          </div>

          <p className="mt-2 text-xs text-text-muted">
            Add labels such as interview, review, or difficult.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Save Question"}
        </button>
      </div>
    </form>
  );
}
