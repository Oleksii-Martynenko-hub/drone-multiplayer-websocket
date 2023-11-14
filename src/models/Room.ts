import WebSocket from 'ws';
import { v4 as generateId } from 'uuid';

interface Player {
  playerId: string;
  isReady: boolean;
  socket: WebSocket;
}

export class Room {
  readonly roomId: string;
  protected players: Player[];

  constructor(
    ws: WebSocket,
    protected readonly ownerId: string,
    protected readonly maxPlayers = 2
  ) {
    this.roomId = generateId();

    this.players = [
      {
        playerId: ownerId,
        isReady: false,
        socket: ws,
      },
    ];
  }

  joinPlayer() {}
  removePlayer() {}
}
