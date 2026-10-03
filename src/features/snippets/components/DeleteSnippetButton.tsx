"use client";

import { useState } from "react";

import { deleteSnippet } from "@/server/snippets/mutations";

type DeleteSnippetButtonProps = {
  snippetId: string;
};

export default function DeleteSnippetButton({
  snippetId,
}: DeleteSnippetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this snippet?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSnippet(snippetId);
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
