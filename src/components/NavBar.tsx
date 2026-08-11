"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trips } from "@/data/trips";
import { presentations } from "@/data/presentations";
import { datingCrmUsers } from "@/data/dating-crm-users";

type NavChild = {
  href: string;
  label: string;
  // Dating CRM'en er en separat statisk app (ikke en Next.js-route), så
  // dens links skal være rigtige <a>-links (fuld side-load), ikke next/link.
  external?: boolean;
};
type NavLink = {
  href: string;
  label: string;
  children?: NavChild[];
  external?: boolean;
};

const sortedPresentations = [...presentations].sort((a, b) =>
  b.date.localeCompare(a.date)
);
const sortedTrips = [...trips].sort((a, b) => b.year - a.year);

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const LINKS: NavLink[] = [
  { href: "/", label: "Forside" },
  { href: "/aktie-oversigt", label: "Aktie-oversigt" },
  {
    href: "/aktiepraesentationer",
    label: "Aktiepræsentationer",
    children: sortedPresentations.map((p) => ({
      href: `/aktiepraesentationer/${p.slug}`,
      label: p.date,
    })),
  },
  {
    href: "/aktieklub-rejser",
    label: "Aktieklub rejser",
    children: sortedTrips.map((t) => ({
      href: `/aktieklub-rejser/${t.slug}`,
      label: `${t.name} ${t.year}`,
    })),
  },
  {
    // Peger direkte på index.html (ikke bare "/dating-crm/") fordi den er en
    // statisk fil under public/, ikke en Next.js-route — "next dev"s
    // static-fil-server (i modsætning til en rigtig statisk host) resolver
    // ikke automatisk til index.html for en mappe-sti, så det direkte
    // filnavn virker ens overalt: next dev, en almindelig statisk host, og
    // GitHub Pages.
    href: `${BASE_PATH}/dating-crm/index.html`,
    label: "Dating CRM",
    external: true,
    children: datingCrmUsers.map((u) => ({
      href: `${BASE_PATH}/dating-crm/index.html?user=${u.slug}`,
      label: u.name,
      external: true,
    })),
  },
  { href: "/album", label: "Album" },
];

function isActive(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href) ?? false;
}

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-neutral-950/80"
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          📈 Aktieklubben
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 sm:hidden"
          aria-label="Åbn menu"
          aria-expanded={open}
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>

        <ul className="hidden gap-1 sm:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            const isOpen = openDropdown === link.href;
            return (
              <li key={link.href} className="relative">
                {link.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : link.href)
                      }
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {link.label}
                      <span className="text-xs">▾</span>
                    </button>
                    {isOpen && (
                      <ul className="absolute left-0 top-full mt-1 min-w-[10rem] rounded-md border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-neutral-900">
                        {link.children.length === 0 ? (
                          <li className="px-3 py-2 text-sm text-neutral-400">
                            Kommer snart
                          </li>
                        ) : (
                          link.children.map((child) =>
                            child.external ? (
                              <li key={child.href}>
                                <a
                                  href={child.href}
                                  className="block px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                  {child.label}
                                </a>
                              </li>
                            ) : (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="block px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            )
                          )
                        )}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-black/10 px-4 py-2 sm:hidden dark:border-white/10">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
                {link.children && link.children.length > 0 && (
                  <ul className="ml-3 flex flex-col gap-1 border-l border-black/10 pl-3 dark:border-white/10">
                    {link.children.map((child) =>
                      child.external ? (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-3 py-1.5 text-sm text-neutral-500 dark:text-neutral-400"
                          >
                            {child.label}
                          </a>
                        </li>
                      ) : (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-3 py-1.5 text-sm text-neutral-500 dark:text-neutral-400"
                          >
                            {child.label}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
