import type { Topic } from "../types/topic";

export function getTopicDescendantIds(
  topics: Topic[],
  topicId: string,
): string[] {
  const childrenByParent = new Map<string, string[]>();

  for (const topic of topics) {
    if (topic.parentId === null) {
      continue;
    }

    const children = childrenByParent.get(topic.parentId) ?? [];
    children.push(topic.id);
    childrenByParent.set(topic.parentId, children);
  }

  const descendantIds = [topicId];

  function collectChildren(parentId: string) {
    const children = childrenByParent.get(parentId) ?? [];

    for (const childId of children) {
      descendantIds.push(childId);
      collectChildren(childId);
    }
  }

  collectChildren(topicId);

  return descendantIds;
}