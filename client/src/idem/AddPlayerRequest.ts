export type PlayerJoined = {
    roomId: string;
};

export type AddPlayerRequest = {
    gameSlug: string;
    gameId: string;
    playerId: string;
    server: string;
    playerJoined: (event: PlayerJoined) => void;
};