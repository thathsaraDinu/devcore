import type { JSONContent } from "@tiptap/react";
import { Tag } from "@/features/tags/types/tag";

export type QuestionStatus = "OPEN" | "RESOLVED";

export type QuestionTopic = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type QuestionRelatedNote = {
  id: string;
  title: string;
  topicPath: string[];
};

export type Question = {
  id: string;
  question: JSONContent;
  answer: JSONContent | null;
  status: QuestionStatus;
  resolvedAt: string | null;
  userId: string;
  topicId: string | null;
  topic: QuestionTopic | null;
  topicPath: string[];
  relatedNotes: QuestionRelatedNote[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};
