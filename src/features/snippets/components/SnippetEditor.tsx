"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import TagPicker from "@/features/tags/components/TagPicker";
import type { Tag } from "@/features/tags/types/tag";
import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { createSnippet, updateSnippet } from "@/server/snippets/mutations";

import type { Snippet } from "../types/snippet";

type SnippetEditorProps = {
  topics: Topic[];
  tags: Tag[];
  initialSnippet?: Snippet;
};

type FormErrors = {
  title?: string;
  language?: string;
  code?: string;
};

export default function SnippetEditor({
  topics,
  tags,
  initialSnippet,
}: SnippetEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialSnippet?.title ?? "");

  const [language, setLanguage] = useState(initialSnippet?.language ?? "");

  const [code, setCode] = useState(initialSnippet?.code ?? "");

  const [description, setDescription] = useState(
    initialSnippet?.description ?? "",
  );

  const [topicId, setTopicId] = useState(initialSnippet?.topicId ?? "");

  const [selectedTagIds, setSelectedTagIds] = useState(
    initialSnippet?.tags.map((tag) => tag.id) ?? [],
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialSnippet);

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!language.trim()) {
      nextErrors.language = "Language is required.";
    }

    if (!code.trim()) {
      nextErrors.code = "Code is required.";
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
      title,
      language,
      code,
      description: description.trim() || null,
      topicId: topicId || null,
      tagIds: selectedTagIds,
    };

    try {
      const result = isEditing
        ? await updateSnippet(initialSnippet!.id, input)
        : await createSnippet(input);

      if (result?.redirectUrl) {
        if (isEditing) {
          router.back();
        } else {
          router.replace(result.redirectUrl);
        }
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="snippet-title"
          className="block text-sm font-medium text-text-primary"
        >
          Title
        </label>

        <input
          id="snippet-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Debounce Hook"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.title)}
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-400">{errors.title}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="snippet-language"
            className="block text-sm font-medium text-text-primary"
          >
            Language
          </label>

          <input
            id="snippet-language"
            type="text"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            placeholder="e.g. TypeScript"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.language)}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
          />

          {errors.language && (
            <p className="mt-2 text-sm text-red-400">{errors.language}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="snippet-topic"
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

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="snippet-code"
            className="block text-sm font-medium text-text-primary"
          >
            Code
          </label>

          <span className="text-xs text-text-muted">{language || "Code"}</span>
        </div>

        <textarea
          id="snippet-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Paste or write your code here..."
          rows={18}
          spellCheck={false}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.code)}
          className="mt-2 w-full resize-y rounded-md border border-border bg-background px-4 py-3 font-mono text-sm leading-6 text-text-primary outline-none transition-colors placeholder:font-sans placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />

        {errors.code && (
          <p className="mt-2 text-sm text-red-400">{errors.code}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="snippet-description"
          className="block text-sm font-medium text-text-primary"
        >
          Description
        </label>

        <textarea
          id="snippet-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this snippet do or when would you use it?"
          rows={4}
          disabled={isSubmitting}
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />
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
              : "Save Snippet"}
        </button>
      </div>
    </form>
  );
}
