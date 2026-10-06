import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";

import type { Topic } from "@/features/topics/types/topic";

export async function getTopics(): Promise<Topic[]> {
  const user = await requireCurrentUser();

  return prisma.topic.findMany({
    where: {
      OR: [
        {
          createdByUserId: null,
        },
        {
          createdByUserId: user.id,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      createdByUserId: true,
      sortOrder: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const user = await requireCurrentUser();

  return prisma.topic.findFirst({
    where: {
      id,
      createdByUserId: user.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      createdByUserId: true,
      sortOrder: true,
    },
  });
}
