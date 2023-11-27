import { Request, Response } from 'express';

import Player from '../models/player.model';
import Room from '../models/room.model';

export class PlayerController {
  public getPlayerByName = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const playerName = req.query.name as string;

      const player = await Player.findOne({
        attributes: Player.getAttrKeys(['roomId']),
        where: { name: playerName },
        include: {
          model: Room,
          as: Player.includeRoomAlias,
          attributes: [
            ...Room.getAttrKeys(['complexity']),
            ['complexity', 'difficulty'],
          ],
        },
      });

      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      res.status(200).json({ data: player.dataValues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public postCreatePlayer = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const playerName = req.body.name;

      const newPlayer = await Player.create({ name: playerName });

      res.status(201).json({ playerId: newPlayer.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const playerController = new PlayerController();
