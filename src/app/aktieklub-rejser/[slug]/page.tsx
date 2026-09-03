import { notFound } from "next/navigation";
import { trips } from "@/data/trips";
import { getTripSuggestions } from "@/lib/trip-suggestions.server";
import TripSuggestionsBox from "@/components/TripSuggestions";

export const dynamicParams = false;

export function generateStaticParams() {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = trips.find((t) => t.slug === slug);
  return { title: trip ? `${trip.name} ${trip.year} · Aktieklubben` : "Rejse" };
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = trips.find((t) => t.slug === slug);
  if (!trip) notFound();

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="text-5xl">🧳</div>
      <h1 className="text-3xl font-bold tracking-tight">
        {trip.name} {trip.year}
      </h1>
      <p className="max-w-md text-neutral-600 dark:text-neutral-300">
        Billeder, historier og andre minder fra turen kommer her. Læg dem
        ind i{" "}
        <code className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
          src/app/aktieklub-rejser/{trip.slug}/page.tsx
        </code>
        .
      </p>

      {trip.suggestions && (
        <TripSuggestionsBox
          slug={trip.slug}
          initial={getTripSuggestions(trip.slug)}
        />
      )}
    </div>
  );
}
