import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";

import type { Tag } from "@/features/tags/types/tag";

export async function getTags(): Promise<Tag[]> {
  const user = await requireCurrentUser();

  return prisma.tag.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getTagById(id: string) {
  const user = await requireCurrentUser();

  return prisma.tag.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      name: true,

      noteTags: {
        select: {
          note: {
            select: {
              id: true,
              title: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          note: {
            updatedAt: "desc",
          },
        },
      },

      questionTags: {
        select: {
          question: {
            select: {
              id: true,
              question: true,
              status: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          question: {
            updatedAt: "desc",
          },
        },
      },

      snippetTags: {
        select: {
          snippet: {
            select: {
              id: true,
              title: true,
              language: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          snippet: {
            updatedAt: "desc",
          },
        },
      },
    },
  });
}
