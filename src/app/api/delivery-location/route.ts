import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { dbConnect } from "../../../lib/db";
import User from "../../../models/User";
import { errorResponse } from "../../../lib/routeHelpers";

async function currentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  await dbConnect();
  return User.findOne({ email: session.user.email.toLowerCase() });
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Please sign in to view saved locations." }, { status: 401 });
    return NextResponse.json({ deliveryLocation: user.deliveryLocation || {} });
  } catch (error) { return errorResponse(error, "Failed to load delivery location."); }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Please sign in to save a delivery location." }, { status: 401 });
    const body = await request.json();
    const deliveryLocation = {
      country: String(body.country || "").trim(),
      postalCode: String(body.postalCode || "").trim(),
      address: String(body.address || "").trim(),
      updatedAt: new Date(),
    };
    if (!deliveryLocation.country || !deliveryLocation.address) return NextResponse.json({ error: "Country and delivery address are required." }, { status: 400 });
    user.deliveryLocation = deliveryLocation;
    await user.save();
    return NextResponse.json({ deliveryLocation });
  } catch (error) { return errorResponse(error, "Failed to save delivery location."); }
}
