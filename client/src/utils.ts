import { LobbyV3 } from "@hathora/cloud-sdk-typescript/dist/sdk/models/shared";
import { HathoraCloud } from "@hathora/cloud-sdk-typescript";
import { ConnectionDetails } from "@hathora/client-sdk";

export const LOCAL_CONNECTION_DETAILS: ConnectionDetails = {
  host: "localhost",
  port: 4000,
  transportType: "tcp" as const,
};

export type Token = GoogleToken | AnonymousToken;

export interface GoogleToken {
  type: "google";
  value: string;
}
interface AnonymousToken {
  type: "anonymous";
  value: string;
}

export const Token = {
  isGoogleToken(token: Token): token is GoogleToken {
    return token.type === "google";
  },
  isAnonymousToken(token: Token): token is AnonymousToken {
    return token.type === "anonymous";
  },
};

export async function isReadyForConnect(
  appId: string,
  roomId: string,
  hathoraSdk: HathoraCloud
): Promise<{ connectionInfo: ConnectionDetails }> {
  const MAX_CONNECT_ATTEMPTS = 50;
  const TRY_CONNECT_INTERVAL_MS = 1000;

  for (let i = 0; i < MAX_CONNECT_ATTEMPTS; i++) {
    const { connectionInfoV2 } = await hathoraSdk.roomV2.getConnectionInfo(roomId);
    if (connectionInfoV2?.exposedPort !== undefined) {
      return { connectionInfo: connectionInfoV2.exposedPort };
    }
    await new Promise((resolve) => setTimeout(resolve, TRY_CONNECT_INTERVAL_MS));
  }
  throw new Error("Polling timed out");
}

export function getHathoraSdk(appId: string | undefined): HathoraCloud {
  return new HathoraCloud({ appId });
}
