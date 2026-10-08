"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Tag } from "../types/tag";

type TagFilterProps = {
  tags: Tag[];
  value: string[];
  onChange: (tagIds: string[]) => void;
};

export default function TagFilter({ tags, value, onChange }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  const filteredTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return tags;
    }

    return tags.filter((tag) => tag.name.includes(normalizedQuery));
  }, [tags, query]);

  function toggleTag(tagId: string) {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  }

  function clearFilter() {
    onChange([]);
    setQuery("");
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-48 items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:border-border-hover"
      >
        <span className="truncate">
          {selectedTags.length === 0
            ? "All tags"
            : selectedTags.length <= 2
              ? selectedTags.map((tag) => `#${tag.name}`).join(", ")
              : `${selectedTags.length} tags selected`}
        </span>

        <span className="shrink-0 text-text-muted">{isOpen ? "↑" : "↓"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
          <div className="border-b border-border p-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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
                onClick={() => toggleTag(tag.id)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover"
              >
                <span
                  className={
                    value.includes(tag.id)
                      ? "font-medium text-text-primary"
                      : "text-text-secondary"
                  }
                >
                  #{tag.name}
                </span>

                {value.includes(tag.id) && (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 text-accent"
                    aria-hidden="true"
                  >
                    <path
                      d="M16.25 5.75L8.125 13.875L4.375 10.125"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
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
