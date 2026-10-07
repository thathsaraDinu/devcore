"use client";

import type { JSONContent } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";

import { serverEditorExtensions } from "./serverExtensions";
import RichTextToolbar from "./RichTextToolbar";

type RichTextEditorProps = {
  initialContent?: JSONContent | null;
  onChange: (content: JSONContent) => void;
  placeholder?: string;
};

const emptyDocument: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export default function RichTextEditor({
  initialContent,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: serverEditorExtensions,
    content: initialContent ?? emptyDocument,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "devcore-editor",
        "data-placeholder": placeholder,
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[500px] animate-pulse rounded-lg border border-border bg-surface" />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <RichTextToolbar editor={editor} />

      <div className="min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
