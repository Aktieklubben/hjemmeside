import { notFound } from "next/navigation";
import { presentations } from "@/data/presentations";

export const dynamicParams = false;

export function generateStaticParams() {
  return presentations.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const presentation = presentations.find((p) => p.slug === slug);
  return {
    title: presentation
      ? `${presentation.date} · Aktiepræsentationer · Aktieklubben`
      : "Aktiepræsentation",
  };
}

export default async function PresentationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const presentation = presentations.find((p) => p.slug === slug);
  if (!presentation) notFound();

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="text-5xl">📽️</div>
      <h1 className="text-3xl font-bold tracking-tight">
        {presentation.title ?? "Aktiepræsentation"}
      </h1>
      <p className="text-neutral-500">{presentation.date}</p>
      <p className="max-w-md text-neutral-600 dark:text-neutral-300">
        Indholdet fra præsentationen kommer her. Læg det ind i{" "}
        <code className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
          src/app/aktiepraesentationer/{presentation.slug}/page.tsx
        </code>
        .
      </p>
    </div>
  );
}
