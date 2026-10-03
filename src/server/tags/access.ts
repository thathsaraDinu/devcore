import { prisma } from "@/server/db/prisma";

export async function requireOwnedTags(
  tagIds: string[],
  userId: string,
) {
  const uniqueTagIds = [
    ...new Set(tagIds.filter(Boolean)),
  ];

  if (uniqueTagIds.length === 0) {
    return [];
  }

  const tags = await prisma.tag.findMany({
    where: {
      id: {
        in: uniqueTagIds,
      },
      userId,
    },
    select: {
      id: true,
    },
  });

  if (tags.length !== uniqueTagIds.length) {
    throw new Error("Invalid tag.");
  }

  return tags;
}