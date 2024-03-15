export type PlayerRankingResponse = {
    playerId: string;
    totalMatchesPlayed: number;
    totalWins: number;
    totalLosses: number;
    season: string,
    seasonMatchesPlayed: number;
    seasonWins: number;
    seasonLosses: number;
    matchesPlayed: number;
    wins: number;
    losses: number;
    rating: number;
    ratingUncertainty: number;
    rankingPoints: number;
    ratingDeltaLastGame: number;
    rankingDeltaLastGame: number;
    winRatio: number;
}
