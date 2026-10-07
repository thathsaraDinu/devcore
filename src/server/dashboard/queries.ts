import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";
import type { JSONContent } from "@tiptap/react";

function extractTextFromJsonContent(content: JSONContent): string {
  function extractText(node: JSONContent): string {
    if (node.type === "text") {
      return node.text ?? "";
    }

    if (!node.content) {
      return "";
    }

    return node.content.map(extractText).join(" ");
  }

  return extractText(content).replace(/\s+/g, " ").trim();
}

export async function getDashboardData() {
  const user = await requireCurrentUser();

  const [
    noteCount,
    questionCount,
    openQuestionCount,
    snippetCount,
    topicCount,
    recentNotes,
    recentQuestions,
    recentSnippets,
    openQuestions,
  ] = await Promise.all([
    prisma.note.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.question.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.question.count({
      where: {
        userId: user.id,
        status: "OPEN",
      },
    }),

    prisma.snippet.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.topic.count({
      where: {
        OR: [{ createdByUserId: null }, { createdByUserId: user.id }],
      },
    }),

    prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    }),

    prisma.question.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        question: true,
        status: true,
        updatedAt: true,
      },
    }),

    prisma.snippet.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        language: true,
        updatedAt: true,
      },
    }),
    prisma.question.findMany({
      where: {
        userId: user.id,
        status: "OPEN",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        question: true,
        topic: {
          select: {
            name: true,
          },
        },
        updatedAt: true,
      },
    }),
  ]);

  return {
    counts: {
      notes: noteCount,
      questions: questionCount,
      openQuestions: openQuestionCount,
      snippets: snippetCount,
      topics: topicCount,
    },

    recentNotes: recentNotes.map((note) => ({
      ...note,
      updatedAt: note.updatedAt.toISOString(),
    })),

    recentQuestions: recentQuestions.map((question) => ({
      id: question.id,
      question: extractTextFromJsonContent(question.question as JSONContent),
      status: question.status,
      updatedAt: question.updatedAt.toISOString(),
    })),

    recentSnippets: recentSnippets.map((snippet) => ({
      ...snippet,
      updatedAt: snippet.updatedAt.toISOString(),
    })),

    openQuestions: openQuestions.map((question) => ({
      id: question.id,
      question: extractTextFromJsonContent(question.question as JSONContent),
      topic: question.topic,
      updatedAt: question.updatedAt.toISOString(),
    })),
  };
}
