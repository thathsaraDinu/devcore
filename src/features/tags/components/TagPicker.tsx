"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { createTag } from "@/server/tags/mutations";
import type { Tag } from "../types/tag";
import TagBadge from "./TagBadge";

type TagPickerProps = {
  tags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  disabled?: boolean;
};

export default function TagPicker({
  tags,
  selectedTagIds,
  onChange,
  disabled = false,
}: TagPickerProps) {
  const [localTags, setLocalTags] = useState<Tag[]>(tags);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTags((currentTags) => {
      const currentTagIds = new Set(currentTags.map((tag) => tag.id));

      const newTags = tags.filter((tag) => !currentTagIds.has(tag.id));

      if (newTags.length === 0) {
        return currentTags;
      }

      return [...currentTags, ...newTags];
    });
  }, [tags]);

  const selectedTags = localTags.filter((tag) =>
    selectedTagIds.includes(tag.id),
  );

  const normalizedQuery = query.trim().toLowerCase().replace(/^#+/, "");

  const availableTags = useMemo(() => {
    return localTags.filter((tag) => {
      if (selectedTagIds.includes(tag.id)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return tag.name.includes(normalizedQuery);
    });
  }, [localTags, selectedTagIds, normalizedQuery]);

  const exactMatch = localTags.find((tag) => tag.name === normalizedQuery);

  function addTag(tag: Tag) {
    setLocalTags((currentTags) => {
      const alreadyExists = currentTags.some(
        (currentTag) => currentTag.id === tag.id,
      );

      return alreadyExists ? currentTags : [...currentTags, tag];
    });

    if (!selectedTagIds.includes(tag.id)) {
      onChange([...selectedTagIds, tag.id]);
    }

    setQuery("");
    setIsOpen(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function removeTag(tagId: string) {
    onChange(selectedTagIds.filter((selectedId) => selectedId !== tagId));
  }

  async function handleCreateTag() {
    if (!normalizedQuery || exactMatch || isCreating) {
      return;
    }

    setIsCreating(true);

    try {
      const tag = await createTag(normalizedQuery);

      addTag(tag);
    } finally {
      setIsCreating(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (exactMatch) {
        addTag(exactMatch);
        return;
      }

      if (normalizedQuery) {
        void handleCreateTag();
      }

      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (event.key === "Backspace" && !query && selectedTagIds.length > 0) {
      removeTag(selectedTagIds[selectedTagIds.length - 1]);
    }
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
      <div
        className="flex min-h-11 flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 transition-colors focus-within:border-accent"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            removable
            disabled={disabled}
            onRemove={() => removeTag(tag.id)}
          />
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length > 0 ? "Add tag..." : "Add tags..."}
          className="min-w-32 flex-1 bg-transparent py-1 text-sm text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50"
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
          <div className="max-h-64 overflow-y-auto subtle-scrollbar p-1">
            {availableTags.length > 0 && (
              <div>
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            )}

            {normalizedQuery && !exactMatch && (
              <button
                type="button"
                onClick={() => void handleCreateTag()}
                disabled={isCreating}
                className="mt-1 w-full rounded-md border-t border-border px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-50"
              >
                {isCreating ? "Creating..." : `Create #${normalizedQuery}`}
              </button>
            )}

            {availableTags.length === 0 && (!normalizedQuery || exactMatch) && (
              <p className="px-3 py-3 text-sm text-text-muted">
                {exactMatch ? "This tag is already selected." : "No tags yet."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
