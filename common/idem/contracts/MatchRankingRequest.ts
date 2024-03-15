import { TeamRankingRequest } from "./TeamRankingRequest";

export type MatchRankingRequest = {
    server: string;
    gameLength: number;
    teams: TeamRankingRequest[]
}
