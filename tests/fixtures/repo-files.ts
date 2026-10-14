import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../..", import.meta.url));

export function repoPath(...parts: string[]): string {
  return path.join(ROOT, ...parts);
}

export function exists(...parts: string[]): boolean {
  return existsSync(repoPath(...parts));
}

export function readText(...parts: string[]): string {
  return readFileSync(repoPath(...parts), "utf8");
}

export type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  packageManager?: string;
};

export function readPackageJson(): PackageJson {
  return JSON.parse(readText("package.json")) as PackageJson;
}

export function allDependencyNames(pkg: PackageJson): string[] {
  return [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})];
}

// Lista recursiva de archivos (rutas relativas a `dir`, con "/"), sin node_modules ni .next.
export function listFiles(...parts: string[]): string[] {
  const base = repoPath(...parts);
  if (!existsSync(base)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === ".next") continue;
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else out.push(path.relative(base, full).split(path.sep).join("/"));
    }
  };
  walk(base);
  return out;
}
