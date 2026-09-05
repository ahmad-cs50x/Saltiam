import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { otpStore } from "../../../../lib/otpStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.toString()?.trim()?.toLowerCase();
    const purpose = body?.purpose || "register";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await dbConnect();
    const existingUser = await User.findOne({ email });

    if (purpose === "register" && existingUser) {
      return NextResponse.json({ error: "Email already exists. Please sign in instead." }, { status: 400 });
    }

    if (purpose === "reset" && !existingUser) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Saltiam <${process.env.EMAIL_USER}>`,
      to: email,
      subject: purpose === "reset" ? "Reset your Saltiam password" : "Verify your Saltiam account",
      text: `Your Saltiam verification code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your Saltiam verification code is:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p><p>This code expires in 10 minutes.</p>`,
    });

    otpStore.set(email, otp, 10 * 60 * 1000);

    return NextResponse.json({ message: "OTP has been sent to your email address." });
  } catch (error) {
    console.error("send-otp error", error);
    if ((error as { code?: string }).code === "EAUTH") {
      return NextResponse.json(
        { error: "Gmail rejected the configured app password. Generate a new Google App Password and update EMAIL_PASS in .env.local." },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
