"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import TopicPicker from "./TopicPicker";
import type { Topic } from "../types/topic";
import { createTopic, updateTopic } from "@/server/topics/mutations";

type TopicFormProps = {
  topics: Topic[];
  initialTopic?: Topic;
};

type FormErrors = {
  name?: string;
};

export default function TopicForm({ topics, initialTopic }: TopicFormProps) {
  const router = useRouter();
  const [parentId, setParentId] = useState(initialTopic?.parentId ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialTopic);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    const nextErrors: FormErrors = {};

    if (!name) {
      nextErrors.name = "Name is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = isEditing
        ? await updateTopic(formData)
        : await createTopic(formData);

      if (result?.redirectUrl) {
        if (isEditing) {
          router.back();
        } else {
          router.replace(result.redirectUrl);
        }
      }
    } catch (error) {
      setErrors({
        name: "Something went wrong while saving the topic.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="parentId" value={parentId} />
      <div>
        {initialTopic && (
          <input type="hidden" name="id" value={initialTopic.id} />
        )}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-primary"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initialTopic?.name ?? ""}
          placeholder="e.g. WebSockets"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />

        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-text-primary"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialTopic?.description ?? ""}
          placeholder="What does this topic cover?"
          disabled={isSubmitting}
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="parentId"
          className="block text-sm font-medium text-text-primary"
        >
          Parent Topic
        </label>

        <div className="mt-2">
          <TopicPicker
            topics={topics}
            value={parentId}
            onChange={setParentId}
            disabled={isSubmitting}
          />
        </div>

        <p className="mt-2 text-sm text-text-muted">
          Leave this empty to create a top-level personal topic.
        </p>
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
              ? "Update Topic"
              : "Create Topic"}
        </button>
      </div>
    </form>
  );
}
