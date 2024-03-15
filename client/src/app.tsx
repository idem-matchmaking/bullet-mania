import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HathoraConnection } from "@hathora/client-sdk";

import { SessionMetadata, RoomConfig } from "../../common/types";

import { getHathoraSdk, isReadyForConnect, Token } from "./utils";
import { Socials } from "./components/website/Socials";
import { HathoraLogo } from "./components/website/HathoraLogo";
import { GithubCorner } from "./components/website/GithubCorner";
import { Footer } from "./components/website/Footer";
import { ExplanationText, NavLink } from "./components/website/ExplanationText";
import { Arrow } from "./components/website/Arrow";
import { NicknameScreen } from "./components/lobby/NicknameScreen";
import { LobbySelector } from "./components/lobby/LobbySelector";
import { BulletButton } from "./components/lobby/BulletButton";
import { GameComponent, GameConfig } from "./components/GameComponent";
import { PlayerJoin } from "./idem/components/PlayerJoin";
import { ServerMessageType } from "../../common/messages";
import { MatchRankingResponse } from "../../common/idem/contracts/MatchRankingResponse";
import { GameResult } from "./idem/components/GameResult";
import { Region } from "@hathora/cloud-sdk-typescript/dist/sdk/models/shared";

const gameServer = process.env.IDEM_GAME_SERVER!;
const appId = process.env.HATHORA_APP_ID;
const hathoraSdk = getHathoraSdk(appId);

function App() {
  const [googleIdToken, setGoogleIdToken] = useState<string | undefined>();
  const [token, setToken] = React.useState<Token | undefined>(undefined);

  const [connection, setConnection] = useState<HathoraConnection | undefined>();
  const [sessionMetadata, setSessionMetadata] = useState<SessionMetadata | undefined>(undefined);
  const [connectionClosed, setConnectionClosed] = useState(false);
  const [roomIdNotFound, setRoomIdNotFound] = useState<string | undefined>(undefined);
  const [isNicknameAcked, setIsNicknameAcked] = React.useState<boolean>(true);

  useEffect(() => {
    const initToken = async () => {
      const tokenLocal = await getToken(googleIdToken);
      setToken(tokenLocal);
    };

    initToken();
  }, []);

  if (appId == null || token == null) {
    return (
      <div
        className={"bg-neutralgray-700 text-neutralgray-400 text-xl w-full h-screen flex items-center justify-center"}
      >
        Loading...
      </div>
    );
  }

  const roomIdFromUrl = getRoomIdFromUrl();
  if (
    roomIdFromUrl != null &&
    sessionMetadata?.roomId != roomIdFromUrl &&
    roomIdNotFound == null &&
    !connectionClosed &&
    !sessionMetadata?.isGameEnd
  ) {
    // Once we parse roomId from the URL, get connection details to connect player to the server
    isReadyForConnect(appId, roomIdFromUrl, hathoraSdk)
      .then(async ({ connectionInfo }) => {
        setRoomIdNotFound(undefined);
        if (connection != null) {
          connection.disconnect(1000);
        }

        try {
          const roomConfig: RoomConfig = {
            expectedPlayerCount: 0,
            expectedPlayers: [],
            capacity: 2,
            winningScore: 5,
            playerNicknameMap: {},
            isGameEnd: false
          };

          if (!roomConfig.isGameEnd) {
            const connect = new HathoraConnection(roomIdFromUrl, connectionInfo);
            connect.onMessageJson((message) => {

              if (message.type === ServerMessageType.GameResult) {
                console.log('GameResult');
                const matchRankingResponse = JSON.parse(message.matchRankingResponse) as MatchRankingResponse;

                setSessionMetadata({
                  ...sessionMetadata!,
                  matchRankingResponse: matchRankingResponse,
                  winningPlayerId: message.winningPlayerId,
                  isGameEnd: true
                });
              }
            });
            connect.onClose(async (e) => {
              console.log('HathoraConnection closed: ' + e.reason);
              setConnectionClosed(true);
            });
            setConnection(connect);
          }
          setSessionMetadata({
            serverUrl: `${connectionInfo.host}:${connectionInfo.port}`,
            region: gameServer as Region,
            roomId: roomIdFromUrl,
            capacity: roomConfig.capacity,
            winningScore: roomConfig.winningScore,
            isGameEnd: roomConfig.isGameEnd,
            winningPlayerId: roomConfig.winningPlayerId,
            playerNicknameMap: roomConfig.playerNicknameMap,
            creatorId: 'admin',
          });
        } catch (e) {
          setRoomIdNotFound(roomIdFromUrl);
        }
      })
      .catch(() => {
        setRoomIdNotFound(roomIdFromUrl);
      });
  }
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_AUTH_CLIENT_ID ?? ""}>
      <GithubCorner />
      <div className="py-5 overflow-hidden" style={{ backgroundColor: "#0E0E1B" }}>
        <div className="md:w-fit mx-auto px-2 md:px-0">
          <div className={"flex justify-center items-center"}>
            <div className={"flex justify-center items-center md:items-end"}>
              <a href="/" className={""}>
                <img src="title_logo.png" className="h-[40px] md:h-[60px]" alt="logo" />
              </a>
              <div className={"mx-3 text-hathoraSecondary-400 text-xs md:text-lg text-baseline"}>PRESENT</div>
            </div>
            <a href="/" className={""}>
              <img src="bullet_mania_logo_light.png" className="h-[40px] md:h-[60px]" alt="logo" />
            </a>
          </div>
          <p className={"visible md:hidden text-neutralgray-400 text-center mt-3"}>
            Bullet Mania isn't currently playable on mobile <br />
            <NavLink headingId={"docsTop"}>Skip to documentation</NavLink>
          </p>
          <div className={"md:mt-4 relative"} style={{ width: GameConfig.width, height: GameConfig.height }}>
            {/* <GameResult /> */}
            {connectionClosed ? (
              <div className="border text-white flex flex-wrap flex-col justify-center h-full w-full content-center text-secondary-400 text-center">
                {sessionMetadata?.isGameEnd && sessionMetadata.matchRankingResponse != null ? (
                  <GameResult
                    matchRankingResponse={sessionMetadata.matchRankingResponse}
                    winningPlayerId={sessionMetadata.winningPlayerId!}
                  />
                ) : (
                  <div>
                    <span className={"text-secondary-600"}>Connection was closed</span>
                    <a href={"/"} className={"mt-2"}>
                      <BulletButton text={"Return to home"} xlarge />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  className={
                    "hidden lg:flex items-center gap-2 absolute font-hathora font-bold text-3xl text-neutralgray-550 -left-[220px] top-[272px]"
                  }
                >
                  <div>TRY IT</div>
                  <div>
                    <Arrow />
                  </div>
                </div>
                <div
                  className={
                    "hidden lg:flex items-center gap-2 absolute font-hathora font-bold text-3xl text-neutralgray-550 -left-[290px] top-[658px]"
                  }
                >
                  <div>LEARN HOW</div>
                  <div>
                    <Arrow />
                  </div>
                </div>
                {connection == null && !sessionMetadata?.isGameEnd && !roomIdFromUrl ? (
                  <PlayerJoin roomIdNotFound={roomIdNotFound} />
                ) : !isNicknameAcked && !sessionMetadata?.isGameEnd ? (
                  <NicknameScreen sessionMetadata={sessionMetadata} setIsNicknameAcked={setIsNicknameAcked} />
                ) : (
                  <></>
                )}
                <GameComponent
                  connection={connection}
                  token={token}
                  sessionMetadata={sessionMetadata}
                  isNicknameAcked={isNicknameAcked}
                />
              </>
            )}
          </div>
          <Socials roomId={sessionMetadata?.roomId} />
          <ExplanationText />
        </div>
      </div>
      <Footer />
    </GoogleOAuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

// Custom hook to access auth token
function useAuthToken(googleIdToken: string | undefined): Token | undefined {
  const [token, setToken] = React.useState<Token | undefined>();
  useEffect(() => {
    if (appId != null) {
      getToken(googleIdToken).then(setToken);
    }
  }, [googleIdToken]);
  return token;
}

// 1. Check sessionStorage for existing token
// 2. If googleIdToken passed, use it for auth and store token
// 3. If none above, then use anonymous auth
async function getToken(googleIdToken: string | undefined): Promise<Token> {
  const maybeToken = sessionStorage.getItem("bullet-mania-token");
  const maybeTokenType = sessionStorage.getItem("bullet-mania-token-type");
  if (maybeToken !== null && maybeTokenType != null) {
    return {
      type: maybeTokenType,
      value: maybeToken,
    } as Token;
  }
  if (googleIdToken == null) {
    const { loginResponse } = await hathoraSdk.authV1.loginAnonymous();
    if (loginResponse == null) {
      throw new Error("Failed to login anonymously");
    }
    return { value: loginResponse.token, type: "anonymous" };
  }
  const { loginResponse } = await hathoraSdk.authV1.loginGoogle({ idToken: googleIdToken });
  if (loginResponse == null) {
    throw new Error("Failed to login with google");
  }
  sessionStorage.setItem("bullet-mania-token", loginResponse.token);
  sessionStorage.setItem("bullet-mania-token-type", "google");
  return { value: loginResponse.token, type: "google" };
}

function getRoomIdFromUrl(): string | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomid');
  return roomId ?? undefined;
}
