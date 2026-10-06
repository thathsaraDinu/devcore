import type { JSONContent } from "@tiptap/react";

export function getNotePreview(content: JSONContent, maxLength = 160): string {
  function extractText(node: JSONContent): string {
    if (node.type === "text") {
      return node.text ?? "";
    }

    if (!node.content) {
      return "";
    }

    return node.content.map(extractText).join(" ");
  }

  const text = extractText(content).replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
}
