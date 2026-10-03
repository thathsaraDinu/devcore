"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { searchAction } from "@/server/search/actions";

import type { SearchResult } from "../types/search";

const RESULT_TYPE_LABELS = {
  NOTE: "Note",
  QUESTION: "Question",
  SNIPPET: "Snippet",
} as const;

function getResultHref(result: SearchResult) {
  switch (result.type) {
    case "NOTE":
      return `/notes/${result.id}`;

    case "QUESTION":
      return `/questions/${result.id}`;

    case "SNIPPET":
      return `/snippets/${result.id}`;
  }
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeout = window.setTimeout(async () => {
      try {
        const formData = new FormData();

        formData.set("query", trimmedQuery);

        const nextResults = await searchAction(formData);

        setResults(nextResults);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

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

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        inputRef.current?.focus();
        setIsOpen(true);
      }
    }

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useEffect(() => {
    setShortcutLabel(
      navigator.platform.toLowerCase().includes("mac") ? "⌘ K" : "Ctrl K",
    );
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder="Search notes, questions, snippets..."
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 pr-20 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
        />

        {isSearching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            Searching...
          </span>
        )}

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
          {shortcutLabel}
        </div>
      </div>

      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
          {isSearching ? (
            <p className="p-4 text-sm text-text-muted">Searching...</p>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto subtle-scrollbar p-1">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={getResultHref(result)}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="block rounded-md px-3 py-3 transition-colors hover:bg-surface-hover"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-medium text-text-primary">
                      {result.title}
                    </p>

                    <span className="shrink-0 text-xs text-text-muted">
                      {RESULT_TYPE_LABELS[result.type]}
                    </span>
                  </div>

                  {result.topicPath.length > 0 && (
                    <p className="mt-1 text-xs font-medium text-accent">
                      {result.topicPath.join(" / ")}
                    </p>
                  )}

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                    {result.preview}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-4 text-sm text-text-muted">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
