"use server";

import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";
import { revalidatePath } from "next/cache";

function normalizeTagName(value: string) {
  return value.trim().toLowerCase().replace(/^#+/, "");
}

export async function createTag(name: string) {
  const user = await requireCurrentUser();

  const normalizedName = normalizeTagName(name);

  if (!normalizedName) {
    throw new Error("Tag name is required.");
  }

  return prisma.tag.upsert({
    where: {
      userId_name: {
        userId: user.id,
        name: normalizedName,
      },
    },
    update: {},
    create: {
      name: normalizedName,
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function deleteTag(id: string) {
  const user = await requireCurrentUser();

  const tag = await prisma.tag.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!tag) {
    throw new Error("Tag not found.");
  }

  await prisma.tag.delete({
    where: {
      id: tag.id,
    },
  });
}

export async function updateTag(
  tagId: string,
  name: string,
) {
  const user = await requireCurrentUser();

  const normalizedName = normalizeTagName(name);

  if (!normalizedName) {
    throw new Error("Tag name is required.");
  }

  const existingTag = await prisma.tag.findFirst({
    where: {
      id: tagId,
      userId: user.id,
    },
  });

  if (!existingTag) {
    throw new Error("Tag not found.");
  }

  const conflictingTag = await prisma.tag.findFirst({
    where: {
      userId: user.id,
      name: normalizedName,
      NOT: {
        id: tagId,
      },
    },
  });

  if (conflictingTag) {
    throw new Error(
      "A tag with this name already exists.",
    );
  }

  await prisma.tag.update({
    where: {
      id: tagId,
    },
    data: {
      name: normalizedName,
    },
  });

  revalidatePath("/tags");
  revalidatePath(`/tags/${tagId}`);
}