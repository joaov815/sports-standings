import { NextRequest, NextResponse } from "next/server";
import { leagues } from "@/utils/leagueStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const league = leagues.get(id);

  if (!league) {
    return NextResponse.json({ error: "League not found" }, { status: 404 });
  }

  return NextResponse.json(league);
}
