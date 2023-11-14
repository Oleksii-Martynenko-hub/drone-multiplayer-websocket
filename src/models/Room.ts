import WebSocket from 'ws';
import { v4 as generateId } from 'uuid';

import { Player } from './player';
import { WebSocketBody } from 'src/main';

export class Room {
  protected playersMap: Map<string, Player> = new Map();
  protected playerIds: string[] = [];

  constructor(
    ws: WebSocket,
    protected readonly roomId: string,
    protected readonly ownerId: string,
    protected readonly maxPlayers = 2
  ) {
    this.joinPlayer(ws, ownerId);
  }

  static generateRoomId() {
    return generateId();
  }

  joinPlayer(ws: WebSocket, playerId: string) {
    if (this.playersMap.size >= this.maxPlayers) {
      throw Error(`Room ${this.roomId} is full!` )
    }

    const newPlayer = new Player(ws, playerId);

    this.playerIds.push(playerId);
    this.playersMap.set(playerId, newPlayer);

    return newPlayer;
  }

  removePlayer(player: Player | string) {
    if (typeof player === 'string') {
      this.playersMap.delete(player);
      this.playerIds = this.playerIds.filter((id) => id !== player);
      return;
    }

    const playerId = player.getId();

    this.playersMap.delete(playerId);
    this.playerIds = this.playerIds.filter((id) => id !== playerId);
  }

  getPlayer(playerId: string) {
    return this.playersMap.get(playerId);
  }

  isAllPlayerReady() {
    return this.playerIds.every((id) => {
      return this.playersMap.get(id).getIsPlayerReady();
    });
  }

  getId() {
    return this.roomId;
  }

  sendToRoom(body: WebSocketBody, exceptId?: string) {
    this.playersMap.forEach((player, id) => {
      if (id !== exceptId) {
        player.send(body);
      }
    });
  }
}
