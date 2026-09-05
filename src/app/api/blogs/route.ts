import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Blog from "../../../models/Blog";
import { errorResponse, readBody } from "../../../lib/routeHelpers";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(await Blog.find().sort({ createdAt: -1 }).lean());
  } catch (error) { return errorResponse(error, "Failed to load blogs."); }
}

export async function POST(request: Request) {
  try {
    const data = await readBody(request);
    const title = String(data.title ?? "").trim();
    const content = String(data.content ?? data.contentText ?? "").trim();
    if (!title || !content) return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    await dbConnect();
    const images = (data.images as string[] | undefined) ?? [];
    const blog = await Blog.create({ title, content, author: String(data.author ?? "Saltiam"), category: data.category, tags: data.tags ?? [], image: images[0] });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) { return errorResponse(error, "Failed to create blog."); }
}
