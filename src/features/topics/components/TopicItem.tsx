import Link from "next/link";

import type { TopicNode } from "../types/topic";
import DeleteTopicButton from "./DeleteTopicButton";

type TopicItemProps = {
  topic: TopicNode;
  depth?: number;
};

export default function TopicItem({
  topic,
  depth = 0,
}: TopicItemProps) {
  const isRoot = depth === 0;
  const isPersonal = topic.createdByUserId !== null;

  if (!isRoot) {
    return (
      <li className="relative">
        <div className="flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-surface-hover">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted"
              />

              <h3 className="truncate text-sm font-medium text-text-primary">
                {topic.name}
              </h3>
            </div>

            {topic.description && (
              <p className="mt-1 pl-3.5 text-sm leading-6 text-text-muted">
                {topic.description}
              </p>
            )}
          </div>

          {isPersonal && (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/topics/${topic.id}/edit`}
                className="text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                Edit
              </Link>

              <DeleteTopicButton
                topicId={topic.id}
              />
            </div>
          )}
        </div>

        {topic.children.length > 0 && (
          <ul className="ml-7 border-l border-border">
            {topic.children.map((child) => (
              <TopicItem
                key={child.id}
                topic={child}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-start justify-between gap-6 px-5 py-5 bg-accent-muted/20">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-text-primary">
              {topic.name}
            </h2>

            {topic.children.length > 0 && (
              <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-text-muted">
                {topic.children.length}{" "}
                {topic.children.length === 1
                  ? "subtopic"
                  : "subtopics"}
              </span>
            )}

            {isPersonal && (
              <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-text-muted">
                Custom
              </span>
            )}
          </div>

          {topic.description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
              {topic.description}
            </p>
          )}
        </div>

        {isPersonal && (
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/topics/${topic.id}/edit`}
              className="text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              Edit
            </Link>

            <DeleteTopicButton
              topicId={topic.id}
            />
          </div>
        )}
      </div>

      {topic.children.length > 0 && (
        <div className="border-t border-border">
          <ul className="py-1">
            {topic.children.map((child) => (
              <TopicItem
                key={child.id}
                topic={child}
                depth={depth + 1}
              />
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}