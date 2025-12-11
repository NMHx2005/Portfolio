import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = contactFormSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid request", issues: result.error.flatten() },
        { status: 400 },
      );
    }

    // Placeholder for integration with email service or CRM.
    console.info("Contact request received:", {
      ...result.data,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Received" }, { status: 200 });
  } catch (error) {
    console.error("Contact endpoint error", error);
    return NextResponse.json(
      { message: "Unexpected error" },
      { status: 500 },
    );
  }
}


