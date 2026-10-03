"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import TagFilter from "@/features/tags/components/TagFilter";
import type { Tag } from "@/features/tags/types/tag";
import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { getTopicDescendantIds } from "@/features/topics/utils/getTopicDescendantIds";

import type { Snippet } from "../types/snippet";
import SnippetList from "./SnippetList";

type SnippetsBrowserProps = {
  initialSnippets: Snippet[];
  topics: Topic[];
  tags: Tag[];
};

export default function SnippetsBrowser({
  initialSnippets,
  topics,
  tags,
}: SnippetsBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const selectedTagId = searchParams.get("tag") ?? "";

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const topicIds = selectedTopicId
    ? getTopicDescendantIds(topics, selectedTopicId)
    : [];

  const filteredSnippets = initialSnippets.filter(
    (snippet) => {
      const matchesSearch =
        !normalizedQuery ||
        snippet.title
          .toLowerCase()
          .includes(normalizedQuery) ||
        snippet.language
          .toLowerCase()
          .includes(normalizedQuery) ||
        snippet.code
          .toLowerCase()
          .includes(normalizedQuery) ||
        (snippet.description
          ?.toLowerCase()
          .includes(normalizedQuery) ??
          false);

      const matchesTopic =
        !selectedTopicId ||
        (snippet.topicId !== null &&
          topicIds.includes(snippet.topicId));

      const matchesTag =
        !selectedTagId ||
        snippet.tags.some(
          (tag) => tag.id === selectedTagId,
        );

      return (
        matchesSearch &&
        matchesTopic &&
        matchesTag
      );
    },
  );

  const hasActiveFilters =
    normalizedQuery !== "" ||
    selectedTopicId !== "" ||
    selectedTagId !== "";

  function handleTagChange(tagId: string) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (tagId) {
      params.set("tag", tagId);
    } else {
      params.delete("tag");
    }

    const queryString = params.toString();

    router.replace(
      queryString
        ? `/snippets?${queryString}`
        : "/snippets",
      { scroll: false },
    );
  }

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedTopicId("");

    router.replace("/snippets", {
      scroll: false,
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search snippets..."
            aria-label="Search snippets"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
          />

          <div className="w-full lg:w-64">
            <TopicPicker
              topics={topics}
              value={selectedTopicId}
              onChange={setSelectedTopicId}
            />
          </div>

          <div className="w-full lg:w-56">
            <TagFilter
              tags={tags}
              value={selectedTagId}
              onChange={handleTagChange}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-3">
          <p className="text-xs text-text-muted">
            {filteredSnippets.length}{" "}
            {filteredSnippets.length === 1
              ? "snippet"
              : "snippets"}
            {hasActiveFilters
              ? " matching your filters"
              : ""}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredSnippets.length > 0 ? (
        <SnippetList snippets={filteredSnippets} />
      ) : (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-text-primary">
            No snippets found.
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Try adjusting your search or filters.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}