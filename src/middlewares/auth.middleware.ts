import { Request, Response } from 'express';

import { ACCESS_TOKEN_COOKIE_KEY } from '../constants/constants';

import { TokenService } from '../services/token.service';

export const authMiddleware = async (
  req: Request & { player: { name: string; id: number } },
  res: Response,
  next
) => {
  try {
    const token = req.cookies[ACCESS_TOKEN_COOKIE_KEY];
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    const playerData = TokenService.verifyToken<{ name: string; id: number }>(
      token
    );
    if (!playerData) {
      return res.status(401).send('Unauthorized');
    }

    req.player = playerData;
    next();
  } catch (e) {
    return res.status(401).send('Unauthorized');
  }
};
