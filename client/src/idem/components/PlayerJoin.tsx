import React, { useState, useEffect } from "react";
import { IdemWebsocketClient } from "../IdemWebsocketClient";
import { PlayerJoined } from "../AddPlayerRequest";
import { BulletButton } from "../../components/lobby/BulletButton";

const websocketApiUrl = process.env.IDEM_WEBSOCKET_API_URL!;
const gameServer = process.env.IDEM_GAME_SERVER!;
const gameSlug = process.env.IDEM_GAME_SLUG!;
const gameId = process.env.IDEM_GAME_ID!;
const gameJoinCode = process.env.IDEM_GAME_JOIN_CODE!;

export enum PlayerJoinStatus {
  Available,
  InProgress,
  Completed,
}

interface PlayerJoinProps {
  roomIdNotFound: string | undefined;
}
export function PlayerJoin(props: PlayerJoinProps) {
  const { roomIdNotFound } = props;
  const [playerId, setPlayerId] = useState<string>("");
  const [playerStatus, setPlayerStatus] = useState<PlayerJoinStatus>(PlayerJoinStatus.Available);
  const [websocketClient, setWebsocketClient] = useState<IdemWebsocketClient | undefined>(undefined);
  
  const playerJoined = (event: PlayerJoined) => {
    if (window.location.href.includes('index.html')) {
      window.location.href = `/index.html?roomid=${event.roomId}`;
    } else {
      window.location.href = `/?roomid=${event.roomId}`;
    }
  }

  const handleJoinPlayer = async () => {
    if (playerStatus == PlayerJoinStatus.Available) {
      setPlayerStatus(PlayerJoinStatus.InProgress);
      
      try {
        const client = new IdemWebsocketClient(websocketApiUrl);
        await client.connect(gameJoinCode, playerId);
        setWebsocketClient(client);
        
        client.addPlayer({
          gameSlug: gameSlug,
          gameId: gameId,
          playerId: playerId,
          server: gameServer,
          playerJoined: playerJoined
        });

        sessionStorage.setItem("bullet-mania-nickname", playerId);  
        setPlayerStatus(PlayerJoinStatus.Completed);
      } catch (e) {
        console.log(`Player joining failed: ${e}`);
        setPlayerStatus(PlayerJoinStatus.Available);
      }
    }
  };

  const joinDisabled = playerStatus !== PlayerJoinStatus.Available;
  let joinMessage = 'You will be added to the matchmaking queue. As soon as a match is found, the game will start.';
  if (playerStatus == PlayerJoinStatus.InProgress) {
    joinMessage = 'Requesting to join matchmaking.';
  } else if (playerStatus == PlayerJoinStatus.Completed) {
    joinMessage = 'Successfully entered the matchmaking queue. Waiting for a suitable match.';
  }

  return (
    <div className="bg-[url('/splash.png')] h-full flex flex-col p-1 relative">
      {roomIdNotFound && (
        <div className={"absolute left-1/2 -translate-x-1/2 text-red-500 font-semibold"}>
          Room not found: {roomIdNotFound}
        </div>
      )}
      <div className="flex items-center justify-center mt-6 mb-3">
        <img src="bullet_mania_logo.png" alt="logo" />
      </div>
      <div
        style={{textAlign: 'center', width: '525px', margin: '40px auto',  padding: '32px', paddingTop: '16px', borderRadius: '50px'}}
        className={`bg-secondary-400 border-2 border-brand-500 block text-center px-2`}
      >
        <h1 className={`text-3xl font-semibold uppercase text-brand-500 mt-3 mb-1`}>Get matched</h1>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px'}}>
            <input
              style={{height: '50px'}}
              className="px-4 py-2 bg-secondary-600 rounded placeholder:text-secondary-800 text-secondary-800 cursor-text mb-3"
              name="gameCode"
              placeholder="Player name"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
            />
            <button
              disabled={joinDisabled}
              style={{marginBottom: '8px'}}
              onClick={async () => await handleJoinPlayer()}
            >
              <BulletButton text={"JOIN!"} disabled={joinDisabled} large />
            </button>
          </div>
          <p style={{textAlign: 'center', width: '375px', margin: '32px auto'}}>{joinMessage}</p>
      </div>
    </div>
  );
}
