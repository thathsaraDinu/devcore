"use client";

import type { JSONContent } from "@tiptap/react";

import Tabs from "@/components/ui/Tabs";
import { renderRichText } from "@/components/editor/renderRichText";
import QuestionNotesReader from "./QuestionNotesReader";
import QuestionNotesManager from "./QuestionNotesManager";
import type { Note } from "@/features/notes/types/note";

type RelatedNote = {
  id: string;
  title: string;
  topicPath: string[];
};

type QuestionSidebarProps = {
  answer: JSONContent | null;
  relatedNotes: RelatedNote[];
  notes: Note[];
  questionId: string;
  questionTopicId: string | null;
};

export default function QuestionSidebar({
  answer,
  relatedNotes,
  notes,
  questionId,
  questionTopicId,
}: QuestionSidebarProps) {
  const answerHtml = answer ? renderRichText(answer) : null;

  return (
    <Tabs
      tabs={[
        { id: "answer", label: "Answer" },
        { id: "notes", label: "Related Notes" },
      ]}
      defaultTab="answer"
    >
      {(activeTab) => (
        <>
          {activeTab === "answer" && (
            <section>
              {answerHtml ? (
                <div
                  className="devcore-editor prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: answerHtml }}
                />
              ) : (
                <div className="rounded-lg border border-dashed border-border p-6">
                  <p className="text-sm text-text-muted">
                    No answer yet. Come back when you've figured it out.
                  </p>
                </div>
              )}
            </section>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <QuestionNotesReader relatedNotes={relatedNotes} notes={notes} />

              <QuestionNotesManager
                questionId={questionId}
                questionTopicId={questionTopicId}
                notes={notes}
                relatedNotes={relatedNotes}
              />
            </div>
          )}
        </>
      )}
    </Tabs>
  );
}
