import Link from "next/link";

import type { Snippet } from "../types/snippet";
import { formatRelativeDate } from "@/lib/date/formatRelativeDate";

type SnippetCardProps = {
  snippet: Snippet;
};

export default function SnippetCard({
  snippet,
}: SnippetCardProps) {
  return (
    <article className="h-full overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-hover hover:bg-surface-hover">
      <Link
        href={`/snippets/${snippet.id}`}
        className="group flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="min-w-0 line-clamp-2 text-base font-semibold tracking-tight text-text-primary">
            {snippet.title}
          </h2>

          <span className="shrink-0 rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-text-muted">
            {snippet.language}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="min-w-0 truncate text-xs font-medium text-accent">
            {snippet.topicPath.length > 0
              ? snippet.topicPath.join(" / ")
              : "No topic"}
          </p>

          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-text-muted transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </div>

        <pre className="mt-4 max-h-36 overflow-hidden rounded-md border border-border bg-background p-3 font-mono text-xs leading-5 text-text-secondary">
          <code>{snippet.code}</code>
        </pre>

        {snippet.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-text-secondary">
            {snippet.description}
          </p>
        )}

        {snippet.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {snippet.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-text-muted"
              >
                #{tag.name}
              </span>
            ))}

            {snippet.tags.length > 3 && (
              <span className="px-1 py-0.5 text-[11px] text-text-muted">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <p className="text-xs text-text-muted">
            Updated {formatRelativeDate(snippet.updatedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}