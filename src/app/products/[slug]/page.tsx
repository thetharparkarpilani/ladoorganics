import { redirect } from "next/navigation";

export default async function LegacyProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  redirect(`/store/${encodeURIComponent(slug)}`);
}
