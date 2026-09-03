"use client";

import { useState } from "react";
import { GITHUB_REPO, GITHUB_BRANCH } from "@/lib/github-repo";
import { utf8ToBase64 } from "@/lib/base64";
import {
  SUGGESTION_CATEGORIES,
  type SuggestionCategory,
  type TripSuggestions,
} from "@/lib/trip-suggestions";

const TOKEN_STORAGE_KEY = "aktieklub_gh_token";

function loadToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
}

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function TripSuggestionsBox({
  slug,
  initial,
}: {
  slug: string;
  initial: TripSuggestions;
}) {
  const [data, setData] = useState<TripSuggestions>(initial);
  const [category, setCategory] = useState<SuggestionCategory>(
    SUGGESTION_CATEGORIES[0].key
  );
  const [text, setText] = useState("");
  const [token, setToken] = useState(loadToken);
  const [rememberToken, setRememberToken] = useState(() =>
    Boolean(loadToken())
  );
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!token) {
      setStatus({
        type: "error",
        message: "Indsæt din GitHub personal access token først.",
      });
      return;
    }

    setStatus({ type: "saving" });

    if (rememberToken) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    const updated: TripSuggestions = {
      ...data,
      [category]: [...data[category], trimmed],
    };

    const path = `data/trips/${slug}.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    };

    try {
      let sha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, {
        headers,
      });
      if (getRes.ok) {
        const json = await getRes.json();
        sha = json.sha;
      } else if (getRes.status !== 404) {
        throw new Error(
          `Kunne ikke hente nuværende fil (HTTP ${getRes.status}). Tjek at tokenet har adgang til ${GITHUB_REPO}.`
        );
      }

      const content = utf8ToBase64(JSON.stringify(updated, null, 2) + "\n");

      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Tilføj forslag til ${slug}`,
          content,
          branch: GITHUB_BRANCH,
          ...(sha ? { sha } : {}),
        }),
      });

      if (!putRes.ok) {
        const body = await putRes.json().catch(() => ({}));
        throw new Error(
          body.message ||
            `Kunne ikke gemme (HTTP ${putRes.status}). Tjek tokenets rettigheder.`
        );
      }

      setData(updated);
      setText("");
      setStatus({ type: "success", message: "Forslag gemt!" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Der skete en fejl.",
      });
    }
  }

  return (
    <details className="w-full max-w-2xl rounded-lg border border-black/10 text-left dark:border-white/10">
      <summary className="cursor-pointer select-none px-4 py-3 font-medium">
        💡 Forslag til turen
      </summary>

      <div className="flex flex-col gap-4 border-t border-black/10 p-4 dark:border-white/10">
        {SUGGESTION_CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <h3 className="text-sm font-semibold">{label}</h3>
            {data[key].length > 0 ? (
              <ul className="mt-1 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-300">
                {data[key].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-neutral-400">
                Ingen forslag endnu.
              </p>
            )}
          </div>
        ))}

        <div className="border-t border-black/10 pt-4 dark:border-white/10">
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as SuggestionCategory)
              }
              className="rounded border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
            >
              {SUGGESTION_CATEGORIES.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv dit forslag..."
              className="flex-1 rounded border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={status.type === "saving"}
              className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {status.type === "saving" ? "Gemmer..." : "Tilføj"}
            </button>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-neutral-500">
              GitHub personal access token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="mt-1 w-full max-w-sm rounded border border-black/10 bg-transparent px-2 py-1.5 text-sm dark:border-white/10"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
              <input
                type="checkbox"
                checked={rememberToken}
                onChange={(e) => setRememberToken(e.target.checked)}
              />
              Husk token i denne browser (gemmes kun lokalt hos dig, sendes
              kun direkte til GitHub)
            </label>
            <p className="mt-1 max-w-lg text-xs text-neutral-400">
              Opret en token på{" "}
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                github.com/settings/tokens
              </a>{" "}
              med skrive-adgang (Contents: Read and write) til{" "}
              <code>{GITHUB_REPO}</code>.
            </p>
          </div>

          {status.type === "success" && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              {status.message}
            </p>
          )}
          {status.type === "error" && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {status.message}
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
