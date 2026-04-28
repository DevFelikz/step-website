import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function looksLikeImage(buf: Buffer, mime: string): boolean {
  if (buf.length < 12) return false;
  if (mime === "image/png" && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return true;
  if (mime === "image/jpeg" && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  if (mime === "image/gif") {
    const g = buf.toString("ascii", 0, 6);
    if (g === "GIF87a" || g === "GIF89a") return true;
  }
  if (mime === "image/webp" && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return true;
  return false;
}

export async function POST(req: Request) {
  if (!(await getAdminFromCookies())) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Ingen fil" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Filen får vara max 4 MB" }, { status: 400 });
  }

  const mime = file.type;
  const ext = MIME_EXT[mime];
  if (!ext) {
    return NextResponse.json({ error: "Endast JPEG, PNG, WebP eller GIF" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(buf, mime)) {
    return NextResponse.json({ error: "Filen verkar inte vara en giltig bild" }, { status: 400 });
  }

  const name = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);

  const publicPath = `/images/uploads/${name}`;
  return NextResponse.json({ path: publicPath });
}
