import path from "path";
import { mkdir, unlink } from "fs/promises";
import { v7 } from "uuid";

const UPLOAD_DIR = "uploads";

const ensureDir = async (dir: string) => {
  await mkdir(dir, { recursive: true });
}

export const saveFile = async (file: File, subDir = "") => {
  const buffer = await file.arrayBuffer();

  const ext = path.extname(file.name);
  const fileName = `${v7()}${ext}`;

  const dir = path.join(UPLOAD_DIR, subDir);
  await ensureDir(dir);

  const filePath = path.join(dir, fileName);

  await Bun.write(filePath, buffer);

  return path.join(subDir, fileName).replaceAll("\\", "/");
}

export const deleteFile = async (relativePath: string) => {
  const filePath = path.join(UPLOAD_DIR, relativePath);

  try {
    await unlink(filePath);
  } catch (err: any) { }
}
