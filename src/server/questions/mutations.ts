"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";
import { requireAccessibleTopic } from "../topics/access";
import { requireOwnedTags } from "../tags/access";

type QuestionInput = {
  question: string;
  answer: string | null;
  topicId: string | null;
  tagIds: string[];
};

async function validateTopic(
  topicId: string | null,
  userId: string,
) {
  if (!topicId) {
    return;
  }

  await requireAccessibleTopic(topicId, userId);
}

export async function createQuestion(
  input: QuestionInput,
) {
  const user = await requireCurrentUser();

  const question = input.question.trim();
  const answer = input.answer?.trim() || null;
  const topicId = input.topicId || null;
  const uniqueTagIds = [...new Set(input.tagIds ?? [])];

  if (!question) {
    throw new Error("Question is required.");
  }

  await validateTopic(topicId, user.id);
  await requireOwnedTags(uniqueTagIds, user.id);

  await prisma.$transaction(async (tx) => {
    const createdQuestion = await tx.question.create({
      data: {
        question,
        answer,
        topicId,
        userId: user.id,
      },
    });

    if (uniqueTagIds.length > 0) {
      await tx.questionTag.createMany({
        data: uniqueTagIds.map((tagId) => ({
          questionId: createdQuestion.id,
          tagId,
        })),
      });
    }
  });

  revalidatePath("/questions");
  redirect("/questions");
}

export async function updateQuestion(
  id: string,
  input: QuestionInput,
) {
  const user = await requireCurrentUser();

  const question = input.question.trim();
  const answer = input.answer?.trim() || null;
  const topicId = input.topicId || null;
  const uniqueTagIds = [...new Set(input.tagIds ?? [])];

  if (!question) {
    throw new Error("Question is required.");
  }

  const existingQuestion = await prisma.question.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  await validateTopic(topicId, user.id);
  await requireOwnedTags(uniqueTagIds, user.id);

  await prisma.$transaction(async (tx) => {
    await tx.question.update({
      where: {
        id,
      },
      data: {
        question,
        answer,
        topicId,
      },
    });

    await tx.questionTag.deleteMany({
      where: {
        questionId: id,
      },
    });

    if (uniqueTagIds.length > 0) {
      await tx.questionTag.createMany({
        data: uniqueTagIds.map((tagId) => ({
          questionId: id,
          tagId,
        })),
      });
    }
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${id}`);
  redirect(`/questions/${id}`);
}

export async function deleteQuestion(id: string) {
  const user = await requireCurrentUser();

  const existingQuestion = await prisma.question.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  await prisma.question.delete({
    where: {
      id,
    },
  });

  revalidatePath("/questions");
  redirect("/questions");
}

export async function resolveQuestion(id: string) {
  const user = await requireCurrentUser();

  const existingQuestion = await prisma.question.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  await prisma.question.update({
    where: {
      id,
    },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
    },
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${id}`);
}

export async function reopenQuestion(id: string) {
  const user = await requireCurrentUser();

  const existingQuestion = await prisma.question.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  await prisma.question.update({
    where: {
      id,
    },
    data: {
      status: "OPEN",
      resolvedAt: null,
    },
  });

  revalidatePath("/questions");
  revalidatePath(`/questions/${id}`);
}

export async function attachNoteToQuestion(
  questionId: string,
  noteId: string,
) {
  const user = await requireCurrentUser();

  const [question, note] = await Promise.all([
    prisma.question.findFirst({
      where: {
        id: questionId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    }),
    prisma.note.findFirst({
      where: {
        id: noteId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!question) {
    throw new Error("Question not found.");
  }

  if (!note) {
    throw new Error("Note not found.");
  }

  await prisma.questionNote.upsert({
    where: {
      questionId_noteId: {
        questionId: question.id,
        noteId: note.id,
      },
    },
    update: {},
    create: {
      questionId: question.id,
      noteId: note.id,
    },
  });

  revalidatePath(`/questions/${questionId}`);
}

export async function detachNoteFromQuestion(
  questionId: string,
  noteId: string,
) {
  const user = await requireCurrentUser();

  const [question, note] = await Promise.all([
    prisma.question.findFirst({
      where: {
        id: questionId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    }),
    prisma.note.findFirst({
      where: {
        id: noteId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!question) {
    throw new Error("Question not found.");
  }

  if (!note) {
    throw new Error("Note not found.");
  }

  await prisma.questionNote.deleteMany({
    where: {
      questionId: question.id,
      noteId: note.id,
    },
  });

  revalidatePath(`/questions/${questionId}`);
}

type CreateNoteForQuestionInput = {
  title: string;
  content: string;
  topicId: string | null;
};

export async function createNoteForQuestion(
  questionId: string,
  input: CreateNoteForQuestionInput,
) {
  const user = await requireCurrentUser();

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      userId: user.id,
    },
    select: {
      id: true,
      topicId: true,
    },
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  const title = input.title.trim();
  const content = input.content.trim();
  const topicId =
    input.topicId || question.topicId || null;

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!content) {
    throw new Error("Content is required.");
  }

  await validateTopic(topicId, user.id);

  await prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: {
        title,
        content,
        topicId,
        userId: user.id,
      },
    });

    await tx.questionNote.create({
      data: {
        questionId: question.id,
        noteId: note.id,
      },
    });
  });

  revalidatePath("/notes");
  revalidatePath("/questions");
  revalidatePath(`/questions/${questionId}`);

  return { success: true };
}
