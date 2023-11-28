import Player from './player.model';
import Room from './room.model';
import Token from './token.model';

Room.hasMany(Player, {
  as: Room.includePlayersAlias,
  foreignKey: Player.roomForeignKey,
});
Player.hasOne(Room, {
  as: Player.includeRoomAlias,
  foreignKey: Room.playerForeignKey,
});
Room.belongsTo(Player, { foreignKey: Room.playerForeignKey });

Player.hasOne(Token, {
  as: Player.includeTokenAlias,
  foreignKey: Token.playerForeignKey,
});
Token.belongsTo(Player, { foreignKey: Token.playerForeignKey });
