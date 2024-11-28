import { NextResponse } from "next/server";
import { login } from "@/lib/auth"; // Your auth logic file
import { z } from "zod"; // Optional schema validation

// Define the request body schema for validation (optional)
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const parsedBody = LoginSchema.parse(body); // Optional validation step

    const { email, password } = parsedBody;

    // Call your register function to handle registration logic
    await login(email, password);

    // Return a success response
    return NextResponse.json(
      { message: "User registered successfully, you are logged in." },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors or any other errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}
