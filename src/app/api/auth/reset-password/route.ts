import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { otpStore } from "../../../../lib/otpStore";

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();
    const normalizedEmail = email?.toString().trim().toLowerCase();
    if (!normalizedEmail || !otp || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Email, OTP, and a password of at least 6 characters are required." }, { status: 400 });
    }
    const storedOTP = otpStore.get(normalizedEmail);
    if (!storedOTP || storedOTP.otp !== otp) {
      return NextResponse.json({ error: "OTP incorrect or expired." }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { password: await bcrypt.hash(newPassword, 10) },
      { new: true },
    );
    if (!user) return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    otpStore.delete(normalizedEmail);
    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("reset-password error", error);
    return NextResponse.json({ error: "Password reset failed." }, { status: 500 });
  }
}
