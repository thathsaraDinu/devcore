"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";

import RichTextEditor from "@/components/editor/RichTextEditor";
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
  answer?: string;
};

const emptyDocument: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

function getInitialQuestion(
  question: JSONContent | null | undefined,
): JSONContent {
  return question || emptyDocument;
}

function getInitialAnswer(answer: JSONContent | null | undefined): JSONContent {
  return answer || emptyDocument;
}

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

export default function QuestionEditor({
  topics,
  tags,
  initialQuestion,
}: QuestionEditorProps) {
  const router = useRouter();
  const [question, setQuestion] = useState<JSONContent>(
    getInitialQuestion(initialQuestion?.question),
  );

  const [answer, setAnswer] = useState<JSONContent>(
    getInitialAnswer(initialQuestion?.answer),
  );

  const [topicId, setTopicId] = useState(initialQuestion?.topicId ?? "");

  const [selectedTagIds, setSelectedTagIds] = useState(
    initialQuestion?.tags.map((tag) => tag.id) ?? [],
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialQuestion);

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!hasRichTextContent(question)) {
      nextErrors.question = "Question is required.";
    }

    if (answer && !hasRichTextContent(answer)) {
      nextErrors.answer = "Answer must have content.";
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
      question: hasRichTextContent(question)
        ? JSON.parse(JSON.stringify(question))
        : emptyDocument,
      answer: hasRichTextContent(answer)
        ? JSON.parse(JSON.stringify(answer))
        : null,
      topicId: topicId || null,
      tagIds: selectedTagIds,
    };

    try {
      const result = isEditing
        ? await updateQuestion(initialQuestion!.id, input)
        : await createQuestion(input);

      if (result?.redirectUrl) {
        router.replace(result.redirectUrl);
      }
    } catch (error) {
      setErrors({
        answer: "Something went wrong while saving the question.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Question */}
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-text-primary"
          >
            Question
          </label>

          <div className="mt-2">
            <RichTextEditor
              initialContent={getInitialQuestion(initialQuestion?.question)}
              onChange={setQuestion}
              placeholder="What are you trying to understand?"
            />
          </div>

          {errors.question && (
            <p id="question-error" className="mt-2 text-sm text-red-400">
              {errors.question}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-text-primary"
          >
            Answer
          </label>

          <div className="mt-2">
            <RichTextEditor
              initialContent={getInitialAnswer(initialQuestion?.answer)}
              onChange={setAnswer}
              placeholder="Write the answer when you figure it out..."
            />
          </div>

          {errors.answer && (
            <p id="answer-error" className="mt-2 text-sm text-red-400">
              {errors.answer}
            </p>
          )}

          <p className="mt-2 text-sm text-text-muted">
            You can leave this empty and come back to it later.
          </p>
        </div>
      </div>

      {/* Topic + Tags */}
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

      {/* Submit */}
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
