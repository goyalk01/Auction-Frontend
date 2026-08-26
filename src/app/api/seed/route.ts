import { NextResponse } from "next/server";
import { seedEventDatabase } from "../../../lib/firebase/seed";
import { AUCTION_EVENT_ID } from "../../../lib/firebase/config";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { eventId = AUCTION_EVENT_ID, force = false, passcode = "" } = body;

    // Validate security key
    const validPasscodes = ["admin2026", "vitb-ipl-admin", "seed2026"];
    if (process.env.NODE_ENV === "production" && !validPasscodes.includes(passcode)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid seed authorization passcode." },
        { status: 401 }
      );
    }

    const result = await seedEventDatabase(eventId, force);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error during seeding." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    targetEvent: AUCTION_EVENT_ID,
    message: "POST to /api/seed with { passcode: 'admin2026', force: true } to seed Firebase.",
  });
}
