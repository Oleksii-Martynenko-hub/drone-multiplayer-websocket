import { Request, Response } from 'express';

import { ACCESS_TOKEN_COOKIE_KEY } from '../constants/constants';

import { PlayerService } from '../services/player.service';

export class AuthController {
  private playerService = new PlayerService();

  public postLogin = async (
    req: Request<void, void, { playerName: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const { playerName } = req.body;

      const { token, player } = await this.playerService.getPlayerByName(
        playerName
      );

      res.cookie(ACCESS_TOKEN_COOKIE_KEY, token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json({ data: player.dataValues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public postSignup = async (
    req: Request<void, void, { playerName: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const { playerName } = req.body;

      const { token, player } = await this.playerService.createPlayer(
        playerName
      );

      res.cookie(ACCESS_TOKEN_COOKIE_KEY, token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json({ data: player.dataValues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public getLogout = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie(ACCESS_TOKEN_COOKIE_KEY);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const authController = new AuthController();
