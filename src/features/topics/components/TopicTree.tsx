import type { Topic } from "../types/topic";
import { buildTopicTree } from "../utils/buildTopicTree";
import TopicItem from "./TopicItem";

type TopicTreeProps = {
  topics: Topic[];
};

export default function TopicTree({
  topics,
}: TopicTreeProps) {
  const topicTree = buildTopicTree(topics);

  if (topicTree.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm font-medium text-text-primary">
          No topics yet.
        </p>

        <p className="mt-1 text-sm text-text-muted">
          Create your first topic to start building your
          knowledge map.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
      {topicTree.map((topic) => (
        <div
          key={topic.id}
          className="mb-4 break-inside-avoid"
        >
          <TopicItem topic={topic} />
        </div>
      ))}
    </div>
  );
}