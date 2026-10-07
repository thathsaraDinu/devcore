import Link from "next/link";

import type { Question } from "../types/question";
import { formatRelativeDate } from "@/lib/date/formatRelativeDate";
import { getAnswerPreview } from "../utils/getAnswerPreview";
import { getQuestionPreview } from "../utils/getQuestionPreview";

type QuestionCardProps = {
  question: Question;
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const isResolved = question.status === "RESOLVED";

  return (
    <article className="h-full overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-hover hover:bg-surface-hover">
      <Link
        href={`/questions/${question.id}`}
        className="group flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 truncate text-xs font-medium text-accent">
            {question.topicPath.length > 0
              ? question.topicPath.join(" / ")
              : "No topic"}
          </p>

          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-text-muted transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </div>

        <h2 className="mt-2 line-clamp-3 text-base font-semibold tracking-tight text-text-primary">
          {getQuestionPreview(question.question)}
        </h2>

        {question.answer && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
            {getAnswerPreview(question.answer)}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={
              isResolved
                ? "rounded-md border border-green-500/20 bg-green-500/5 px-2 py-0.5 text-[11px] font-medium text-green-400"
                : "rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[11px] font-medium text-amber-400"
            }
          >
            {isResolved ? "Resolved" : "Open"}
          </span>

          {question.relatedNotes.length > 0 && (
            <span className="text-xs text-text-muted">
              {question.relatedNotes.length}{" "}
              {question.relatedNotes.length === 1 ? "note" : "notes"}
            </span>
          )}
        </div>

        {question.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {question.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-text-muted"
              >
                #{tag.name}
              </span>
            ))}

            {question.tags.length > 3 && (
              <span className="px-1 py-0.5 text-[11px] text-text-muted">
                +{question.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <p className="text-xs text-text-muted">
            Updated {formatRelativeDate(question.updatedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
