import type { Topic } from "../types/topic";

export function getTopicPath(
  topics: Topic[],
  topicId: string,
): Topic[] {
  const topicMap = new Map(
    topics.map((topic) => [topic.id, topic]),
  );

  const path: Topic[] = [];
  let current = topicMap.get(topicId);

  while (current) {
    path.unshift(current);

    if (!current.parentId) {
      break;
    }

    current = topicMap.get(current.parentId);
  }

  return path;
}