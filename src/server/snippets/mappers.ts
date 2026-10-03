import { getTopicPath } from "@/features/topics/utils/getTopicPath";

import type { Snippet } from "@/features/snippets/types/snippet";
import type { Topic } from "@/features/topics/types/topic";

type SnippetRecord = {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string | null;
  userId: string;
  topicId: string | null;
  createdAt: Date;
  updatedAt: Date;

  topic: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  } | null;

  snippetTags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
};

export function mapSnippet(
  snippet: SnippetRecord,
  topics: Topic[],
): Snippet {
  return {
    id: snippet.id,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    description: snippet.description,
    userId: snippet.userId,
    topicId: snippet.topicId,
    topic: snippet.topic,
    topicPath: snippet.topic
      ? getTopicPath(topics, snippet.topic.id).map(
          (topic) => topic.name,
        )
      : [],
    tags: snippet.snippetTags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
    })),
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
  };
}
