import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { dbConnect } from "../../../lib/db";
import Review from "../../../models/Review";
import User from "../../../models/User";
import Product from "../../../models/Product";
import { errorResponse } from "../../../lib/routeHelpers";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const productId = request.nextUrl.searchParams.get("productId");
    const query = productId ? { productId } : {};
    return NextResponse.json(await Review.find(query).sort({ createdAt: -1 }).lean());
  } catch (error) { return errorResponse(error, "Failed to load reviews."); }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Please sign in to add a review." }, { status: 401 });

    const data = await request.json();
    const rating = Number(data.rating);
    const comment = String(data.comment ?? "").trim();
    if (!data.productId || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "A product, rating, and comment are required." }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email.toLowerCase() });
    const product = await Product.findById(data.productId);
    if (!user || !product) return NextResponse.json({ error: "User or product was not found." }, { status: 404 });

    const review = await Review.create({ productId: product._id, userId: user._id, userName: user.name, rating, comment });
    return NextResponse.json(review, { status: 201 });
  } catch (error) { return errorResponse(error, "Failed to save review."); }
}
