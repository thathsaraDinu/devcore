"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteTag } from "@/server/tags/mutations";

type DeleteTagButtonProps = {
  tagId: string;
};

export default function DeleteTagButton({
  tagId,
}: DeleteTagButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this tag? It will be removed from all Notes, Questions, and Snippets. Your knowledge itself will not be deleted.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTag(tagId);
      router.push("/tags");
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border border-red-500/25 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete Tag"}
    </button>
  );
}