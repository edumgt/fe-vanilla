export type BoardTileType = 'city' | 'special' | 'start' | 'jail' | 'island' | 'space';

export interface BoardTile {
  index: number;
  name: string;
  type: BoardTileType;
  price?: number;
  toll?: number;
  owner?: string | null;
  color?: string;
  landmark?: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  position: number;
  cash: number;
  assets: number[];
  color: string;
  isJailed: boolean;
  jailTurns: number;
}

export interface GameState {
  turn: number;
  currentPlayerIndex: number;
  players: PlayerState[];
  tiles: BoardTile[];
  lastDice: [number, number];
  isDouble: boolean;
  status: 'waiting' | 'playing' | 'gameover';
}
