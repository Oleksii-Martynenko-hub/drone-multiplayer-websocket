import { Request, Response } from 'express';

import { RoomService } from '../services/room.service';
import { PlayerService } from '../services/player.service';

export class RoomController {
  private roomService = new RoomService();
  private playerService = new PlayerService();

  public getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
      const roomId = req.query.roomId as string;

      const room = await this.roomService.getRoomByIdWithPlayers(roomId);

      if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }

      res.status(200).json({ data: room.dataValues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public postCreateRoom = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const playerId = req.body.playerId;

      const player = await this.playerService.getPlayerWithRoom(playerId);

      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }
      if (player.get('room')) {
        res.status(404).json({ error: 'Player already have room' });
        return;
      }

      const room = await player.createRoom();
      await room.addPlayer(player);

      res.status(201).json({ roomId: room.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const roomController = new RoomController();
