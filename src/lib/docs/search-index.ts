import { docsNav, flattenNav } from "./nav";
import { docPages } from "./pages";

export type SearchResult = {
  slug: string;
  title: string;
  section: string;
  description?: string;
  heading?: { id: string; text: string };
  score: number;
};

type IndexEntry = {
  slug: string;
  title: string;
  titleLower: string;
  section: string;
  sectionLower: string;
  description: string;
  descriptionLower: string;
  headings: { id: string; text: string; textLower: string; level: number }[];
};

function buildIndex(): IndexEntry[] {
  return flattenNav().map((item) => {
    const page = docPages[item.slug];
    return {
      slug: item.slug,
      title: item.title,
      titleLower: item.title.toLowerCase(),
      section: page?.section ?? "",
      sectionLower: (page?.section ?? "").toLowerCase(),
      description: item.description ?? page?.description ?? "",
      descriptionLower: (item.description ?? page?.description ?? "").toLowerCase(),
      headings:
        page?.headings?.map((h) => ({
          id: h.id,
          text: h.text,
          textLower: h.text.toLowerCase(),
          level: h.level,
        })) ?? [],
    };
  });
}

// Built once per module load (client-side). Static data, safe to cache.
let cachedIndex: IndexEntry[] | null = null;
function getIndex(): IndexEntry[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

/**
 * Simple weighted substring search.
 * Weights (higher = more relevant): title > section > heading > description.
 * A title prefix match outweighs a substring match.
 */
export function searchDocs(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];
  const index = getIndex();

  for (const entry of index) {
    let topScore = 0;
    let topHeading: SearchResult["heading"];

    if (entry.titleLower.startsWith(q)) topScore = Math.max(topScore, 100);
    else if (entry.titleLower.includes(q)) topScore = Math.max(topScore, 70);

    if (entry.sectionLower.includes(q)) topScore = Math.max(topScore, 40);

    for (const h of entry.headings) {
      if (h.textLower.includes(q)) {
        const hScore = h.textLower.startsWith(q) ? 55 : 35;
        if (hScore > topScore) {
          topScore = hScore;
          topHeading = { id: h.id, text: h.text };
        }
      }
    }

    if (entry.descriptionLower.includes(q)) {
      topScore = Math.max(topScore, 15);
    }

    if (topScore > 0) {
      results.push({
        slug: entry.slug,
        title: entry.title,
        section: entry.section,
        description: entry.description || undefined,
        heading: topHeading,
        score: topScore,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function groupBySection(results: SearchResult[]): Array<{
  section: string;
  results: SearchResult[];
}> {
  const order = docsNav.map((s) => s.label);
  const map = new Map<string, SearchResult[]>();
  for (const r of results) {
    if (!map.has(r.section)) map.set(r.section, []);
    map.get(r.section)!.push(r);
  }
  return order
    .filter((label) => map.has(label))
    .map((label) => ({ section: label, results: map.get(label)! }));
}
