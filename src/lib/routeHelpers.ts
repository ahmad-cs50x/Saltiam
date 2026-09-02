import { NextResponse } from "next/server";

export async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) return request.json();

  const formData = await request.formData();
  const data: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!value.size) continue;
      const buffer = Buffer.from(await value.arrayBuffer());
      const image = `data:${value.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;
      const images = (data.images as string[] | undefined) ?? [];
      images.push(image);
      data.images = images;
    } else {
      data[key] = value;
    }
  }
  return data;
}

export function errorResponse(error: unknown, fallback: string) {
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
