import { prisma } from "@/server/db/prisma";

import { getTopicPath } from "@/features/topics/utils/getTopicPath";
import type { SearchResult } from "@/features/search/types/search";
import { getTopics } from "@/server/topics/queries";
import { requireCurrentUser } from "@/server/users/queries";

const topicSelect = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
} as const;

const MAX_RESULTS_PER_TYPE = 20;

export async function searchAll(
  rawQuery: string,
): Promise<SearchResult[]> {
  const user = await requireCurrentUser();

  const query = rawQuery.trim();

  if (!query) {
    return [];
  }

  const [topics, notes, questions, snippets] =
    await Promise.all([
      getTopics(),

      prisma.note.findMany({
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
              content: {
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
        include: {
          topic: {
            select: topicSelect,
          },
        },
      }),

      prisma.question.findMany({
        where: {
          userId: user.id,
          OR: [
            {
              question: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              answer: {
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
        include: {
          topic: {
            select: topicSelect,
          },
        },
      }),
    ]);

  const noteResults: SearchResult[] = notes.map(
    (note) => ({
      id: note.id,
      type: "NOTE",
      title: note.title,
      preview: note.content,
      topicPath: note.topic
        ? getTopicPath(topics, note.topic.id).map(
            (topic) => topic.name,
          )
        : [],
      updatedAt: note.updatedAt.toISOString(),
    }),
  );

  const questionResults: SearchResult[] = questions.map(
    (question) => ({
      id: question.id,
      type: "QUESTION",
      title: question.question,
      preview:
        question.answer ??
        "No answer yet.",
      topicPath: question.topic
        ? getTopicPath(topics, question.topic.id).map(
            (topic) => topic.name,
          )
        : [],
      updatedAt: question.updatedAt.toISOString(),
    }),
  );

  const snippetResults: SearchResult[] = snippets.map(
    (snippet) => ({
      id: snippet.id,
      type: "SNIPPET",
      title: snippet.title,
      preview: snippet.description ?? snippet.code,
      topicPath: snippet.topic
        ? getTopicPath(topics, snippet.topic.id).map(
            (topic) => topic.name,
          )
        : [],
      updatedAt: snippet.updatedAt.toISOString(),
    }),
  );

  return [
    ...noteResults,
    ...questionResults,
    ...snippetResults,
  ].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime(),
  );
}