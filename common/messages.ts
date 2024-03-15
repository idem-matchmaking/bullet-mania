import { Direction, GameState } from "./types";

export enum ClientMessageType {
  SetNickname,
  SetDirection,
  SetAngle,
  Shoot,
  Ping,
  Dash,
  Respawn,
}

export enum ServerMessageType {
  StateUpdate,
  PingResponse,
  GameResult
}

export type ClientMessage =
  | SetNicknameMessage
  | SetDirectionMessage
  | SetAngleMessage
  | ShootMessage
  | PingMessage
  | DashMessage
  | RespawnMessage;

export type SetDirectionMessage = {
  type: ClientMessageType.SetDirection;
  direction: Direction;
};

export type SetNicknameMessage = {
  type: ClientMessageType.SetNickname;
  nickname: string;
};

export type SetAngleMessage = {
  type: ClientMessageType.SetAngle;
  angle: number;
};

export type ShootMessage = {
  type: ClientMessageType.Shoot;
};

export type DashMessage = {
  type: ClientMessageType.Dash;
};

export type RespawnMessage = {
  type: ClientMessageType.Respawn;
};

export type PingMessage = {
  type: ClientMessageType.Ping;
  id: number;
};

export type ServerMessage = StateUpdateMessage | PingResponseMessage | GameResultMessage;

export type StateUpdateMessage = {
  type: ServerMessageType.StateUpdate;
  state: GameState;
  ts: number;
};

export type PingResponseMessage = {
  type: ServerMessageType.PingResponse;
  id: number;
};

export type GameResultMessage = {
  type: ServerMessageType.GameResult;
  winningPlayerId: string;
  matchRankingResponse: string;
};
