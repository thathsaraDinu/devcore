"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import TagFilter from "@/features/tags/components/TagFilter";
import type { Tag } from "@/features/tags/types/tag";
import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { getTopicDescendantIds } from "@/features/topics/utils/getTopicDescendantIds";

import type { Note } from "../types/note";
import NoteList from "./NoteList";

type NotesBrowserProps = {
  initialNotes: Note[];
  topics: Topic[];
  tags: Tag[];
};

export default function NotesBrowser({
  initialNotes,
  topics,
  tags,
}: NotesBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const selectedTagId = searchParams.get("tag") ?? "";

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const topicIds = selectedTopicId
    ? getTopicDescendantIds(topics, selectedTopicId)
    : [];

  const filteredNotes = initialNotes.filter((note) => {
    const matchesSearch =
      !normalizedQuery ||
      note.title.toLowerCase().includes(normalizedQuery) ||
      note.content.toLowerCase().includes(normalizedQuery);

    const matchesTopic =
      !selectedTopicId ||
      (note.topicId !== null && topicIds.includes(note.topicId));

    const matchesTag =
      !selectedTagId ||
      note.tags.some((tag) => tag.id === selectedTagId);

    return matchesSearch && matchesTopic && matchesTag;
  });

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
      queryString ? `/notes?${queryString}` : "/notes",
      { scroll: false },
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedTopicId("");

    router.replace("/notes", {
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
            placeholder="Search notes..."
            aria-label="Search notes"
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
            {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "note" : "notes"}
            {hasActiveFilters ? " matching your filters" : ""}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <NoteList notes={filteredNotes} />
      ) : (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-text-primary">
            No notes found.
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Try adjusting your search or filters.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
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