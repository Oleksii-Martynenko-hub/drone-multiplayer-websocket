import { Request, Response } from 'express';

import { CaveService } from '../services/cave.service';
import { PlayerService } from '../services/player.service';
import { TokenService } from '../services/token.service';
import Token from '../models/token.model';

export class BaseController {
  private playerService = new PlayerService();

  public postInitSinglePlayerSession = async (
    req: Request<void, void, { name: string; complexity: number }>,
    res: Response
  ): Promise<void> => {
    try {
      const { name, complexity } = req.body;

      const player = await this.playerService.createPlayer(name);

      const tokenWithPayload = TokenService.generateToken(player.dataValues);

      const caveService = new CaveService(complexity);
      const stringCaveData = caveService.generateCaveWalls(true);

      await player.createToken({ token: tokenWithPayload });
      await player.createSession({ complexity, caveData: stringCaveData });

      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      res.status(201).json({ id: player.id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public getTokenChunkByPlayerId = async (
    req: Request<{ chunk: string }, void, void, { id: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const playerId = req.query.id;
      const tokenChunkNumber = parseInt(req.params.chunk);

      const token = await Token.findOne({ where: { playerId } });

      if (!token) {
        res.status(404).json({ error: 'Token not found' });
        return;
      }

      const chunkSize = Math.ceil(token.token.length / 4);
      const tokenChunk = token.token.substring(
        (tokenChunkNumber - 1) * chunkSize,
        (tokenChunkNumber - 1) * chunkSize + chunkSize
      );

      res.status(200).json({ no: tokenChunkNumber, chunk: tokenChunk });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const baseController = new BaseController();
