import { prisma } from "@/server/db/prisma";

import { getNotePreview } from "@/features/notes/utils/getNotePreview";
import { getQuestionPreview } from "@/features/questions/utils/getQuestionPreview";
import { getTopicPath } from "@/features/topics/utils/getTopicPath";
import type { SearchResult } from "@/features/search/types/search";
import { getTopics } from "@/server/topics/queries";
import { requireCurrentUser } from "@/server/users/queries";
import type { JSONContent } from "@tiptap/react";

const topicSelect = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
} as const;

type RawNote = {
  id: string;
  title: string;
  content: JSONContent;
  topicId: string | null;
  updatedAt: Date;
};

type RawQuestion = {
  id: string;
  question: JSONContent;
  answer: JSONContent | null;
  status: "OPEN" | "RESOLVED";
  topicId: string | null;
  updatedAt: Date;
};

type RawSnippet = {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string | null;
  topicId: string | null;
  updatedAt: Date;
};

const MAX_RESULTS_PER_TYPE = 20;

export async function searchAll(rawQuery: string): Promise<SearchResult[]> {
  const user = await requireCurrentUser();

  const query = rawQuery.trim();

  if (!query) {
    return [];
  }

  const [topics, notes, questions, snippets] = await Promise.all([
    getTopics(),

    prisma.note.findMany({
      where: {
        userId: user.id,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: MAX_RESULTS_PER_TYPE,
      select: {
        id: true,
        title: true,
        content: true,
        topicId: true,
        updatedAt: true,
      },
    }),

    prisma.question.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: MAX_RESULTS_PER_TYPE,
      include: {
        topic: {
          select: topicSelect,
        },
      },
    }),

    prisma.snippet.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            language: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: MAX_RESULTS_PER_TYPE,
      select: {
        id: true,
        title: true,
        language: true,
        code: true,
        description: true,
        topicId: true,
        updatedAt: true,
      },
    }),
  ]);

  const noteResults: SearchResult[] = notes.map((note) => ({
    id: note.id,
    type: "NOTE",
    title: note.title,
    preview: getNotePreview(note.content as JSONContent),
    topicPath: note.topicId
      ? getTopicPath(topics, note.topicId).map((topic) => topic.name)
      : [],
    updatedAt: note.updatedAt.toISOString(),
  }));

  const questionResults: SearchResult[] = questions.map((question) => ({
    id: question.id,
    type: "QUESTION",
    title: getQuestionPreview(question.question as JSONContent),
    preview: question.answer
      ? getNotePreview(question.answer as JSONContent)
      : "No answer yet.",
    topicPath: question.topicId
      ? getTopicPath(topics, question.topicId).map((topic) => topic.name)
      : [],
    updatedAt: question.updatedAt.toISOString(),
  }));

  const snippetResults: SearchResult[] = snippets.map((snippet) => ({
    id: snippet.id,
    type: "SNIPPET",
    title: snippet.title,
    preview: snippet.description ?? snippet.code,
    topicPath: snippet.topicId
      ? getTopicPath(topics, snippet.topicId).map((topic) => topic.name)
      : [],
    updatedAt: snippet.updatedAt.toISOString(),
  }));

  return [...noteResults, ...questionResults, ...snippetResults].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
