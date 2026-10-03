export type SearchResultType = "NOTE" | "QUESTION" | "SNIPPET";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  preview: string;
  topicPath: string[];
  updatedAt: string;
};