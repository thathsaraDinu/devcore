import { prisma } from "@/server/db/prisma";

export async function getAccessibleTopic(
  topicId: string,
  userId: string,
) {
  return prisma.topic.findFirst({
    where: {
      id: topicId,
      OR: [
        {
          createdByUserId: null,
        },
        {
          createdByUserId: userId,
        },
      ],
    },
    select: {
      id: true,
    },
  });
}

export async function requireAccessibleTopic(
  topicId: string,
  userId: string,
) {
  const topic = await getAccessibleTopic(topicId, userId);

  if (!topic) {
    throw new Error("Invalid topic.");
  }

  return topic;
}