"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Team {
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface League {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  imageUrl: string | null;
  numberOfTeams: number;
  numberOfRounds: number;
  teams: Team[];
}

export default function LeagueDetailPage() {
  const params = useParams();
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeague() {
      try {
        const response = await fetch(`/api/leagues/${params.id}`);

        if (!response.ok) {
          throw new Error("League not found");
        }

        const data = await response.json();
        setLeague(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load league");
      } finally {
        setLoading(false);
      }
    }

    fetchLeague();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error || !league) {
    return <div className="p-8">Error: {error || "League not found"}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{league.name}</h1>
        {league.description && <p className="text-gray-600">{league.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <strong>Kind:</strong> {league.kind}
        </div>
        <div>
          <strong>Number of Teams:</strong> {league.numberOfTeams}
        </div>
        <div>
          <strong>Number of Rounds:</strong> {league.numberOfRounds}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Teams</h2>
        <div className="space-y-4">
          {league.teams.map((team, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{team.name}</h3>
              {team.description && <p className="text-gray-600 mt-2">{team.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
