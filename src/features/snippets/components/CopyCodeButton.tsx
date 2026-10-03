"use client";

import { useState } from "react";

type CopyCodeButtonProps = {
  code: string;
};

export default function CopyCodeButton({
  code,
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
    >
      {copied ? "Copied" : "Copy Code"}
    </button>
  );
}
