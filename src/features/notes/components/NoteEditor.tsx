"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";

import RichTextEditor from "@/components/editor/RichTextEditor";
import TagPicker from "@/features/tags/components/TagPicker";
import type { Tag } from "@/features/tags/types/tag";
import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { createNote, updateNote } from "@/server/notes/mutations";

import type { Note } from "../types/note";

type NoteEditorProps = {
  topics: Topic[];
  tags: Tag[];
  initialNote?: Note;
};

type FormErrors = {
  title?: string;
  content?: string;
};

const emptyDocument: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
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

export default function NoteEditor({
  topics,
  tags,
  initialNote,
}: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialNote?.title ?? "");

  const [content, setContent] = useState<JSONContent>(
    initialNote?.content ?? emptyDocument,
  );

  const [topicId, setTopicId] = useState(initialNote?.topicId ?? "");

  const [selectedTagIds, setSelectedTagIds] = useState(
    initialNote?.tags.map((tag) => tag.id) ?? [],
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialNote);

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!hasRichTextContent(content)) {
      nextErrors.content = "Content is required.";
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
      title: title.trim(),
      content: JSON.parse(JSON.stringify(content)),
      topicId: topicId || null,
      tagIds: selectedTagIds,
    };

    try {
      const result = isEditing
        ? await updateNote(initialNote!.id, input)
        : await createNote(input);

      if (result?.redirectUrl) {
        if (isEditing) {
          router.back();
        } else {
          router.replace(result.redirectUrl);
        }
      }
    } catch (error) {
      setErrors({
        content: "Something went wrong while saving the note.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-text-primary"
        >
          Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What did you learn?"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />

        {errors.title && (
          <p id="title-error" className="mt-2 text-sm text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-text-primary"
        >
          Content
        </label>

        <div className="mt-2">
          <RichTextEditor
            initialContent={initialNote?.content ?? emptyDocument}
            onChange={setContent}
            placeholder="Write what you learned..."
          />
        </div>

        {errors.content && (
          <p id="content-error" className="mt-2 text-sm text-red-400">
            {errors.content}
          </p>
        )}
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
              : "Save Note"}
        </button>
      </div>
    </form>
  );
}
