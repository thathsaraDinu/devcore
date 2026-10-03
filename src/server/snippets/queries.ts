import { prisma } from "@/server/db/prisma";

import type { Snippet } from "@/features/snippets/types/snippet";
import { getTopics } from "@/server/topics/queries";
import { requireCurrentUser } from "@/server/users/queries";

import { mapSnippet } from "./mappers";

const topicSelect = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
} as const;

const snippetTagInclude = {
  tag: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export async function getSnippets(): Promise<Snippet[]> {
  const user = await requireCurrentUser();

  const [snippets, topics] = await Promise.all([
    prisma.snippet.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        topic: {
          select: topicSelect,
        },
        snippetTags: {
          include: snippetTagInclude,
        },
      },
    }),
    getTopics(),
  ]);

  return snippets.map((snippet) =>
    mapSnippet(snippet, topics),
  );
}

export async function getSnippetById(
  id: string,
): Promise<Snippet | null> {
  const user = await requireCurrentUser();

  const [snippet, topics] = await Promise.all([
    prisma.snippet.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        topic: {
          select: topicSelect,
        },
        snippetTags: {
          include: snippetTagInclude,
        },
      },
    }),
    getTopics(),
  ]);

  if (!snippet) {
    return null;
  }

  return mapSnippet(snippet, topics);
}
