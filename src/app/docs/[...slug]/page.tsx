import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDocSlugs, getDocPage } from "@/lib/docs/pages";
import { DocPageLayout } from "@/components/docs/doc-page-layout";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const page = getDocPage(slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/docs/${slug}`,
    },
  };
}

export default async function DocSlugPage({ params }: PageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const page = getDocPage(slug);
  if (!page) notFound();
  return <DocPageLayout page={page} />;
}
