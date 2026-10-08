"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";

function createSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTopic(formData: FormData) {
  const user = await requireCurrentUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const rawParentId = formData.get("parentId");
  const parentId =
    typeof rawParentId === "string" && rawParentId ? rawParentId : null;

  if (!name) {
    throw new Error("Topic name is required.");
  }

  if (parentId) {
    const parent = await prisma.topic.findFirst({
      where: {
        id: parentId,
        OR: [{ createdByUserId: null }, { createdByUserId: user.id }],
      },
      select: {
        id: true,
      },
    });

    if (!parent) {
      throw new Error("Invalid parent topic.");
    }
  }

  const slug = createSlug(name);

  if (!slug) {
    throw new Error("Topic name must contain letters or numbers.");
  }

  await prisma.topic.create({
    data: {
      name,
      slug,
      description,
      parentId,
      createdByUserId: user.id,
    },
  });

  revalidatePath("/topics");
  return { redirectUrl: "/topics" };
}

export async function updateTopic(formData: FormData) {
  const user = await requireCurrentUser();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const rawParentId = formData.get("parentId");
  const parentId =
    typeof rawParentId === "string" && rawParentId ? rawParentId : null;

  if (!id) {
    throw new Error("Topic ID is required.");
  }

  if (!name) {
    throw new Error("Topic name is required.");
  }

  const existingTopic = await prisma.topic.findFirst({
    where: {
      id,
      createdByUserId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingTopic) {
    throw new Error("Topic not found.");
  }

  if (parentId === id) {
    throw new Error("A topic cannot be its own parent.");
  }

  if (parentId) {
    const parent = await prisma.topic.findFirst({
      where: {
        id: parentId,
        OR: [{ createdByUserId: null }, { createdByUserId: user.id }],
      },
      select: {
        id: true,
      },
    });

    if (!parent) {
      throw new Error("Invalid parent topic.");
    }

    const topics = await prisma.topic.findMany({
      where: {
        OR: [{ createdByUserId: null }, { createdByUserId: user.id }],
      },
      select: {
        id: true,
        parentId: true,
      },
    });

    const topicMap = new Map(topics.map((topic) => [topic.id, topic]));

    let currentId: string | null = parentId;

    while (currentId) {
      if (currentId === id) {
        throw new Error(
          "A topic cannot be moved under one of its descendants.",
        );
      }

      currentId = topicMap.get(currentId)?.parentId ?? null;
    }
  }

  const slug = createSlug(name);

  if (!slug) {
    throw new Error("Topic name must contain letters or numbers.");
  }

  await prisma.topic.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      description,
      parentId,
    },
  });

  revalidatePath("/topics");
  revalidatePath("/notes");

  return { redirectUrl: "/topics" };
}

export async function deleteTopic(id: string) {
  const user = await requireCurrentUser();

  const topic = await prisma.topic.findFirst({
    where: {
      id,
      createdByUserId: user.id,
    },
    select: {
      id: true,
      children: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!topic) {
    throw new Error("Topic not found.");
  }

  if (topic.children.length > 0) {
    throw new Error("Cannot delete a topic that has child topics.");
  }

  await prisma.topic.delete({
    where: {
      id: topic.id,
    },
  });

  revalidatePath("/topics");
  revalidatePath("/notes");
  return { redirectUrl: "/topics" };
}
