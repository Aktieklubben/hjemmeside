import Link from "next/link";
import { trips } from "@/data/trips";

export const metadata = {
  title: "Aktieklub rejser · Aktieklubben",
};

export default function AktieklubRejserPage() {
  const sorted = [...trips].sort((a, b) => b.year - a.year);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Aktieklub rejser
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Klubbens rejser gennem tiden.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {sorted.map((trip) => (
          <li key={trip.slug}>
            <Link
              href={`/aktieklub-rejser/${trip.slug}`}
              className="block rounded-xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className="text-2xl">🧳</div>
              <h2 className="mt-2 text-lg font-semibold">
                {trip.name} {trip.year}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
