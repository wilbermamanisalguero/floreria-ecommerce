// webServer de Playwright: compila una vez y levanta dos instancias de la app.
//  - E2E_APP_PORT (3000): entorno normal (DATABASE_URL real, si existe)   -> criterios 3 y 5
//  - E2E_DB_DOWN_PORT (3001): DATABASE_URL apuntando a un Postgres inalcanzable -> criterio 4
import { spawn, spawnSync } from "node:child_process";

const appPort = process.env.E2E_APP_PORT ?? "3000";
const dbDownPort = process.env.E2E_DB_DOWN_PORT ?? "3001";
const unreachable = process.env.E2E_UNREACHABLE_DATABASE_URL;
if (!unreachable) {
  console.error("[start-servers] falta E2E_UNREACHABLE_DATABASE_URL");
  process.exit(1);
}

// Reusar el mismo pnpm que lanzó `pnpm test:e2e` (sirve también con `npx pnpm@9`).
const execPath = process.env.npm_execpath;
const pnpm = (args, options) =>
  execPath && /pnpm/i.test(execPath)
    ? [process.execPath, [execPath, ...args], options]
    : ["pnpm", args, { ...options, shell: process.platform === "win32" }];

const build = spawnSync(...pnpm(["build"], { stdio: "inherit" }));
if (build.status !== 0) process.exit(build.status ?? 1);

const children = [
  spawn(...pnpm(["start"], { stdio: "inherit", env: { ...process.env, PORT: appPort } })),
  spawn(
    ...pnpm(["exec", "next", "start", "--port", dbDownPort], {
      stdio: "inherit",
      env: { ...process.env, PORT: dbDownPort, DATABASE_URL: unreachable },
    }),
  ),
];

const stopAll = (code) => {
  for (const child of children) if (child.exitCode === null) child.kill();
  process.exit(code);
};
for (const child of children) child.on("exit", (code) => stopAll(code ?? 1));
process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
