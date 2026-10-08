"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import TagFilter from "@/features/tags/components/TagFilter";
import TagBadge from "@/features/tags/components/TagBadge";
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

  const selectedTagIds = searchParams.getAll("tag");

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const topicIds = selectedTopicId
    ? getTopicDescendantIds(topics, selectedTopicId)
    : [];

  const filteredSnippets = initialSnippets.filter((snippet) => {
    const matchesSearch =
      !normalizedQuery ||
      snippet.title.toLowerCase().includes(normalizedQuery) ||
      snippet.language.toLowerCase().includes(normalizedQuery) ||
      snippet.code.toLowerCase().includes(normalizedQuery) ||
      (snippet.description?.toLowerCase().includes(normalizedQuery) ?? false);

    const matchesTopic =
      !selectedTopicId ||
      (snippet.topicId !== null && topicIds.includes(snippet.topicId));

    const matchesTag =
      selectedTagIds.length === 0 ||
      snippet.tags.some((tag) => selectedTagIds.includes(tag.id));

    return matchesSearch && matchesTopic && matchesTag;
  });

  const hasActiveFilters =
    normalizedQuery !== "" ||
    selectedTopicId !== "" ||
    selectedTagIds.length > 0;

  function handleTagChange(tagIds: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");

    tagIds.forEach((tagId) => {
      params.append("tag", tagId);
    });

    const queryString = params.toString();

    router.replace(queryString ? `/snippets?${queryString}` : "/snippets", {
      scroll: false,
    });
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
            onChange={(event) => setSearchQuery(event.target.value)}
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
              value={selectedTagIds}
              onChange={handleTagChange}
            />
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-border pt-3">
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  removable
                  onRemove={() => {
                    const newTagIds = selectedTagIds.filter(
                      (id) => id !== tag.id,
                    );
                    handleTagChange(newTagIds);
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-text-muted">
              {filteredSnippets.length}{" "}
              {filteredSnippets.length === 1 ? "snippet" : "snippets"}
              {hasActiveFilters ? " matching your filters" : ""}
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
