"use client";

import { Fragment, useState } from "react";
import MemberEditor from "@/components/MemberEditor";
import type { Member } from "@/lib/members.server";

type Changes = Record<string, number | null>;

type Row = {
  id: string;
  name: string;
  changes: Changes;
  editable?: boolean;
};

type Period = { id: string; label: string };

function formatPct(value: number | null | undefined) {
  if (value == null) return "–";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function pctClass(value: number | null | undefined) {
  if (value == null) return "text-neutral-400";
  return value > 0
    ? "text-green-600 dark:text-green-400"
    : value < 0
    ? "text-red-600 dark:text-red-400"
    : "text-neutral-500";
}

export default function PerformanceTable({
  rows,
  periods,
  members,
}: {
  rows: Row[];
  periods: Period[];
  members: Member[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const membersById = new Map(members.map((m) => [m.id, m]));

  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50 text-left dark:border-white/10 dark:bg-neutral-900">
            <th className="px-4 py-3 font-semibold">Portefølje</th>
            {periods.map((p) => (
              <th key={p.id} className="px-4 py-3 text-right font-semibold">
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const member = membersById.get(row.id);
            const isEditable = Boolean(member);
            const isOpen = expanded === row.id;
            return (
              <Fragment key={row.id}>
                <tr className="border-b border-black/5 last:border-0 dark:border-white/5">
                  <td className="px-4 py-3 font-medium">
                    {isEditable ? (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : row.id)}
                        className="flex items-center gap-1.5 hover:underline"
                        aria-expanded={isOpen}
                      >
                        <span className="text-xs text-neutral-400">
                          {isOpen ? "▾" : "▸"}
                        </span>
                        {row.name}
                      </button>
                    ) : (
                      row.name
                    )}
                  </td>
                  {periods.map((p) => (
                    <td
                      key={p.id}
                      className={`px-4 py-3 text-right tabular-nums ${pctClass(
                        row.changes[p.id]
                      )}`}
                    >
                      {formatPct(row.changes[p.id])}
                    </td>
                  ))}
                </tr>
                {isOpen && member && (
                  <tr>
                    <td colSpan={periods.length + 1} className="bg-neutral-50 p-3 dark:bg-neutral-900">
                      <MemberEditor member={member} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
