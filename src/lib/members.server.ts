import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type Holding = {
  symbol: string;
  shares: number;
  boughtDate: string | null;
  boughtPrice: number | null;
  soldDate: string | null;
  soldPrice: number | null;
};

export type Member = {
  id: string;
  name: string;
  holdings: Holding[];
};

// Læses kun på build-tidspunktet (server component / static export).
export function getMembers(): Member[] {
  const dir = path.join(process.cwd(), "data", "members");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = JSON.parse(readFileSync(path.join(dir, file), "utf-8"));
    return {
      id: raw.id,
      name: raw.name,
      holdings: (raw.holdings ?? []).map((h: Partial<Holding>) => ({
        symbol: h.symbol,
        shares: h.shares,
        boughtDate: h.boughtDate ?? null,
        boughtPrice: h.boughtPrice ?? null,
        soldDate: h.soldDate ?? null,
        soldPrice: h.soldPrice ?? null,
      })),
    };
  });
}
