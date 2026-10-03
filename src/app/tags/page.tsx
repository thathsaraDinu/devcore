import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import CreateTagButton from "@/features/tags/components/CreateTagButton";
import TagsBrowser from "@/features/tags/components/TagsBrowser";
import { getTags } from "@/server/tags/queries";

export const metadata = {
  title: "Tags",
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <AppShell>
      <div className="px-6 py-8 lg:px-10">
        <PageHeader
          eyebrow="Organization"
          title="Tags"
          description="Browse the labels you use across Notes, Questions, and Snippets."
          action={<CreateTagButton />}
        />

        <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
          <span>
            {tags.length} {tags.length === 1 ? "tag" : "tags"}
          </span>

          <span aria-hidden="true">·</span>

          <span>Shared across your knowledge</span>
        </div>

        <section className="mt-10">
          <TagsBrowser tags={tags} />
        </section>
      </div>
    </AppShell>
  );
}