import { ConnectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(18, "Password must not exceed 18 characters"),
  fname: z
    .string()
    .min(1, "First name is required"),
  lname: z
    .string()
    .optional(),
  profile_pic: z
    .string()
    .url("Profile picture must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password, fname, lname, profile_pic } = validationResult.data;

    await ConnectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
      fname,
      lname,
      profile_pic,
      roadmap: [],
      quizzes: [],
      certificates: [],
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
