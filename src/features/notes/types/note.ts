import { Tag } from "@/features/tags/types/tag";

export type NoteTopic = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  topicId: string | null;
  topic: NoteTopic | null;
  topicPath: string[];
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};