import type { ReactNode } from "react";

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type DocPage = {
  slug: string;
  section: string;
  title: string;
  description?: string;
  content: () => ReactNode;
  headings?: DocHeading[];
  updatedAt?: string;
  tags?: string[];
};

export type DocNavItem = {
  title: string;
  slug: string;
  description?: string;
};

export type DocNavSection = {
  label: string;
  items: DocNavItem[];
};
