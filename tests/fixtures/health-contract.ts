// Contrato de GET /api/health tal como lo fija SPRINT0.md §5 (criterios 3 y 4).
export const HEALTH_PATH = "/api/health";

export const HEALTH_OK = { status: 200, body: '{"status":"ok","db":"ok"}' } as const;
export const HEALTH_DB_DOWN = { status: 503, body: '{"status":"error","db":"error"}' } as const;

// Postgres inalcanzable a propósito (puerto 1 en loopback: conexión rechazada al instante).
// No son credenciales reales: solo sirve para provocar el criterio 4.
export const UNREACHABLE_DATABASE_URL = "postgresql://tester:tester@127.0.0.1:1/inalcanzable";

// Puertos de las dos instancias que levanta Playwright (tests/fixtures/start-servers.mjs).
export const APP_PORT = 3000;
export const DB_DOWN_PORT = 3001;
