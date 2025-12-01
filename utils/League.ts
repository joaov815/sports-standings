export interface Team {
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export class League {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  imageUrl: string | null;
  numberOfTeams: number;
  numberOfRounds: number;
  teams: Team[];

  constructor(data: {
    name: string;
    description: string | null;
    kind: string;
    imageUrl: string | null;
    numberOfTeams: number;
    numberOfRounds: number;
    teams: Team[];
  }) {
    this.id = crypto.randomUUID();
    this.name = data.name;
    this.description = data.description;
    this.kind = data.kind;
    this.imageUrl = data.imageUrl;
    this.numberOfTeams = data.numberOfTeams;
    this.numberOfRounds = data.numberOfRounds;
    this.teams = data.teams;
  }
}
