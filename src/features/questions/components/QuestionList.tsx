import type { Question } from "../types/question";
import QuestionCard from "./QuestionCard";

type QuestionListProps = {
  questions: Question[];
};

export default function QuestionList({
  questions,
}: QuestionListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
        />
      ))}
    </div>
  );
}