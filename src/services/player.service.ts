import createHttpError from 'http-errors';

import { TokenService } from './token.service';
import Player from '../models/player.model';
// TODO: add player dto
export class PlayerService {
  public async getPlayerByName(playerName: string) {
    const player = await Player.findOne({
      where: { name: playerName },
      attributes: Player.getAttrKeys(['roomId']),
      include: [Player.includeRoomAlias, Player.includeSessionsAlias],
    });

    if (!player) {
      throw createHttpError(404, `Player with name: ${playerName} not found`);
    }

    const { id, name } = player.dataValues;

    const tokenWithPayload = TokenService.generateToken({ id, name });

    return { token: tokenWithPayload, player };
  }

  public async getPlayerByNameWithRoom(playerName: string): Promise<Player> {
    return Player.findOne({
      where: { name: playerName },
      attributes: Player.getAttrKeys(['roomId']),
      include: Player.includeRoomAlias,
    });
  }

  public async getPlayerWithRoom(playerId: string): Promise<Player> {
    return Player.findByPk(playerId, {
      include: Player.includeRoomAlias,
    });
  }

  public async createPlayer(playerName: string) {
    const player = await Player.create({ name: playerName });

    const { id, name } = player.dataValues;

    const tokenWithPayload = TokenService.generateToken({ id, name });

    return { token: tokenWithPayload, player };
  }
}
