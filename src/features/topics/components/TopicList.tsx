import type { Topic } from "../types/topic";
import TopicTree from "./TopicTree";

type TopicListProps = {
  topics: Topic[];
};

export default function TopicList({
  topics,
}: TopicListProps) {
  return <TopicTree topics={topics} />;
}