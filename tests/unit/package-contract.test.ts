// SPRINT0 §5 — contrato mínimo de package.json y criterio 10 (dependencias prohibidas).
import { describe, expect, it } from "vitest";
import { allDependencyNames, readPackageJson } from "../fixtures/repo-files";

const pkg = readPackageJson();
const scripts = pkg.scripts ?? {};

describe("package.json: scripts del contrato", () => {
  it.each(["dev", "build", "start", "lint", "typecheck", "test", "test:e2e", "db:generate", "db:migrate"])(
    "declara el script %s",
    (name) => {
      expect(scripts[name], `falta el script "${name}"`).toBeTruthy();
    },
  );

  it("typecheck es tsc --noEmit", () => {
    expect(scripts.typecheck).toMatch(/\btsc\b.*--noEmit/);
  });

  it("test corre Vitest en una pasada, sin watch", () => {
    expect(scripts.test).toMatch(/\bvitest\b/);
    expect(scripts.test).toMatch(/\bvitest\s+run\b|--run\b/);
    expect(scripts.test).not.toMatch(/--watch\b/);
  });

  it("test:e2e corre Playwright", () => {
    expect(scripts["test:e2e"]).toMatch(/\bplaywright\s+test\b/);
  });

  it("db:generate y db:migrate usan drizzle-kit", () => {
    expect(scripts["db:generate"]).toMatch(/\bdrizzle-kit\s+generate\b/);
    expect(scripts["db:migrate"]).toMatch(/\bdrizzle-kit\s+migrate\b/);
  });
});

describe("package.json: runtime y dependencias (criterio 1 y ADR-08/10)", () => {
  it("engines.node declara Node 22", () => {
    expect(pkg.engines?.node).toMatch(/\b22\b/);
  });

  it("packageManager es pnpm", () => {
    expect(pkg.packageManager).toMatch(/^pnpm@/);
  });

  it.each(["vitest", "@playwright/test", "@axe-core/playwright"])(
    "devDependencies incluye %s",
    (name) => {
      expect(Object.keys(pkg.devDependencies ?? {})).toContain(name);
    },
  );
});

describe("criterio 10: sin dependencias de historias futuras", () => {
  const prohibidas: Array<[string, RegExp]> = [
    ["stripe", /^stripe$/],
    ["@stripe/*", /^@stripe\//],
    ["next-auth", /^next-auth$/],
    ["@auth/*", /^@auth\//],
    ["@vercel/blob", /^@vercel\/blob$/],
    ["@googlemaps/*", /^@googlemaps\//],
    ["@vis.gl/react-google-maps", /^@vis\.gl\/react-google-maps$/],
  ];

  it.each(prohibidas)("no contiene %s", (_label, pattern) => {
    expect(allDependencyNames(pkg).filter((d) => pattern.test(d))).toEqual([]);
  });
});
