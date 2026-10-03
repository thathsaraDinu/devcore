"use client";

import { useState } from "react";

import { updateTag } from "@/server/tags/mutations";

type TagNameEditorProps = {
  tagId: string;
  initialName: string;
};

export default function TagNameEditor({
  tagId,
  initialName,
}: TagNameEditorProps) {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handleStartEditing() {
    setName(initialName);
    setError("");
    setIsEditing(true);
  }

  function handleCancel() {
    setName(initialName);
    setError("");
    setIsEditing(false);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Tag name is required.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await updateTag(tagId, trimmedName);

      setName(trimmedName);
      setIsEditing(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update tag.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isEditing) {
    return (
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-2"
        >
          <div className="flex min-w-0 items-center">
            <span className="text-3xl font-semibold tracking-tight text-text-primary">
              #
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoFocus
              disabled={isSaving}
              aria-label="Tag name"
              className="h-11 w-72 max-w-[70vw] border-b border-border bg-transparent px-1 text-3xl font-semibold tracking-tight text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent disabled:opacity-50"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  handleCancel();
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            aria-label="Save tag name"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-success transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M5 10.5L8.5 14L15 6.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            aria-label="Cancel editing tag name"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M6 6L14 14M14 6L6 14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>#{name}</span>

      <button
        type="button"
        onClick={handleStartEditing}
        aria-label={`Edit ${name}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            d="M13.5 4.5L15.5 6.5M5 15L5.5 12.5L13.75 4.25C14.1642 3.83579 14.8358 3.83579 15.25 4.25L15.75 4.75C16.1642 5.16421 16.1642 5.83579 15.75 6.25L7.5 14.5L5 15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}