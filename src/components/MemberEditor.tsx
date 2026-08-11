"use client";

import { useState } from "react";
import { GITHUB_REPO, GITHUB_BRANCH } from "@/lib/github-repo";
import { utf8ToBase64 } from "@/lib/base64";
import type { Holding, Member } from "@/lib/members.server";

const TOKEN_STORAGE_KEY = "aktieklub_gh_token";

function emptyRow(): Holding {
  return {
    symbol: "",
    shares: 0,
    boughtDate: null,
    boughtPrice: null,
    soldDate: null,
    soldPrice: null,
  };
}

function loadToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
}

type Status =
  | { type: "idle" }
  | { type: "saving" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function MemberEditor({ member }: { member: Member }) {
  const [rows, setRows] = useState<Holding[]>(
    member.holdings.length > 0 ? member.holdings : [emptyRow()]
  );
  const [token, setToken] = useState(loadToken);
  const [rememberToken, setRememberToken] = useState(() => Boolean(loadToken()));
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function updateRow(index: number, patch: Partial<Holding>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  async function handleSave() {
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

    const cleanedHoldings = rows
      .filter((r) => r.symbol.trim() !== "")
      .map((r) => ({
        symbol: r.symbol.trim().toUpperCase(),
        shares: Number(r.shares) || 0,
        boughtDate: r.boughtDate || null,
        boughtPrice: r.boughtPrice != null ? Number(r.boughtPrice) : null,
        soldDate: r.soldDate || null,
        soldPrice: r.soldPrice != null ? Number(r.soldPrice) : null,
      }));

    const path = `data/members/${member.id}.json`;
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

      const updated = {
        id: member.id,
        name: member.name,
        holdings: cleanedHoldings,
      };
      const content = utf8ToBase64(JSON.stringify(updated, null, 2) + "\n");

      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Opdater portefølje for ${member.name}`,
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

      setStatus({
        type: "success",
        message:
          "Gemt! Aktie-oversigten opdateres automatisk om et par minutter, når GitHub Action'en har genberegnet performance-data.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Der skete en fejl.",
      });
    }
  }

  return (
    <div className="rounded-lg bg-neutral-50 p-4 text-sm dark:bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-1">
          <thead>
            <tr className="text-left text-xs text-neutral-500">
              <th className="px-2 font-medium">Ticker</th>
              <th className="px-2 font-medium">Antal</th>
              <th className="px-2 font-medium">Købsdato</th>
              <th className="px-2 font-medium">Købspris</th>
              <th className="px-2 font-medium">Salgsdato</th>
              <th className="px-2 font-medium">Salgspris</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="bg-white dark:bg-neutral-800">
                <td className="p-1">
                  <input
                    value={row.symbol}
                    onChange={(e) => updateRow(i, { symbol: e.target.value })}
                    placeholder="AAPL"
                    className="w-24 rounded border border-black/10 bg-transparent px-2 py-1 dark:border-white/10"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    value={row.shares}
                    onChange={(e) =>
                      updateRow(i, { shares: Number(e.target.value) })
                    }
                    className="w-20 rounded border border-black/10 bg-transparent px-2 py-1 dark:border-white/10"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="date"
                    value={row.boughtDate ?? ""}
                    onChange={(e) =>
                      updateRow(i, { boughtDate: e.target.value || null })
                    }
                    className="rounded border border-black/10 bg-transparent px-2 py-1 dark:border-white/10"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    step="any"
                    value={row.boughtPrice ?? ""}
                    onChange={(e) =>
                      updateRow(i, {
                        boughtPrice:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="w-24 rounded border border-black/10 bg-transparent px-2 py-1 dark:border-white/10"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="date"
                    value={row.soldDate ?? ""}
                    onChange={(e) =>
                      updateRow(i, { soldDate: e.target.value || null })
                    }
                    className="rounded border border-black/10 bg-transparent px-2 py-1 dark:border-white/10"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    step="any"
                    value={row.soldPrice ?? ""}
                    onChange={(e) =>
                      updateRow(i, {
                        soldPrice:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="w-24 rounded border border-black/10 bg-transparent px-2 py-1 dark:border-white/10"
                  />
                </td>
                <td className="p-1">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="rounded px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    aria-label="Fjern aktie"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-800"
      >
        + Tilføj aktie
      </button>

      <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
        <label className="block text-xs font-medium text-neutral-500">
          GitHub personal access token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          className="mt-1 w-full max-w-sm rounded border border-black/10 bg-transparent px-2 py-1.5 dark:border-white/10"
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <input
            type="checkbox"
            checked={rememberToken}
            onChange={(e) => setRememberToken(e.target.checked)}
          />
          Husk token i denne browser (gemmes kun lokalt hos dig, sendes kun
          direkte til GitHub)
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
          <code>{GITHUB_REPO}</code>. Alle med adgang til din browser kan se
          tokenet, så del ikke computeren med nogen du ikke stoler på.
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={status.type === "saving"}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {status.type === "saving" ? "Gemmer..." : "Gem ændringer"}
        </button>
        {status.type === "success" && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {status.message}
          </p>
        )}
        {status.type === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
