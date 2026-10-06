import type { JSONContent } from "@tiptap/react";

import type { Note } from "@/features/notes/types/note";
import type { Topic } from "@/features/topics/types/topic";
import { getTopicPath } from "@/features/topics/utils/getTopicPath";

type NoteRecord = {
  id: string;
  title: string;
  content: unknown;
  topicId: string | null;
  createdAt: Date;
  updatedAt: Date;
  topic: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  } | null;
  noteTags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
};

export function mapNote(note: NoteRecord, topics: Topic[]): Note {
  return {
    id: note.id,
    title: note.title,
    content: note.content as JSONContent,
    topicId: note.topicId,
    topic: note.topic,
    topicPath: note.topic
      ? getTopicPath(topics, note.topic.id).map((topic) => topic.name)
      : [],
    tags: note.noteTags.map((noteTag) => noteTag.tag),
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}
