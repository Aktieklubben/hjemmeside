// Delt mellem server (læsning fra fil) og klient (skrivning via GitHub API).
// Ingen node:fs her, så filen er sikker at importere fra "use client"-komponenter.
export type SuggestionCategory =
  | "restauranter"
  | "klubber"
  | "sightseeing"
  | "ekstra";

export type TripSuggestions = Record<SuggestionCategory, string[]>;

export const SUGGESTION_CATEGORIES: {
  key: SuggestionCategory;
  label: string;
}[] = [
  { key: "restauranter", label: "Restauranter" },
  { key: "klubber", label: "Klubber" },
  { key: "sightseeing", label: "Sightseeing" },
  { key: "ekstra", label: "Ekstra" },
];

export function emptyTripSuggestions(): TripSuggestions {
  return { restauranter: [], klubber: [], sightseeing: [], ekstra: [] };
}
