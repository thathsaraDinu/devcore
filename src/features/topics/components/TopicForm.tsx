"use client";

import { useState } from "react";

import TopicPicker from "./TopicPicker";
import type { Topic } from "../types/topic";
import { createTopic, updateTopic } from "@/server/topics/mutations";

type TopicFormProps = {
  topics: Topic[];
  initialTopic?: Topic;
};

export default function TopicForm({
  topics,
  initialTopic,
}: TopicFormProps) {
  const [parentId, setParentId] = useState(
    initialTopic?.parentId ?? "",
  );

  const isEditing = Boolean(initialTopic);

  const action = isEditing ? updateTopic : createTopic;

  return (
    <form action={action} className="space-y-6">
      <div>
        {initialTopic && (
          <input
            type="hidden"
            name="id"
            value={initialTopic.id}
          />
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
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
        />
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
          className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
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
          />
        </div>

        <p className="mt-2 text-sm text-text-muted">
          Leave this empty to create a top-level personal topic.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          {isEditing ? "Update Topic" : "Create Topic"}
        </button>
      </div>
    </form>
  );
}
