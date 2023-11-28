import Room from '../models/room.model';
import Player from '../models/player.model';

export class RoomService {
  public async getRoomByIdWithPlayers(roomId: string): Promise<Room> {
    return Room.findByPk(roomId, {
      attributes: Room.getAttrKeys(['complexity']),
      include: {
        model: Player,
        as: Room.includePlayersAlias,
        attributes: Player.getAttrKeys(['roomId']),
      },
    });
  }

  public async createPlayer(playerName: string): Promise<Player> {
    return Player.create({ name: playerName });
  }
}
