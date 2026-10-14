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
      return `/${segs.join("/")}`;
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

describe("criterio 10: cero lógica de negocio", () => {
  it("solo existen las rutas / y /api/health", () => {
    expect(appRoutes()).toEqual(["/", "/api/health"]);
  });

  it("el esquema Drizzle no define tablas", () => {
    const conTablas = codeFiles.filter((f) => /\bpgTable\s*\(/.test(readText("src", f)));
    expect(conTablas).toEqual([]);
  });

  it("no hay Server Actions ('use server')", () => {
    const conActions = codeFiles.filter((f) => /^\s*["']use server["']/m.test(readText("src", f)));
    expect(conActions).toEqual([]);
  });
});
