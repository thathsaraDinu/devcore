type DashboardStatsProps = {
  counts: {
    notes: number;
    questions: number;
    openQuestions: number;
    snippets: number;
    topics: number;
  };
};

export default function DashboardStats({
  counts,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Notes",
      value: counts.notes,
    },
    {
      label: "Open Questions",
      value: counts.openQuestions,
    },
    {
      label: "Snippets",
      value: counts.snippets,
    },
    {
      label: "Topics",
      value: counts.topics,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-surface p-5"
        >
          <p className="text-sm text-text-muted">
            {stat.label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}