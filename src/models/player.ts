import { WebSocket } from 'ws';

import { WebSocketBody } from 'src/main';

export type Point = {
  x: number;
  y: number;
};

export class Player {
  protected isReady = false;
  protected position: Point = { x: 0, y: 0 };

  constructor(
    protected readonly ws: WebSocket,
    protected readonly playerId: string
  ) {}

  setPlayerReady() {
    this.isReady = true;
  }

  getIsPlayerReady() {
    return this.isReady;
  }

  getId() {
    return this.playerId;
  }

  send(body: WebSocketBody) {
    this.ws.send(JSON.stringify(body));
  }
}
