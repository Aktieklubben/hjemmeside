// Aktieklubbens rejser. Tilføj en ny rejse ved at tilføje et element her —
// der bliver automatisk lavet en side og et dropdown-punkt i menuen.
export type Trip = {
  slug: string;
  name: string;
  year: number;
  // Viser en pop-down på tursiden hvor medlemmer kan skrive forslag ind
  // (restauranter, klubber, sightseeing, ekstra).
  suggestions?: boolean;
};

export const trips: Trip[] = [
  { slug: "paris-2023", name: "Paris", year: 2023 },
  { slug: "sofia-2025", name: "Sofia", year: 2025 },
  { slug: "budapest-2026", name: "Budapest", year: 2026, suggestions: true },
];
