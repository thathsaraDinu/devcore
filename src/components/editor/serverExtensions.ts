import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";

export const serverEditorExtensions = [
  StarterKit.configure({
    link: {
      openOnClick: false,
    },
  }),
  TextStyleKit,
  Highlight.configure({
    multicolor: true,
  }),
];