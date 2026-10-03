import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-sm font-medium text-sky-100">{eyebrow}</p>
        )}

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-blue">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-text-secondary">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
