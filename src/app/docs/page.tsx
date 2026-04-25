import { redirect } from "next/navigation";
import { DEFAULT_DOC_SLUG } from "@/lib/docs/nav";

export default function DocsIndex() {
  redirect(`/docs/${DEFAULT_DOC_SLUG}`);
}
