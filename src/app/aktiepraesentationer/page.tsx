import Link from "next/link";
import { presentations } from "@/data/presentations";

export const metadata = {
  title: "Aktiepræsentationer · Aktieklubben",
};

export default function AktiepraesentationerPage() {
  const sorted = [...presentations].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Aktiepræsentationer
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Datoer for klubbens aktiepræsentationer. Nye datoer tilføjes i{" "}
          <code className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
            src/data/presentations.ts
          </code>
          .
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {sorted.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/aktiepraesentationer/${p.slug}`}
              className="block rounded-xl border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <span className="font-semibold">{p.date}</span>
              {p.title && (
                <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                  {p.title}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
