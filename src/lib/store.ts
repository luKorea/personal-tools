import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const full = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  const full = path.join(DATA_DIR, file);
  const tmp = `${full}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, full);
}

export type ShortLink = {
  code: string;
  url: string;
  createdAt: string;
  hits: number;
};

export type Paste = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string | null;
};

type ShortLinkDb = Record<string, ShortLink>;
type PasteDb = Record<string, Paste>;

export async function listShortLinks(): Promise<ShortLink[]> {
  const db = await readJson<ShortLinkDb>("short-links.json", {});
  return Object.values(db).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getShortLink(code: string): Promise<ShortLink | null> {
  const db = await readJson<ShortLinkDb>("short-links.json", {});
  return db[code] ?? null;
}

export async function createShortLink(url: string, code?: string): Promise<ShortLink> {
  const db = await readJson<ShortLinkDb>("short-links.json", {});
  let finalCode = (code || "").trim();
  if (finalCode) {
    if (!/^[a-zA-Z0-9_-]{2,32}$/.test(finalCode)) {
      throw new Error("自定义短码仅支持 2-32 位字母、数字、下划线或短横线");
    }
    if (db[finalCode]) throw new Error("这个短码已经被占用了");
  } else {
    const { shortId } = await import("./ids");
    do {
      finalCode = shortId(7);
    } while (db[finalCode]);
  }
  const item: ShortLink = {
    code: finalCode,
    url,
    createdAt: new Date().toISOString(),
    hits: 0,
  };
  db[finalCode] = item;
  await writeJson("short-links.json", db);
  return item;
}

export async function hitShortLink(code: string): Promise<ShortLink | null> {
  const db = await readJson<ShortLinkDb>("short-links.json", {});
  const item = db[code];
  if (!item) return null;
  item.hits += 1;
  db[code] = item;
  await writeJson("short-links.json", db);
  return item;
}

export async function getPaste(id: string): Promise<Paste | null> {
  const db = await readJson<PasteDb>("pastes.json", {});
  const item = db[id];
  if (!item) return null;
  if (item.expiresAt && new Date(item.expiresAt).getTime() < Date.now()) {
    delete db[id];
    await writeJson("pastes.json", db);
    return null;
  }
  return item;
}

export async function createPaste(input: {
  title?: string;
  content: string;
  expireHours?: number | null;
}): Promise<Paste> {
  const db = await readJson<PasteDb>("pastes.json", {});
  const { shortId } = await import("./ids");
  let id = shortId(10);
  while (db[id]) id = shortId(10);
  const hours = input.expireHours;
  const item: Paste = {
    id,
    title: (input.title || "").trim() || "未命名便签",
    content: input.content,
    createdAt: new Date().toISOString(),
    expiresAt:
      hours && hours > 0
        ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
        : null,
  };
  db[id] = item;
  await writeJson("pastes.json", db);
  return item;
}
