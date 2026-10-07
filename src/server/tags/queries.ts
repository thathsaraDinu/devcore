import { prisma } from "@/server/db/prisma";
import { requireCurrentUser } from "@/server/users/queries";

import type { Tag } from "@/features/tags/types/tag";
import type { JSONContent } from "@tiptap/react";

type TagWithContent = {
  id: string;
  name: string;
  noteTags: {
    note: {
      id: string;
      title: string;
      updatedAt: Date;
    };
  }[];
  questionTags: {
    question: {
      id: string;
      question: JSONContent;
      status: "OPEN" | "RESOLVED";
      updatedAt: Date;
    };
  }[];
  snippetTags: {
    snippet: {
      id: string;
      title: string;
      language: string;
      updatedAt: Date;
    };
  }[];
};

export async function getTags(): Promise<Tag[]> {
  const user = await requireCurrentUser();

  return prisma.tag.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getTagById(id: string): Promise<TagWithContent | null> {
  const user = await requireCurrentUser();

  const tag = await prisma.tag.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      id: true,
      name: true,

      noteTags: {
        select: {
          note: {
            select: {
              id: true,
              title: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          note: {
            updatedAt: "desc",
          },
        },
      },

      questionTags: {
        select: {
          question: {
            select: {
              id: true,
              question: true,
              status: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          question: {
            updatedAt: "desc",
          },
        },
      },

      snippetTags: {
        select: {
          snippet: {
            select: {
              id: true,
              title: true,
              language: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          snippet: {
            updatedAt: "desc",
          },
        },
      },
    },
  });

  if (!tag) {
    return null;
  }

  return {
    ...tag,
    questionTags: tag.questionTags.map((qt) => ({
      ...qt,
      question: {
        ...qt.question,
        question: qt.question as JSONContent,
      },
    })),
  };
}
