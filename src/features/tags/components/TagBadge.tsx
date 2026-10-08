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

      {removable && onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
          className="ml-0.5 shrink-0 rounded-sm p-0.5 text-text-muted transition-colors hover:bg-black/10 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Remove ${tag.name} tag`}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3 w-3"
            aria-hidden="true"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
