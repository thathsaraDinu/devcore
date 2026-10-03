import type { Tag } from "@/features/tags/types/tag";

export type SnippetTopic = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type Snippet = {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string | null;
  userId: string;
  topicId: string | null;
  topic: SnippetTopic | null;
  topicPath: string[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};
