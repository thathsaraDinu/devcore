"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import TagFilter from "@/features/tags/components/TagFilter";
import type { Tag } from "@/features/tags/types/tag";
import TopicPicker from "@/features/topics/components/TopicPicker";
import type { Topic } from "@/features/topics/types/topic";
import { getTopicDescendantIds } from "@/features/topics/utils/getTopicDescendantIds";

import type { Question } from "../types/question";
import QuestionList from "./QuestionList";

type QuestionsBrowserProps = {
  initialQuestions: Question[];
  topics: Topic[];
  tags: Tag[];
};

export default function QuestionsBrowser({
  initialQuestions,
  topics,
  tags,
}: QuestionsBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const statusParam = searchParams.get("status");
  const selectedTagId = searchParams.get("tag") ?? "";

  const selectedStatus: "ALL" | "OPEN" | "RESOLVED" =
    statusParam === "open"
      ? "OPEN"
      : statusParam === "resolved"
        ? "RESOLVED"
        : "ALL";

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const topicIds = selectedTopicId
    ? getTopicDescendantIds(topics, selectedTopicId)
    : [];

  const questionsMatchingFilters = initialQuestions.filter((question) => {
    const matchesSearch =
      !normalizedQuery ||
      question.question.toLowerCase().includes(normalizedQuery) ||
      (question.answer?.toLowerCase().includes(normalizedQuery) ?? false);

    const matchesTopic =
      !selectedTopicId ||
      (question.topicId !== null && topicIds.includes(question.topicId));

    const matchesTag =
      !selectedTagId || question.tags.some((tag) => tag.id === selectedTagId);

    return matchesSearch && matchesTopic && matchesTag;
  });

  const openCount = questionsMatchingFilters.filter(
    (question) => question.status === "OPEN",
  ).length;

  const resolvedCount = questionsMatchingFilters.filter(
    (question) => question.status === "RESOLVED",
  ).length;

  const filteredQuestions =
    selectedStatus === "ALL"
      ? questionsMatchingFilters
      : questionsMatchingFilters.filter(
          (question) => question.status === selectedStatus,
        );

  const hasActiveFilters =
    normalizedQuery !== "" ||
    selectedTopicId !== "" ||
    selectedTagId !== "" ||
    selectedStatus !== "ALL";

  function handleStatusChange(status: "ALL" | "OPEN" | "RESOLVED") {
    const params = new URLSearchParams(searchParams.toString());

    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status === "OPEN" ? "open" : "resolved");
    }

    const queryString = params.toString();

    router.replace(queryString ? `/questions?${queryString}` : "/questions", {
      scroll: false,
    });
  }

  function handleTagChange(tagId: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (tagId) {
      params.set("tag", tagId);
    } else {
      params.delete("tag");
    }

    const queryString = params.toString();

    router.replace(queryString ? `/questions?${queryString}` : "/questions", {
      scroll: false,
    });
  }

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedTopicId("");

    router.replace("/questions", {
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
            placeholder="Search questions..."
            aria-label="Search questions"
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
            {questionsMatchingFilters.length}{" "}
            {questionsMatchingFilters.length === 1 ? "question" : "questions"}
            {hasActiveFilters &&
            (normalizedQuery !== "" ||
              selectedTopicId !== "" ||
              selectedTagId !== "")
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

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange("ALL")}
            className={
              selectedStatus === "ALL"
                ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white"
                : "rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
            }
          >
            All {questionsMatchingFilters.length}
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange("OPEN")}
            className={
              selectedStatus === "OPEN"
                ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white"
                : "rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
            }
          >
            Open {openCount}
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange("RESOLVED")}
            className={
              selectedStatus === "RESOLVED"
                ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-white"
                : "rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
            }
          >
            Resolved {resolvedCount}
          </button>
        </div>
      </div>

      {filteredQuestions.length > 0 ? (
        <QuestionList questions={filteredQuestions} />
      ) : (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-text-primary">
            No questions found.
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
