import WebSocket, { WebSocketServer } from 'ws';

import { Room } from './Room';

export class RoomManager {
  protected roomsMap: Map<string, Room> = new Map();

  constructor(protected readonly wss: WebSocketServer) {}

  createRoom(ws: WebSocket, ownerId: string) {
    const roomId = Room.generateRoomId();
    const newRoom = new Room(ws, roomId, ownerId);

    this.roomsMap.set(roomId, newRoom);
    return newRoom;
  }

  getRoom(roomId: string) {
    if (!this.roomsMap.has(roomId)) {
      throw Error(`Room ${roomId} does not exist!`);
    }

    return this.roomsMap.get(roomId);
  }

  closeRoom(room: Room | string) {
    if (typeof room === 'string') {
      this.roomsMap.delete(room);
      return;
    }

    this.roomsMap.delete(room.getId());
  }
}
