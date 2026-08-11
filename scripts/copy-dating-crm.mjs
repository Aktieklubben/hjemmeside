#!/usr/bin/env node
// Kopiérer det byggede Dating CRM (Vite/React, se dating-crm-src/) ind i
// public/dating-crm/, så Next.js' statiske export tager den med som en
// almindelig undermappe. Kør efter `npm run build` i dating-crm-src/.

import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "dating-crm-src", "dist");
const DEST = path.join(ROOT, "public", "dating-crm");

if (!existsSync(SRC)) {
  console.error(
    `Mangler ${SRC} — kør "npm run build" i dating-crm-src/ først (eller "npm run build:dating-crm" fra roden).`
  );
  process.exit(1);
}

rmSync(DEST, { recursive: true, force: true });
cpSync(SRC, DEST, { recursive: true });
console.log(`Kopierede ${SRC} -> ${DEST}`);
