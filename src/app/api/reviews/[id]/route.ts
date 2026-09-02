import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Review from "../../../../models/Review";
import { errorResponse } from "../../../../lib/routeHelpers";
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { try { await dbConnect(); const review = await Review.findByIdAndDelete((await params).id); return review ? NextResponse.json({ message: "Review deleted." }) : NextResponse.json({ error: "Review not found." }, { status: 404 }); } catch (error) { return errorResponse(error, "Failed to delete review."); } }
