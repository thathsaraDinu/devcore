import { prisma } from "@/server/db/prisma";

import type { Question } from "@/features/questions/types/question";
import { getTopics } from "@/server/topics/queries";
import { requireCurrentUser } from "@/server/users/queries";

import { mapQuestion } from "./mappers";

const topicSelect = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
} as const;

const questionNoteInclude = {
  note: {
    select: {
      id: true,
      title: true,
      topic: {
        select: topicSelect,
      },
    },
  },
} as const;

export async function getQuestions(): Promise<Question[]> {
  const user = await requireCurrentUser();

  const [questions, topics] = await Promise.all([
    prisma.question.findMany({
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
        questionNotes: {
          include: questionNoteInclude,
        },
        questionTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    getTopics(),
  ]);

  return questions.map((question) => mapQuestion(question, topics));
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const user = await requireCurrentUser();

  const [question, topics] = await Promise.all([
    prisma.question.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        topic: {
          select: topicSelect,
        },
        questionNotes: {
          include: questionNoteInclude,
        },
        questionTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    getTopics(),
  ]);

  if (!question) {
    return null;
  }

  return mapQuestion(question, topics);
}
