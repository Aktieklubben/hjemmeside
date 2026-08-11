# Aktieklubben

Klubbens fælles hjemmeside — forside, aktie-oversigt, dating CRM og det
kommende musikalbum. Bygget så alle i klubben kan bidrage via GitHub.

## Kør lokalt

```bash
npm install
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000).

## Sider

- **Forside** (`src/app/page.tsx`)
- **Aktie-oversigt** (`src/app/aktie-oversigt/page.tsx`) — performance-tabel
  og graf, se afsnittet nedenfor.
- **Aktiepræsentationer** (`src/app/aktiepraesentationer/`) — dropdown i
  menuen med datoer, defineret i [`src/data/presentations.ts`](src/data/presentations.ts).
- **Aktieklub rejser** (`src/app/aktieklub-rejser/`) — dropdown med Paris
  2023, Sofia 2025, Budapest 2026, defineret i
  [`src/data/trips.ts`](src/data/trips.ts).
- **Dating CRM** — Lasses separate React/Vite-app, vendoret ind under
  [`dating-crm-src/`](dating-crm-src) og bygget som en statisk undermappe,
  se afsnittet nedenfor.
- **Album** (`src/app/album/page.tsx`) — cover og tracklist, sange
  tilføjes i [`src/data/album-tracks.ts`](src/data/album-tracks.ts).

## Tilføj din portefølje til Aktie-oversigt

Se [`data/members/README.md`](data/members/README.md). Kort fortalt: læg en
JSON-fil med dine beholdninger i `data/members/`, og en GitHub Action
genberegner automatisk performance-tallene.

### Redigér din portefølje via hjemmesiden

På Aktie-oversigt kan du klikke på dit navn for at åbne en formular, hvor
du kan tilføje/fjerne aktier og sætte købs-/salgsdato og -pris. "Gem
ændringer" skriver direkte til din `data/members/<dig>.json` via GitHub's
API — det kræver at du indsætter en personlig GitHub-adgangstoken (én
gang, kan gemmes i din browser). Sådan laver du en:

1. Gå til [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
   og opret en **fine-grained personal access token**.
2. Giv den adgang til dette repo, med **Contents: Read and write**.
3. Indsæt tokenet i feltet under formularen og klik "Gem ændringer".

Tokenet gemmes kun i din egen browser (localStorage) og sendes kun direkte
til GitHubs API — det går ikke gennem nogen server. Del ikke din computer
med nogen, du ikke stoler på, mens tokenet er gemt, og slet tokenet i
GitHub-indstillingerne hvis du mister adgang til din maskine.

`NEXT_PUBLIC_GITHUB_REPO` (i `next.config.ts`/build-miljøet) skal sættes til
`Aktieklubben/<repo-navn>`, så "Gem"-knappen ved, hvor den skal skrive hen —
se [`src/lib/github-repo.ts`](src/lib/github-repo.ts).

Performance-siden er baseret på:

- `data/members/*.json` — manuelt vedligeholdte beholdninger pr. medlem.
- `scripts/fetch-performance.mjs` — henter historiske kurser fra Yahoo
  Finance (ingen API-nøgle nødvendig) og beregner ændring i dag / 7 dage /
  1 måned / 3 måneder / 6 måneder / 1 år, samt en indekseret 1-års-serie
  til grafen. Output lægges i `src/data/performance.json`, som siden læser
  direkte (ingen runtime-kald til eksterne API'er).
- `.github/workflows/update-performance.yml` — kører scriptet dagligt kl.
  06:00 UTC, samt når nogen opdaterer en fil under `data/members/`, og
  committer det opdaterede `performance.json`.

Kør scriptet manuelt med:

```bash
node scripts/fetch-performance.mjs
```

## Dating CRM

[`dating-crm-src/`](dating-crm-src) er Lasses Dating CRM (React + Vite,
data gemt i browserens `localStorage` — ingen backend). Det er sit eget
lille projekt med egen `package.json`, ikke en del af Next.js-appen.

Deploy-workflowet ([`deploy.yml`](.github/workflows/deploy.yml)) bygger den
separat og kopierer resultatet ind i `public/dating-crm/`, som Next.js så
tager med i den statiske export som en almindelig undermappe.

### Hver person har sin egen CRM

Menupunktet "Dating CRM" er en dropdown med Lasse, Mikkel, Emil, Christian
og Jacob (se [`src/data/dating-crm-users.ts`](src/data/dating-crm-users.ts)
— skal matche `USERS` i
[`dating-crm-src/src/users.js`](dating-crm-src/src/users.js), da det er to
separate apps). Hvert navn linker til `/dating-crm/index.html?user=<slug>`;
appen læser `user`-parameteren og gemmer i et namespacet `localStorage`-key
pr. person, så data ikke deles mellem jer i samme browser.
`/dating-crm/index.html` uden parameter viser en simpel vælger.

Links peger bevidst på `index.html` direkte i stedet for bare
`/dating-crm/` — `public/`-filer er statiske assets, ikke Next.js-routes,
og `next dev`s static-fil-server (i modsætning til en rigtig statisk host)
resolver ikke automatisk mappe-stier til deres `index.html`. Med det
direkte filnavn virker det ens i `next dev`, en almindelig statisk host, og
GitHub Pages.

For at tilføje en sjette person: tilføj vedkommende i **begge** lister
(samme `slug`).

Selve CRM'en har sin egen top-menu ([`dating-crm-src/src/TopNav.jsx`](dating-crm-src/src/TopNav.jsx))
der linker tilbage til Forside/Aktie-oversigt/Aktiepræsentationer/Aktieklub
rejser/Album (relative `../`-links, virker uanset base path) samt en
person-switcher, så man aldrig sidder fast inde i CRM'en.

For at teste lokalt:

```bash
npm run build:dating-crm   # bygger dating-crm-src/ og kopierer ind i public/dating-crm
npm run dev                # åbn http://localhost:3000/dating-crm/index.html
```

(`public/dating-crm/` er en genereret mappe og ligger i `.gitignore` —
den committes ikke, CI bygger den frisk hver gang.)

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` bygger og deployer siden til GitHub Pages
ved hvert push til `main`. Første gang skal Pages slås til i repoets
indstillinger: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.

Siden bruger `output: "export"` (statisk export), så den kan hostes hvor
som helst — GitHub Pages er bare det nemme, gratis valg.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, statisk export)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org) til grafen på Aktie-oversigt
