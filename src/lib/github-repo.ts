// Sæt NEXT_PUBLIC_GITHUB_REPO til "Aktieklubben/<repo-navn>", når repoet er
// oprettet, så "Gem"-knappen på Aktie-oversigt skriver til det rigtige sted.
export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO || "Aktieklubben/aktieklub-website";
export const GITHUB_BRANCH = "main";
