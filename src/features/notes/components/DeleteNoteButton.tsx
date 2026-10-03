"use client";

import { useState } from "react";
import { deleteNote } from "@/server/notes/mutations";

type DeleteNoteButtonProps = {
  noteId: string;
};

export default function DeleteNoteButton({
  noteId,
}: DeleteNoteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    await deleteNote(noteId);
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