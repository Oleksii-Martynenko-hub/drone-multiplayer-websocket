import Room from '../models/room.model';
import Player from '../models/player.model';

export class PlayerService {
  public async getPlayerByNameWithRoom(playerName: string): Promise<Player> {
    return Player.findOne({
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
  }

  public async createPlayer(playerName: string): Promise<Player> {
    return Player.create({ name: playerName });
  }
}
