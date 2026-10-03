import Link from "next/link";

import TagBadge from "./TagBadge";
import type { Tag } from "../types/tag";

type TagLinkProps = {
  tag: Tag;
};

export default function TagLink({
  tag,
}: TagLinkProps) {
  return (
    <Link
      href={`/tags/${tag.id}`}
      className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <TagBadge tag={tag} />
    </Link>
  );
}