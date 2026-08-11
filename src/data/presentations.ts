// Aktiepræsentationer. Tilføj en ny præsentation ved at tilføje et element
// her — der bliver automatisk lavet en side og et dropdown-punkt i menuen.
// `slug` skal være unikt og URL-venligt (ingen mellemrum/æøå).
export type Presentation = {
  slug: string;
  date: string; // YYYY-MM-DD
  title?: string;
};

export const presentations: Presentation[] = [
  { slug: "eksempel-2026-08-15", date: "2026-08-15", title: "Eksempel-præsentation" },
];
