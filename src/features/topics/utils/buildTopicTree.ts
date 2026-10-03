import type { Topic, TopicNode } from "../types/topic";

export function buildTopicTree(topics: Topic[]): TopicNode[] {
  const nodes = new Map<string, TopicNode>();

  for (const topic of topics) {
    nodes.set(topic.id, {
      ...topic,
      children: [],
    });
  }

  const roots: TopicNode[] = [];

  for (const node of nodes.values()) {
    if (node.parentId === null) {
      roots.push(node);
      continue;
    }

    const parent = nodes.get(node.parentId);

    if (parent) {
      parent.children.push(node);
    }
  }

  const sortNodes = (nodes: TopicNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);

    for (const node of nodes) {
      sortNodes(node.children);
    }
  };

  sortNodes(roots);

  return roots;
}