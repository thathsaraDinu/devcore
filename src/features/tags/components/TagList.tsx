import TagLink from "./TagLink";
import type { Tag } from "../types/tag";

type TagListProps = {
  tags: Tag[];
};

export default function TagList({
  tags,
}: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagLink
          key={tag.id}
          tag={tag}
        />
      ))}
    </div>
  );
}