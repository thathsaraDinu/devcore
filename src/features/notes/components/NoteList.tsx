import type { Note } from "../types/note";
import NoteCard from "./NoteCard";

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({
  notes,
}: NoteListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}