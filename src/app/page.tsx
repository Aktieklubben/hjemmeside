import Link from "next/link";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const CARDS = [
  {
    href: "/aktie-oversigt",
    title: "Aktie-oversigt",
    description:
      "Se hvordan alles porteføljer klarer sig i dag, over 7 dage, 1 måned, 3 måneder, 6 måneder og 1 år — og sammenlign med S&P 500 og OMXC25.",
    emoji: "📊",
  },
  {
    // Statisk fil under public/, ikke en Next.js-route — se NavBar.tsx.
    href: `${BASE_PATH}/dating-crm/index.html`,
    title: "Dating CRM",
    description: "Lasses dating CRM, samlet ét sted med resten af klubben.",
    emoji: "💌",
    external: true,
  },
  {
    href: "/album",
    title: "Album",
    description: "Aktieklubbens officielle musikalbum. Mere info på vej.",
    emoji: "🎵",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Velkommen til Aktieklubben
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
          Det fælles samlingspunkt for klubbens porteføljer, projekter og
          andet skrammel. Siden er open source — alle i klubben kan redigere
          den via GitHub.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) =>
          card.external ? (
            <a
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className="text-3xl">{card.emoji}</div>
              <h2 className="mt-3 text-lg font-semibold group-hover:underline">
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {card.description}
              </p>
            </a>
          ) : (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-black/10 p-6 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className="text-3xl">{card.emoji}</div>
              <h2 className="mt-3 text-lg font-semibold group-hover:underline">
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {card.description}
              </p>
            </Link>
          )
        )}
      </section>

      <section className="rounded-xl bg-neutral-100 p-6 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Vil du redigere siden?
        </h2>
        <p className="mt-2">
          Hele hjemmesiden ligger i klubbens GitHub-organisation. Klon
          repoet, lav dine ændringer, og opret en pull request — eller læg
          din portefølje ind under{" "}
          <code className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
            data/members/
          </code>
          . Se README i repoet for detaljer.
        </p>
      </section>
    </div>
  );
}
