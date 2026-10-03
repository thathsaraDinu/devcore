"use client";

import { useState } from "react";

import { deleteQuestion } from "@/server/questions/mutations";

type DeleteQuestionButtonProps = {
  questionId: string;
};

export default function DeleteQuestionButton({
  questionId,
}: DeleteQuestionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteQuestion(questionId);
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
