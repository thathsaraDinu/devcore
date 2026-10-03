import type { Topic } from "../types/topic";

type TopicCardProps = {
  topic: Topic;
};

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <article className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-hover hover:bg-surface-hover">
      <h3 className="font-medium text-text-primary">
        {topic.name}
      </h3>

      <p className="mt-1 text-sm leading-6 text-text-muted">
        {topic.description}
      </p>
    </article>
  );
}