import { AddPlayerRequest, PlayerJoined } from "./AddPlayerRequest";

export class IdemWebsocketClient {
    private readonly url: string;
    private websocket!: WebSocket;
    private playerJoinedEvent = (event: PlayerJoined) => {};
   
    constructor(url: string) {
        this.url = url;
    }

    connect(code: string, playerId: string): Promise<boolean> {
        const connectionOpened = new Promise<boolean>((resolve, reject) => {
            this.websocket = new WebSocket(
                `${this.url}/?playerId=${playerId}&code=${code}&authorization=Demo`
            );

            this.websocket.onopen = (e) => {
                console.log(`Connection opened ${JSON.stringify(e)}`);
                resolve(true);
            };
            this.websocket.onclose = (e) => console.log(`Connection closed ${e}`);

            this.websocket.onmessage = (e) => this.handleMessage(e);
        });

        const connectionTimeout = new Promise<boolean>((resolve, reject) => 
            setTimeout(() => {
                reject('Connection opening timeout');
            }, 3000)
        );

        return Promise.race([connectionOpened, connectionTimeout]);
    }

    disconnect() {
        this.websocket.close(1000, 'gsqs');
    }

    addPlayer(request: AddPlayerRequest) {
        const payload = {
            "game": request.gameSlug,
            "action": "add_player",
            "payload": {
                "players": [{"playerId": request.playerId, "servers": [request.server], "faction": "grell"}],
                "partyName": request.playerId,
                "gameId": request.gameId,
            },
        }
        this.playerJoinedEvent = request.playerJoined;

        this.websocket.send(JSON.stringify(payload));

        console.log(`addPlayer: ${JSON.stringify(payload)}`)
    }

    private handleMessage(event: MessageEvent) {
        try {
            console.log(`handleMessage: ${event}`);

            if (event.data) {
                const data = JSON.parse(event.data);
                if (data.action === 'joinInfo') {
                    this.playerJoinedEvent({
                        roomId: data.payload.roomId
                    });
                }
            }
        }
        catch (e) {
            console.log(`handleMessage error: ${e}`);
        }
    }
}