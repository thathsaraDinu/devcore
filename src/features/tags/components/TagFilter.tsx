"use client";

import { useMemo, useRef, useState } from "react";

import type { Tag } from "../types/tag";

type TagFilterProps = {
  tags: Tag[];
  value: string;
  onChange: (tagId: string) => void;
};

export default function TagFilter({
  tags,
  value,
  onChange,
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTag = tags.find((tag) => tag.id === value);

  const filteredTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return tags;
    }

    return tags.filter((tag) =>
      tag.name.includes(normalizedQuery),
    );
  }, [tags, query]);

  function selectTag(tagId: string) {
    onChange(tagId);
    setQuery("");
    setIsOpen(false);
  }

  function clearFilter() {
    onChange("");
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-48 items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:border-border-hover"
      >
        <span className="truncate">
          {selectedTag
            ? `#${selectedTag.name}`
            : "All tags"}
        </span>

        <span className="shrink-0 text-text-muted">
          {isOpen ? "↑" : "↓"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
          <div className="border-b border-border p-2">
            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search tags..."
              autoFocus
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
            />
          </div>

          <div className="max-h-64 overflow-y-auto subtle-scrollbar p-1">
            <button
              type="button"
              onClick={clearFilter}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              All tags
            </button>

            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => selectTag(tag.id)}
                className={
                  tag.id === value
                    ? "w-full rounded-md bg-surface-hover px-3 py-2 text-left text-sm font-medium text-text-primary"
                    : "w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                }
              >
                #{tag.name}
              </button>
            ))}

            {filteredTags.length === 0 && (
              <p className="px-3 py-3 text-sm text-text-muted">
                No tags found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}