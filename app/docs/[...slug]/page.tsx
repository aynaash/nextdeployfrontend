import { redirect } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function DocCatchallPage() {
  // Subpages are intentionally disabled while hand-written docs are in
  // progress. Send everything to the auto-generated overview at /docs.
  redirect("/docs");
}
