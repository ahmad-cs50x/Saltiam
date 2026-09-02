import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import User from "../../../models/User";
import { errorResponse } from "../../../lib/routeHelpers";

const SUPER_USER_EMAIL = "ranaahmadranaahmad741@gmail.com";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    return NextResponse.json(users.map((user) => ({ ...user, role: user.email === SUPER_USER_EMAIL ? "super" : user.role || "normal" })));
  } catch (error) { return errorResponse(error, "Failed to load users."); }
}
