"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createTag } from "@/server/tags/mutations";

export default function CreateTagButton() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  function handleOpen() {
    setName("");
    setError("");
    setIsOpen(true);
  }

  function handleClose() {
    if (isCreating) return;

    setName("");
    setError("");
    setIsOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Tag name is required.");
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      await createTag(trimmedName);

      setName("");
      setIsOpen(false);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create tag.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        Create Tag
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-tag-title"
            className="w-full max-w-md rounded-lg border border-border bg-surface shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="border-b border-border px-5 py-4">
              <h2
                id="create-tag-title"
                className="text-base font-semibold text-text-primary"
              >
                Create Tag
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Add a reusable label for your Notes, Questions, and Snippets.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-5 py-5">
                <label
                  htmlFor="tag-name"
                  className="block text-sm font-medium text-text-secondary"
                >
                  Tag name
                </label>

                <div className="mt-2 flex items-center rounded-md border border-border bg-background px-3 transition-colors focus-within:border-accent">
                  <span className="text-sm text-text-muted">#</span>

                  <input
                    id="tag-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    placeholder="react"
                    autoFocus
                    disabled={isCreating}
                    className="w-full bg-transparent px-2 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50"
                  />
                </div>

                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isCreating}
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
