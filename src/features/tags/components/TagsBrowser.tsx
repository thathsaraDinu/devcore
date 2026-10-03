"use client";

import Link from "next/link";
import { useState } from "react";

import type { Tag } from "../types/tag";
import TagBadge from "./TagBadge";

type TagsBrowserProps = {
  tags: Tag[];
};

export default function TagsBrowser({
  tags,
}: TagsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTags = normalizedQuery
    ? tags.filter((tag) =>
        tag.name.toLowerCase().includes(normalizedQuery),
      )
    : tags;

  const hasSearch = normalizedQuery.length > 0;

  function clearSearch() {
    setSearchQuery("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search tags..."
            aria-label="Search tags"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
          />

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xs text-text-muted">
              {filteredTags.length}{" "}
              {filteredTags.length === 1 ? "tag" : "tags"}
            </span>

            {hasSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <section aria-labelledby="tag-library-heading">
        <div className="mb-5">
          <h2
            id="tag-library-heading"
            className="text-base font-semibold text-text-primary"
          >
            Tag Library
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Select a tag to see the knowledge associated with it.
          </p>
        </div>

        {filteredTags.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.id}`}
                className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-hover hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              >
                <div className="flex items-center justify-between gap-4">
                  <TagBadge tag={tag} />

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm text-text-muted transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </div>

                <p className="mt-4 text-xs text-text-muted">
                  View related knowledge
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm font-medium text-text-primary">
              {hasSearch ? "No tags found." : "No tags yet."}
            </p>

            <p className="mt-1 text-sm text-text-muted">
              {hasSearch
                ? "Try a different search term."
                : "Create a tag from a Note, Question, or Snippet editor."}
            </p>

            {hasSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>

      <div className="rounded-lg border border-dashed border-border px-5 py-4">
        <p className="text-xs leading-5 text-text-muted">
          Tags are shared labels across Notes, Questions, and
          Snippets. Create new tags from any knowledge editor.
        </p>
      </div>
    </div>
  );
}