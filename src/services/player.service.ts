import Player from '../models/player.model';

export class PlayerService {
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

  public async createPlayer(playerName: string): Promise<Player> {
    return Player.create({ name: playerName });
  }
}
