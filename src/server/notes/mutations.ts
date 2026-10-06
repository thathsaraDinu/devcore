"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { JSONContent } from "@tiptap/react";

import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";
import { requireAccessibleTopic } from "../topics/access";
import { requireOwnedTags } from "../tags/access";

type NoteInput = {
  title: string;
  content: JSONContent;
  topicId: string | null;
  tagIds: string[];
};

function hasRichTextContent(content: JSONContent): boolean {
  if (!content.content) {
    return false;
  }

  return content.content.some((node: JSONContent) => {
    if (node.type === "text") {
      return Boolean(node.text?.trim());
    }

    return hasRichTextContent(node);
  });
}

export async function createNote(input: NoteInput) {
  const user = await requireCurrentUser();

  const title = input.title.trim();
  const content = input.content;
  const topicId = input.topicId || null;
  const tagIds = input.tagIds ?? [];

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!hasRichTextContent(content)) {
    throw new Error("Content is required.");
  }

  if (topicId) {
    await requireAccessibleTopic(topicId, user.id);
  }

  const uniqueTagIds = [...new Set(tagIds)];

  await requireOwnedTags(uniqueTagIds, user.id);

  await prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: {
        title,
        content: content as any,
        topicId,
        userId: user.id,
      },
    });

    if (uniqueTagIds.length > 0) {
      await tx.noteTag.createMany({
        data: uniqueTagIds.map((tagId) => ({
          noteId: note.id,
          tagId,
        })),
      });
    }
  });

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(id: string, input: NoteInput) {
  const user = await requireCurrentUser();

  const title = input.title.trim();
  const content = input.content;
  const topicId = input.topicId || null;
  const tagIds = input.tagIds ?? [];

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!hasRichTextContent(content)) {
    throw new Error("Content is required.");
  }

  const existingNote = await prisma.note.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found.");
  }

  if (topicId) {
    await requireAccessibleTopic(topicId, user.id);
  }

  const uniqueTagIds = [...new Set(tagIds)];

  await requireOwnedTags(uniqueTagIds, user.id);

  await prisma.$transaction(async (tx) => {
    await tx.note.update({
      where: {
        id,
      },
      data: {
        title,
        content: content as any,
        topicId,
      },
    });

    await tx.noteTag.deleteMany({
      where: {
        noteId: id,
      },
    });

    if (uniqueTagIds.length > 0) {
      await tx.noteTag.createMany({
        data: uniqueTagIds.map((tagId) => ({
          noteId: id,
          tagId,
        })),
      });
    }
  });

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);

  redirect(`/notes/${id}`);
}

export async function deleteNote(id: string) {
  const user = await requireCurrentUser();

  const existingNote = await prisma.note.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found.");
  }

  await prisma.note.delete({
    where: {
      id,
    },
  });

  revalidatePath("/notes");
  redirect("/notes");
}
