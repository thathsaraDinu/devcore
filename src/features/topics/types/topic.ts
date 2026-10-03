export type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  createdByUserId: string | null;
  sortOrder: number;
};

export type TopicNode = Topic & {
  children: TopicNode[];
};