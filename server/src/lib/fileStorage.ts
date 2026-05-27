import { join, resolve } from "node:path";

const UPLOADS_ROOT = resolve(join(process.cwd(), "uploads"));

// Minimal Bun runtime interface to avoid global type conflicts
const bunRuntime = (globalThis as Record<string, unknown>).Bun as {
  write(path: string, data: Uint8Array): Promise<number>;
  file(path: string): {
    exists(): Promise<boolean>;
    type: string;
    stream(): ReadableStream<Uint8Array>;
  } & Blob;
};

function normalizeSlashes(p: string): string {
  return p.replace(/\\/g, "/");
}

export function getUploadPath(relativePath: string): string {
  return resolve(join(UPLOADS_ROOT, relativePath));
}

export function isPathSafe(filepath: string): boolean {
  return filepath.startsWith(UPLOADS_ROOT);
}

export async function saveUpload(
  file: File,
  subDir: string,
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const relativePath = normalizeSlashes(join(subDir, filename));
  const filepath = getUploadPath(relativePath);

  await bunRuntime.write(filepath, new Uint8Array(await file.arrayBuffer()));

  return `/uploads/${relativePath}`;
}

export async function serveUpload(
  relativePath: string,
): Promise<Response | null> {
  const filepath = getUploadPath(relativePath);

  if (!isPathSafe(filepath)) {
    return null;
  }

  const file = bunRuntime.file(filepath);
  if (!(await file.exists())) {
    return null;
  }

  return new Response(file);
}
