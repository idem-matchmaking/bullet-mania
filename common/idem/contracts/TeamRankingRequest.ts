import { PlayerRankingRequest } from "./PlayerRankingRequest";

export type TeamRankingRequest = {
    rank: number;
    players: PlayerRankingRequest[]
}
