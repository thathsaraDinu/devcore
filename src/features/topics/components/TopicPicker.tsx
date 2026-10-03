"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Topic } from "../types/topic";
import { getTopicPath } from "../utils/getTopicPath";

type TopicPickerProps = {
  topics: Topic[];
  value: string;
  onChange: (topicId: string) => void;
};

export default function TopicPicker({
  topics,
  value,
  onChange,
}: TopicPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTopic = topics.find(
    (topic) => topic.id === value,
  );

  const selectedTopicPath = selectedTopic
    ? getTopicPath(topics, selectedTopic.id)
    : [];

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, Topic[]>();

    for (const topic of topics) {
      const children = map.get(topic.parentId) ?? [];
      children.push(topic);
      map.set(topic.parentId, children);
    }

    return map;
  }, [topics]);

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return topics
      .filter((topic) =>
        topic.name
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .map((topic) => ({
        topic,
        path: getTopicPath(topics, topic.id),
      }));
  }, [topics, normalizedQuery]);

  function handleSelect(topicId: string) {
    onChange(topicId);
    setQuery("");
    setIsOpen(false);
  }

  function handleClear() {
    onChange("");
    setQuery("");
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
        setQuery("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            setQuery("");
          } else {
            handleOpen();
          }
        }}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="min-w-0 truncate">
          {selectedTopicPath.length > 0
            ? selectedTopicPath
                .map((topic) => topic.name)
                .join(" / ")
            : "Select topic"}
        </span>

        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
          {/* Search */}
          <div className="border-b border-border p-2">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search topics..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
            />
          </div>

          <div className="max-h-80 overflow-y-auto subtle-scrollbar p-1">
            {normalizedQuery ? (
              <>
                {searchResults.length > 0 ? (
                  <div className="space-y-0.5">
                    {searchResults.map(
                      ({ topic, path }) => {
                        const selected =
                          topic.id === value;

                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() =>
                              handleSelect(
                                topic.id,
                              )
                            }
                            className={
                              selected
                                ? "w-full rounded-md bg-surface-hover px-3 py-2.5 text-left"
                                : "w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-surface-hover"
                            }
                          >
                            <p
                              className={
                                selected
                                  ? "text-sm font-medium text-text-primary"
                                  : "text-sm font-medium text-text-secondary"
                              }
                            >
                              {topic.name}
                            </p>

                            <p className="mt-0.5 text-xs text-text-muted">
                              {path
                                .map(
                                  (item) =>
                                    item.name,
                                )
                                .join(" / ")}
                            </p>
                          </button>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <p className="px-3 py-4 text-sm text-text-muted">
                    No topics found.
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Clear selection */}
                <button
                  type="button"
                  onClick={handleClear}
                  className={
                    !value
                      ? "w-full rounded-md bg-surface-hover px-3 py-2.5 text-left text-sm font-medium text-text-primary"
                      : "w-full rounded-md px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  }
                >
                  No topic
                </button>

                {/* Hierarchical topic tree */}
                <div className="mt-1">
                  <TopicTree
                    parentId={null}
                    topicsByParent={childrenByParent}
                    selectedTopicId={value}
                    onSelect={handleSelect}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type TopicTreeProps = {
  parentId: string | null;
  topicsByParent: Map<string | null, Topic[]>;
  selectedTopicId: string;
  onSelect: (topicId: string) => void;
  depth?: number;
};

function TopicTree({
  parentId,
  topicsByParent,
  selectedTopicId,
  onSelect,
  depth = 0,
}: TopicTreeProps) {
  const children = topicsByParent.get(parentId) ?? [];

  return (
    <div>
      {children.map((topic) => {
        const selected =
          topic.id === selectedTopicId;

        const hasChildren =
          (topicsByParent.get(topic.id) ?? [])
            .length > 0;

        return (
          <div key={topic.id}>
            <button
              type="button"
              onClick={() => onSelect(topic.id)}
              className={
                selected
                  ? "flex w-full items-center gap-2 rounded-md bg-surface-hover px-3 py-2 text-left text-sm font-medium text-text-primary"
                  : "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              }
              style={{
                paddingLeft: `${12 + depth * 16}px`,
              }}
            >
              <span
                className={
                  hasChildren
                    ? "text-text-muted"
                    : "w-3 shrink-0"
                }
              >
                {hasChildren ? "•" : ""}
              </span>

              <span className="truncate">
                {topic.name}
              </span>
            </button>

            {hasChildren && (
              <TopicTree
                parentId={topic.id}
                topicsByParent={topicsByParent}
                selectedTopicId={selectedTopicId}
                onSelect={onSelect}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
