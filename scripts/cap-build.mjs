// Capacitor static-export build.
//
// Next.js `output: 'export'` cannot build dynamic API route handlers or
// middleware (they use `cookies()`), and those only ever run on the remote
// backend anyway. This script temporarily moves `src/app/api` and
// `src/middleware.ts` out of the tree, runs the export build, and ALWAYS
// restores them (even on failure / Ctrl-C).
//
// The absolute backend origin is injected as NEXT_PUBLIC_API_BASE_URL from
// CAP_API_BASE_URL (or the --base flag), so the packaged app calls the live
// server instead of relative same-origin paths.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = process.cwd();
const HIDDEN = join(ROOT, ".cap-hidden");

/** Files/dirs to move aside during the export build, then restore. */
const MOVES = [
  { from: join(ROOT, "src", "app", "api"), to: join(HIDDEN, "api") },
  { from: join(ROOT, "src", "middleware.ts"), to: join(HIDDEN, "middleware.ts") },
];

/** Minimal .env reader — only to pick up CAP_API_BASE_URL if not already set. */
function readEnvVar(key) {
  if (process.env[key]) return process.env[key];
  for (const file of [".env.local", ".env"]) {
    const p = join(ROOT, file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[1] === key) return m[2].replace(/^["']|["']$/g, "");
    }
  }
  return undefined;
}

import { cpSync, rmSync } from "node:fs";

function move(from, to) {
  if (!existsSync(from)) return false;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  rmSync(from, { recursive: true, force: true });
  return true;
}

function restore() {
  for (const { from, to } of MOVES) {
    if (existsSync(to)) {
      mkdirSync(dirname(from), { recursive: true });
      cpSync(to, from, { recursive: true });
      rmSync(to, { recursive: true, force: true });
    }
  }
}

// Resolve --base flag or CAP_API_BASE_URL.
const baseFlag = process.argv.find((a) => a.startsWith("--base="));
const baseUrl = (baseFlag ? baseFlag.split("=")[1] : readEnvVar("CAP_API_BASE_URL")) ?? "";

if (!baseUrl) {
  console.warn(
    "\n⚠  No CAP_API_BASE_URL set — the app will use relative URLs and cannot reach the backend.\n" +
      "   Set CAP_API_BASE_URL in .env (e.g. https://ktu.one) or pass --base=https://...\n",
  );
} else {
  console.log(`\n▶ Capacitor build → API base: ${baseUrl}\n`);
}

// Restore on unexpected termination.
const onSignal = () => {
  restore();
  process.exit(1);
};
process.on("SIGINT", onSignal);
process.on("SIGTERM", onSignal);

let moved = [];
try {
  moved = MOVES.filter(({ from, to }) => move(from, to));

  const env = {
    ...process.env,
    BUILD_TARGET: "capacitor",
    NEXT_PUBLIC_API_BASE_URL: baseUrl,
  };

  const result = spawnSync("npx", ["--no-install", "next", "build"], {
    stdio: "inherit",
    env,
    shell: true,
  });

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
} finally {
  restore();
  console.log("\n✔ Restored src/app/api and src/middleware.ts\n");
}
