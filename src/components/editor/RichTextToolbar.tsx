"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

type RichTextToolbarProps = {
  editor: Editor;
};

const fontSizes = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "XL", value: "24px" },
];

const textColors = [
  "#f8fafc",
  "#94a3b8",
  "#67e8f9",
  "#a78bfa",
  "#60a5fa",
  "#86efac",
  "#fde68a",
  "#fda4af",
];

const highlights = [
  "#312e81",
  "#164e63",
  "#3f3f46",
  "#713f12",
  "#7f1d1d",
];

function ToolbarButton({
  active = false,
  disabled = false,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={[
        "flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors",
        active
          ? "bg-accent-muted text-accent"
          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
        "disabled:pointer-events-none disabled:opacity-35",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-border" />;
}

export default function RichTextToolbar({
  editor,
}: RichTextToolbarProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate((value) => value + 1);

    editor.on("transaction", update);
    editor.on("selectionUpdate", update);

    return () => {
      editor.off("transaction", update);
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  const currentFontSize =
    editor.getAttributes("textStyle").fontSize ?? "16px";

  const currentTextColor =
    editor.getAttributes("textStyle").color ?? "#f8fafc";

  function handleSetLink() {
    const currentHref = editor.getAttributes("link").href ?? "";

    const url = window.prompt("Enter URL", currentHref);

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: trimmedUrl,
      })
      .run();
  }

  return (
    <div className="flex min-h-11 items-center gap-1 overflow-x-auto border-b border-border bg-surface px-2">
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>

      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>

      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <ToolbarButton
        title="Inline code"
        active={editor.isActive("code")}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {"</>"}
      </ToolbarButton>

      <ToolbarDivider />

      <select
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(event) => {
          const value = event.target.value;

          if (value === "p") {
            editor.chain().focus().setParagraph().run();
            return;
          }

          const level = Number(value.slice(1)) as 1 | 2 | 3;

          editor
            .chain()
            .focus()
            .toggleHeading({ level })
            .run();
        }}
        className="h-8 shrink-0 rounded-md border border-border bg-background px-2 text-xs text-text-secondary outline-none transition-colors hover:border-border-hover focus:border-accent"
        title="Text style"
        aria-label="Text style"
      >
        <option value="p">Text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <select
        value={currentFontSize}
        onChange={(event) => {
          const value = event.target.value;

          if (value === "16px") {
            editor.chain().focus().unsetFontSize().run();
            return;
          }

          editor
            .chain()
            .focus()
            .setFontSize(value)
            .run();
        }}
        className="h-8 shrink-0 rounded-md border border-border bg-background px-2 text-xs text-text-secondary outline-none transition-colors hover:border-border-hover focus:border-accent"
        title="Font size"
        aria-label="Font size"
      >
        {fontSizes.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <ToolbarDivider />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        • List
      </ToolbarButton>

      <ToolbarButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        1. List
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
      >
        “
      </ToolbarButton>

      <ToolbarButton
        title="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() =>
          editor.chain().focus().toggleCodeBlock().run()
        }
      >
        Code
      </ToolbarButton>

      <ToolbarButton
        title="Link"
        active={editor.isActive("link")}
        onClick={handleSetLink}
      >
        ↗
      </ToolbarButton>

      <ToolbarDivider />

      <div className="flex shrink-0 items-center gap-1">
        <span
          className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-text-secondary"
          title="Text color"
        >
          A
        </span>

        {textColors.map((color) => (
          <button
            key={color}
            type="button"
            title={`Text color ${color}`}
            aria-label={`Text color ${color}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              editor.chain().focus().setColor(color).run()
            }
            className={[
              "h-5 w-5 shrink-0 rounded-full border transition-transform hover:scale-110",
              currentTextColor.toLowerCase() === color
                ? "border-text-primary ring-1 ring-text-primary/30"
                : "border-border",
            ].join(" ")}
            style={{
              backgroundColor: color,
            }}
          />
        ))}
      </div>

      <div className="ml-1 flex shrink-0 items-center gap-1">
        <span
          className="flex h-8 items-center text-xs text-text-secondary"
          title="Highlight"
        >
          H
        </span>

        {highlights.map((color) => (
          <button
            key={color}
            type="button"
            title={`Highlight ${color}`}
            aria-label={`Highlight ${color}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHighlight({ color })
                .run()
            }
            className="h-5 w-5 shrink-0 rounded border border-border transition-transform hover:scale-110"
            style={{
              backgroundColor: color,
            }}
          />
        ))}

        <ToolbarButton
          title="Remove highlight"
          onClick={() =>
            editor.chain().focus().unsetHighlight().run()
          }
        >
          ×
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <ToolbarButton
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>

      <ToolbarButton
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>

      <ToolbarButton
        title="Clear formatting"
        onClick={() =>
          editor
            .chain()
            .focus()
            .clearNodes()
            .unsetAllMarks()
            .run()
        }
      >
        Clear
      </ToolbarButton>
    </div>
  );
}