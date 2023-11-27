import { Request, Response } from 'express';

import { PlayerService } from '../services/player.service';

export class PlayerController {
  private playerService = new PlayerService();

  public getPlayerByName = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const playerName = req.query.name as string;

      const player = await this.playerService.getPlayerByNameWithRoom(
        playerName
      );

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

      const newPlayer = await this.playerService.createPlayer(playerName);

      res.status(201).json({ playerId: newPlayer.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const playerController = new PlayerController();
