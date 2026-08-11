// Skal matche USERS i dating-crm-src/src/users.js — begge lister holdes
// manuelt i sync, da det er to separate apps.
export type DatingCrmUser = { slug: string; name: string };

export const datingCrmUsers: DatingCrmUser[] = [
  { slug: "lasse", name: "Lasse" },
  { slug: "mikkel", name: "Mikkel" },
  { slug: "emil", name: "Emil" },
  { slug: "christian", name: "Christian" },
  { slug: "jacob", name: "Jacob" },
];
