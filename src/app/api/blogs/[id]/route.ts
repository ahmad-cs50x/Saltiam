import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Blog from "../../../../models/Blog";
import { errorResponse, readBody } from "../../../../lib/routeHelpers";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const blog = await Blog.findById((await params).id).lean(); return blog ? NextResponse.json(blog) : NextResponse.json({ error: "Blog not found." }, { status: 404 }); } catch (error) { return errorResponse(error, "Failed to load blog."); }
}
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const data = await readBody(request); const update: Record<string, unknown> = { ...data, updatedAt: new Date() }; if (data.contentText) update.content = data.contentText; const images = data.images as string[] | undefined; if (images?.[0]) update.image = images[0]; await dbConnect(); const blog = await Blog.findByIdAndUpdate((await params).id, update, { new: true, runValidators: true }); return blog ? NextResponse.json(blog) : NextResponse.json({ error: "Blog not found." }, { status: 404 }); } catch (error) { return errorResponse(error, "Failed to update blog."); }
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await dbConnect(); const blog = await Blog.findByIdAndDelete((await params).id); return blog ? NextResponse.json({ message: "Blog deleted." }) : NextResponse.json({ error: "Blog not found." }, { status: 404 }); } catch (error) { return errorResponse(error, "Failed to delete blog."); }
}
