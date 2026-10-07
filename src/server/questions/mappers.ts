import type { JSONContent } from "@tiptap/react";

import type { Question } from "@/features/questions/types/question";
import type { Topic } from "@/features/topics/types/topic";

import { getTopicPath } from "@/features/topics/utils/getTopicPath";

type QuestionRecord = {
  id: string;
  question: unknown;
  answer: unknown;
  status: "OPEN" | "RESOLVED";
  resolvedAt: Date | null;
  userId: string;
  topicId: string | null;
  createdAt: Date;
  updatedAt: Date;
  topic: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  } | null;
  questionNotes: {
    note: {
      id: string;
      title: string;
      topic: {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
      } | null;
    };
  }[];
  questionTags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
};

export function mapQuestion(
  question: QuestionRecord,
  topics: Topic[],
): Question {
  return {
    id: question.id,
    question: question.question as JSONContent,
    answer: question.answer as JSONContent | null,
    status: question.status,
    resolvedAt: question.resolvedAt?.toISOString() ?? null,
    userId: question.userId,
    topicId: question.topicId,
    topic: question.topic,
    topicPath: question.topic
      ? getTopicPath(topics, question.topic.id).map((topic) => topic.name)
      : [],
    relatedNotes: question.questionNotes.map(({ note }) => ({
      id: note.id,
      title: note.title,
      topicPath: note.topic
        ? getTopicPath(topics, note.topic.id).map((topic) => topic.name)
        : [],
    })),
    tags: question.questionTags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
    })),
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}
