import Player from './player.model';
import Room from './room.model';
import Token from './token.model';

Room.hasMany(Player, {
  as: Room.includePlayersAlias,
  foreignKey: Room.playerForeignKey,
});
Player.hasOne(Room, {
  as: Player.includeRoomAlias,
  foreignKey: Player.roomForeignKey,
});
Room.belongsTo(Player, { foreignKey: Player.roomForeignKey });

Player.hasOne(Token, {
  as: Player.includeTokenAlias,
  foreignKey: Player.tokenForeignKey,
});
Token.belongsTo(Player, { foreignKey: Player.tokenForeignKey });
