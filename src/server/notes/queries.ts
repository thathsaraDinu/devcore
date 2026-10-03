import { prisma } from "@/server/db/prisma";

import { getTopics } from "@/server/topics/queries";
import { requireCurrentUser } from "@/server/users/queries";

import { mapNote } from "./mappers";

import type { Note } from "@/features/notes/types/note";

const noteTopicSelect = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
} as const;

export async function getNotes(): Promise<Note[]> {
  const user = await requireCurrentUser();

  const [notes, topics] = await Promise.all([
    prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        topic: {
          select: noteTopicSelect,
        },
        noteTags: {
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

  return notes.map((note) => mapNote(note, topics));
}

export async function getNoteById(id: string): Promise<Note | null> {
  const user = await requireCurrentUser();

  const [note, topics] = await Promise.all([
    prisma.note.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        topic: {
          select: noteTopicSelect,
        },
        noteTags: {
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

  if (!note) {
    return null;
  }

  return mapNote(note, topics);
}
