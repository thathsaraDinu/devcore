const tagColors = [
  {
    dot: "oklch(0.72 0.16 245)",
    text: "oklch(0.78 0.14 245)",
    border: "oklch(0.72 0.12 245 / 0.3)",
    background: "oklch(0.30 0.08 245 / 0.35)",
  },
  {
    dot: "oklch(0.72 0.16 290)",
    text: "oklch(0.78 0.14 290)",
    border: "oklch(0.72 0.12 290 / 0.3)",
    background: "oklch(0.30 0.08 290 / 0.35)",
  },
  {
    dot: "oklch(0.72 0.16 325)",
    text: "oklch(0.78 0.14 325)",
    border: "oklch(0.72 0.12 325 / 0.3)",
    background: "oklch(0.30 0.08 325 / 0.35)",
  },
  {
    dot: "oklch(0.72 0.15 350)",
    text: "oklch(0.78 0.13 350)",
    border: "oklch(0.72 0.11 350 / 0.3)",
    background: "oklch(0.30 0.07 350 / 0.35)",
  },
  {
    dot: "oklch(0.74 0.15 20)",
    text: "oklch(0.79 0.13 20)",
    border: "oklch(0.74 0.11 20 / 0.3)",
    background: "oklch(0.30 0.07 20 / 0.35)",
  },
  {
    dot: "oklch(0.75 0.14 55)",
    text: "oklch(0.80 0.12 55)",
    border: "oklch(0.75 0.10 55 / 0.3)",
    background: "oklch(0.31 0.07 55 / 0.35)",
  },
  {
    dot: "oklch(0.74 0.15 95)",
    text: "oklch(0.79 0.13 95)",
    border: "oklch(0.74 0.11 95 / 0.3)",
    background: "oklch(0.30 0.07 95 / 0.35)",
  },
  {
    dot: "oklch(0.72 0.16 145)",
    text: "oklch(0.78 0.14 145)",
    border: "oklch(0.72 0.12 145 / 0.3)",
    background: "oklch(0.30 0.08 145 / 0.35)",
  },
  {
    dot: "oklch(0.72 0.15 175)",
    text: "oklch(0.78 0.13 175)",
    border: "oklch(0.72 0.11 175 / 0.3)",
    background: "oklch(0.30 0.07 175 / 0.35)",
  },
  {
    dot: "oklch(0.72 0.15 195)",
    text: "oklch(0.78 0.13 195)",
    border: "oklch(0.72 0.11 195 / 0.3)",
    background: "oklch(0.30 0.07 195 / 0.35)",
  },
  {
    dot: "oklch(0.70 0.15 220)",
    text: "oklch(0.76 0.13 220)",
    border: "oklch(0.70 0.11 220 / 0.3)",
    background: "oklch(0.30 0.07 220 / 0.35)",
  },
  {
    dot: "oklch(0.71 0.16 265)",
    text: "oklch(0.77 0.14 265)",
    border: "oklch(0.71 0.12 265 / 0.3)",
    background: "oklch(0.30 0.08 265 / 0.35)",
  },
] as const;

function hashTagId(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

export function getTagColor(tagId: string) {
  const index =
    hashTagId(tagId) % tagColors.length;

  return tagColors[index];
}