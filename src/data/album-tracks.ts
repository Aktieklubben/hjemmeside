// Aktieklubbens officielle album. Tilføj en ny sang ved at tilføje et
// element her.
export type Track = {
  title: string;
  url: string;
};

export const albumTitle = "Aktieklubben";

export const tracks: Track[] = [
  {
    title: "Fisse, Penge, Hash",
    url: "https://suno.com/song/65dc78bd-7e2d-480e-9f30-78684bdee2ec",
  },
  {
    title: "Mambo Baddie",
    url: "https://suno.com/song/512e03b9-3520-4058-b7f7-ade502b0aaf7",
  },
];
