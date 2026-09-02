import { NextResponse } from "next/server";
import { otpStore } from "../../../../lib/otpStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.toString()?.trim()?.toLowerCase();
    const otp = body?.otp?.toString()?.trim();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const storedOTP = otpStore.get(email);
    if (!storedOTP || storedOTP.otp !== otp) {
      return NextResponse.json({ error: "OTP incorrect or expired." }, { status: 400 });
    }

    return NextResponse.json({ message: "OTP verified." });
  } catch (error) {
    console.error("verify-otp error", error);
    return NextResponse.json({ error: "OTP verification failed." }, { status: 500 });
  }
}
