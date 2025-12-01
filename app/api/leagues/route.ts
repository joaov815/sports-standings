import { NextRequest, NextResponse } from "next/server";
import { League } from "@/utils/League";
import { leagues } from "@/utils/leagueStore";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const league = new League({
      name: data.name,
      description: data.description,
      kind: data.kind,
      imageUrl: data.imageUrl,
      numberOfTeams: data.numberOfTeams,
      numberOfRounds: data.numberOfRounds,
      teams: data.teams,
    });

    leagues.set(league.id, league);

    return NextResponse.json({ id: league.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create league" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(Array.from(leagues.values()));
}
