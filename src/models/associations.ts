import Player from './player.model';
import Room from './room.model';

Room.hasMany(Player, {
  as: Room.includePlayersAlias,
  foreignKey: Room.playerForeignKey,
});

Player.hasOne(Room, {
  as: Player.includeRoomAlias,
  foreignKey: Player.roomForeignKey,
});

Room.belongsTo(Player, { foreignKey: Player.roomForeignKey });
