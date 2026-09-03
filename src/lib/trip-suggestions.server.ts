import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  emptyTripSuggestions,
  type SuggestionCategory,
  type TripSuggestions,
} from "./trip-suggestions";

// Læses kun på build-tidspunktet (server component / static export).
export function getTripSuggestions(slug: string): TripSuggestions {
  const file = path.join(process.cwd(), "data", "trips", `${slug}.json`);
  const base = emptyTripSuggestions();
  if (!existsSync(file)) return base;

  const raw = JSON.parse(readFileSync(file, "utf-8"));
  for (const key of Object.keys(base) as SuggestionCategory[]) {
    base[key] = Array.isArray(raw[key])
      ? raw[key].filter((s: unknown): s is string => typeof s === "string")
      : [];
  }
  return base;
}
