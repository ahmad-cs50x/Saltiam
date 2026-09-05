import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { otpStore } from "../../../../lib/otpStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.toString()?.trim()?.toLowerCase();
    const password = body?.password?.toString();
    const confirmPassword = body?.confirmPassword?.toString();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Email and passwords are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    otpStore.delete(email);

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("change-password error", error);
    return NextResponse.json({ error: "Password change failed." }, { status: 500 });
  }
}
