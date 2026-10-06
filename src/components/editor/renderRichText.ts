import type { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";

import { serverEditorExtensions } from "./serverExtensions";

export function renderRichText(content: JSONContent) {
  return generateHTML(content, serverEditorExtensions);
}
