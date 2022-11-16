export type TableData = {
    tournamentStage: TournamentStage;
}


export type TournamentStage = {
    name: string;
    standings?: {participants: Participants[]}[];
}

export type Participants = {
    participant: {
      name: string
      id: string
    }
    rank?: number
    data?: TeamStatistics[]
  }

  export type TeamStatistics = {
      code: string
      value: string
  }

  export type TeamMatchesData = {
    eventsByParticipantAndDateRange: {
        startDate:string
        incidents: {
            score: string
        }[]
        tournamentStage: TournamentStage
        participants: Participants[]
    }[]

  }

