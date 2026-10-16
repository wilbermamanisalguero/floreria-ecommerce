// SPRINT0 §5 — criterio 9 (ADRs transversales) y criterio 10 (cero lógica de negocio),
// en la parte comprobable sobre archivos. La revisión humana del criterio 10 sigue aparte.
import { describe, expect, it } from "vitest";
import {
  allDependencyNames,
  exists,
  listFiles,
  readPackageJson,
  readText,
} from "../fixtures/repo-files";

const deps = allDependencyNames(readPackageJson());
const srcFiles = listFiles("src");
const codeFiles = srcFiles.filter((f) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f));

// Ruta pública de un page/route del App Router: ignora grupos "(x)" y slots "@x".
function appRoutes(): string[] {
  return listFiles("src", "app")
    .filter((f) => /(^|\/)(page|route)\.(ts|tsx|js|jsx|mdx)$/.test(f))
    .filter((f) => !f.split("/").some((seg) => seg.startsWith("_")))
    .map((f) => {
      const segs = f.split("/").slice(0, -1).filter((s) => !/^\(.*\)$/.test(s) && !s.startsWith("@"));
      // Segmento dinámico "[x]" -> "<param>": el contrato fija la ruta, no el nombre del parámetro.
      return `/${segs.map((s) => (/^\[.+\]$/.test(s) ? "<param>" : s)).join("/")}`;
    })
    .sort();
}

describe("criterio 9: ADRs transversales", () => {
  it("usa App Router en src/app/ y no hay pages/", () => {
    expect(exists("src", "app")).toBe(true);
    expect(exists("pages")).toBe(false);
    expect(exists("src", "pages")).toBe(false);
  });

  it("el Route Handler de salud vive en src/app/api/health/route.ts", () => {
    expect(exists("src", "app", "api", "health", "route.ts")).toBe(true);
  });

  it("Drizzle es el único ORM", () => {
    expect(deps).toContain("drizzle-orm");
    expect(deps).toContain("drizzle-kit");
    const otros = ["prisma", "@prisma/client", "typeorm", "sequelize", "@mikro-orm/core", "objection", "mongoose"];
    expect(deps.filter((d) => otros.includes(d))).toEqual([]);
  });

  it("Tailwind y shadcn/ui inicializados (components.json)", () => {
    expect(deps).toContain("tailwindcss");
    expect(exists("components.json")).toBe(true);
  });

  it("no hay librería global de estado", () => {
    const estado = ["redux", "@reduxjs/toolkit", "react-redux", "zustand", "jotai", "recoil", "mobx", "mobx-react", "mobx-react-lite", "valtio"];
    expect(deps.filter((d) => estado.includes(d))).toEqual([]);
  });

  it(".env.example lista solo DATABASE_URL", () => {
    const keys = readText(".env.example")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => l.replace(/^export\s+/, "").split("=")[0].trim());
    expect(keys).toEqual(["DATABASE_URL"]);
  });
});

describe("criterio 7 (parte estática): configuración de migraciones", () => {
  it("drizzle.config.ts existe y lee DATABASE_URL", () => {
    expect(exists("drizzle.config.ts")).toBe(true);
    expect(readText("drizzle.config.ts")).toMatch(/DATABASE_URL/);
  });
});

// Criterio 10 acotado por CONTRATO-HU-05 v2 §E4: solo las rutas y tablas que fija un contrato
// aprobado (SPRINT0.md: / y /api/health; HU-05: /catalogo, /catalogo/<id> y productos).
const RUTAS_CONTRATADAS = ["/", "/api/health", "/catalogo", "/catalogo/<param>"];
const TABLAS_CONTRATADAS = ["productos"];

describe("criterio 10: cero lógica de negocio fuera de contrato (CONTRATO-HU-05 v2 §E4)", () => {
  it("solo existen las rutas que fija un contrato aprobado", () => {
    expect(appRoutes()).toEqual([...RUTAS_CONTRATADAS].sort());
  });

  it("el esquema Drizzle solo define las tablas que fija un contrato aprobado", () => {
    const tablas = codeFiles.flatMap((f) =>
      [...readText("src", f).matchAll(/\bpgTable\s*\(\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]),
    );
    expect([...new Set(tablas)].sort()).toEqual(TABLAS_CONTRATADAS);
  });

  it("las migraciones de drizzle/ solo crean las tablas que fija un contrato aprobado", () => {
    const tablas = listFiles("drizzle")
      .filter((f) => f.endsWith(".sql"))
      .flatMap((f) =>
        [...readText("drizzle", f).matchAll(/create table(?: if not exists)?\s+(?:"?\w+"?\.)?"?(\w+)"?/gi)].map(
          (m) => m[1],
        ),
      );
    expect([...new Set(tablas)].sort()).toEqual(TABLAS_CONTRATADAS);
  });

  it("no hay Server Actions ('use server')", () => {
    const conActions = codeFiles.filter((f) => /^\s*["']use server["']/m.test(readText("src", f)));
    expect(conActions).toEqual([]);
  });
});
