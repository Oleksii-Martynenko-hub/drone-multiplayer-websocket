import { Request, Response } from 'express';

import { PlayerService } from '../services/player.service';

export class PlayerController {
  private playerService = new PlayerService();

  public getPlayerByName = async (
    req: Request & { player: { name: string; id: number } },
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.player;

      const player = await this.playerService.getPlayerWithRoom(id);

      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      res.status(200).json({ data: player.dataValues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const playerController = new PlayerController();
