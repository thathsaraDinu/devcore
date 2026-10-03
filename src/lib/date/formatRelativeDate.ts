export function formatRelativeDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const targetDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffInDays = Math.round(
    (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 1) {
    return "yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);

    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);

    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(diffInDays / 365);

  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
