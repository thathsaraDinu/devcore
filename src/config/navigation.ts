export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Topics", href: "/topics" },
  { label: "Notes", href: "/notes" },
  { label: "Snippets", href: "/snippets" },
  // { label: "Resources", href: "/resources" },
  { label: "Questions", href: "/questions" },
  // { label: "Mistakes", href: "/mistakes" },
  // { label: "Review", href: "/review" },
  { label: "Tags", href: "/tags" },
];