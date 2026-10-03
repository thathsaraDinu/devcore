import type { Snippet } from "../types/snippet";
import SnippetCard from "./SnippetCard";

type SnippetListProps = {
  snippets: Snippet[];
};

export default function SnippetList({
  snippets,
}: SnippetListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
        />
      ))}
    </div>
  );
}