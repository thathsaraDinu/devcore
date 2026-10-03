"use client";

import { useState } from "react";

import {
  reopenQuestion,
  resolveQuestion,
} from "@/server/questions/mutations";

type QuestionStatusButtonProps = {
  questionId: string;
  status: "OPEN" | "RESOLVED";
};

export default function QuestionStatusButton({
  questionId,
  status,
}: QuestionStatusButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const isResolved = status === "RESOLVED";

  async function handleClick() {
    setIsUpdating(true);

    try {
      if (isResolved) {
        await reopenQuestion(questionId);
      } else {
        await resolveQuestion(questionId);
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUpdating}
      className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isUpdating
        ? "Updating..."
        : isResolved
          ? "Reopen Question"
          : "Mark as Resolved"}
    </button>
  );
}
