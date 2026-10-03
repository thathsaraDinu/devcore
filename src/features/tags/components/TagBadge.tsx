import { getTagColor } from "../utils/getTagColor";
import type { Tag } from "../types/tag";

type TagBadgeProps = {
  tag: Tag;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
};

export default function TagBadge({
  tag,
  removable = false,
  onRemove,
  disabled = false,
}: TagBadgeProps) {
  const color = getTagColor(tag.id);

  return (
    <span
      style={{
        color: color.text,
        borderColor: color.border,
        backgroundColor: color.background,
      }}
      className="inline-flex min-w-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium"
    >
      <span
        aria-hidden="true"
        style={{ backgroundColor: color.dot }}
        className="h-1.5 w-1.5 shrink-0 rounded-full"
      />

      <span className="truncate">#{tag.name}</span>
    </span>
  );
}
