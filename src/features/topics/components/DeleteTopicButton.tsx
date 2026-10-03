"use client";

import { useState } from "react";

import { deleteTopic } from "@/server/topics/mutations";

type DeleteTopicButtonProps = {
  topicId: string;
};

export default function DeleteTopicButton({
  topicId,
}: DeleteTopicButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this topic?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTopic(topicId);
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="shrink-0 cursor-pointer text-sm text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}