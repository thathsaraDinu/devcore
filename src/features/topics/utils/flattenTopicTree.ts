import type { TopicNode } from "../types/topic";

export type TopicOption = {
  topic: TopicNode;
  depth: number;
};

export function flattenTopicTree(
  nodes: TopicNode[],
  depth = 0,
): TopicOption[] {
  return nodes.flatMap((node) => [
    { topic: node, depth },
    ...flattenTopicTree(node.children, depth + 1),
  ]);
}