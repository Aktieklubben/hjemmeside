import Image from "next/image";
import { albumTitle, tracks } from "@/data/album-tracks";

// next/image med unoptimized:true sætter ikke selv basePath foran src (i
// modsætning til almindelige <Link>/<a> i appen) — skal gøres manuelt.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "Album · Aktieklubben",
};

export default function AlbumPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="relative h-64 w-64 overflow-hidden rounded-lg shadow-lg sm:h-80 sm:w-80">
        <Image
          src={`${BASE_PATH}/album-cover.png`}
          alt={`${albumTitle} - albumcover`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{albumTitle}</h1>
        <span className="mt-2 inline-flex items-center gap-1 rounded border border-black/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-500 dark:border-white/20">
          Parental Advisory · Explicit Content
        </span>
      </div>

      {tracks.length > 0 ? (
        <ol className="flex w-full max-w-md flex-col gap-2 text-left">
          {tracks.map((track, i) => (
            <li key={track.url}>
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
              >
                <span className="text-neutral-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{track.title}</span>
                <span className="ml-auto text-neutral-400">↗</span>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <p className="max-w-md text-neutral-600 dark:text-neutral-300">
          Tracklist kommer snart.
        </p>
      )}

      <p className="max-w-md text-xs text-neutral-400">
        Flere sange tilføjes i{" "}
        <code className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
          src/data/album-tracks.ts
        </code>
        .
      </p>
    </div>
  );
}
