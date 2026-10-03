"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/server/db/prisma";
import { requireAccessibleTopic } from "@/server/topics/access";
import { requireOwnedTags } from "@/server/tags/access";
import { requireCurrentUser } from "@/server/users/queries";

type SnippetInput = {
  title: string;
  language: string;
  code: string;
  description: string | null;
  topicId: string | null;
  tagIds: string[];
};

export async function createSnippet(input: SnippetInput) {
  const user = await requireCurrentUser();

  const title = input.title.trim();
  const language = input.language.trim();
  const code = input.code;
  const description = input.description?.trim() || null;
  const topicId = input.topicId || null;
  const uniqueTagIds = [...new Set(input.tagIds ?? [])];

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!language) {
    throw new Error("Language is required.");
  }

  if (!code.trim()) {
    throw new Error("Code is required.");
  }

  if (topicId) {
    await requireAccessibleTopic(topicId, user.id);
  }

  await requireOwnedTags(uniqueTagIds, user.id);

  await prisma.$transaction(async (tx) => {
    const snippet = await tx.snippet.create({
      data: {
        title,
        language,
        code,
        description,
        topicId,
        userId: user.id,
      },
    });

    if (uniqueTagIds.length > 0) {
      await tx.snippetTag.createMany({
        data: uniqueTagIds.map((tagId) => ({
          snippetId: snippet.id,
          tagId,
        })),
      });
    }
  });

  revalidatePath("/snippets");
  redirect("/snippets");
}

export async function updateSnippet(
  id: string,
  input: SnippetInput,
) {
  const user = await requireCurrentUser();

  const title = input.title.trim();
  const language = input.language.trim();
  const code = input.code;
  const description = input.description?.trim() || null;
  const topicId = input.topicId || null;
  const uniqueTagIds = [...new Set(input.tagIds ?? [])];

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!language) {
    throw new Error("Language is required.");
  }

  if (!code.trim()) {
    throw new Error("Code is required.");
  }

  const existingSnippet = await prisma.snippet.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingSnippet) {
    throw new Error("Snippet not found.");
  }

  if (topicId) {
    await requireAccessibleTopic(topicId, user.id);
  }

  await requireOwnedTags(uniqueTagIds, user.id);

  await prisma.$transaction(async (tx) => {
    await tx.snippet.update({
      where: {
        id,
      },
      data: {
        title,
        language,
        code,
        description,
        topicId,
      },
    });

    await tx.snippetTag.deleteMany({
      where: {
        snippetId: id,
      },
    });

    if (uniqueTagIds.length > 0) {
      await tx.snippetTag.createMany({
        data: uniqueTagIds.map((tagId) => ({
          snippetId: id,
          tagId,
        })),
      });
    }
  });

  revalidatePath("/snippets");
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: string) {
  const user = await requireCurrentUser();

  const existingSnippet = await prisma.snippet.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingSnippet) {
    throw new Error("Snippet not found.");
  }

  await prisma.snippet.delete({
    where: {
      id,
    },
  });

  revalidatePath("/snippets");
  redirect("/snippets");
}
