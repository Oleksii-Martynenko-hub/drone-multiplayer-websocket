import Player from './player.model';
import Room from './room.model';
import Session from './session.model';
import Token from './token.model';

// Player to Room associations
Player.hasOne(Room, {
  as: Player.includeRoomAlias,
  foreignKey: Room.playerForeignKey,
});
Room.hasMany(Player, {
  as: Room.includePlayersAlias,
  foreignKey: Player.roomForeignKey,
});
Room.belongsTo(Player, { foreignKey: Room.playerForeignKey });

// Player to Token associations
Player.hasOne(Token, {
  as: Player.includeTokenAlias,
  foreignKey: Token.playerForeignKey,
});
Token.belongsTo(Player, { foreignKey: Token.playerForeignKey });

// Player to Session associations
Player.hasMany(Session, {
  as: Player.includeSessionsAlias,
  foreignKey: Session.playerForeignKey,
});
Session.belongsTo(Player, { foreignKey: Session.playerForeignKey });

// Room to Session associations
Room.hasMany(Session, {
  as: Room.includeSessionsAlias,
  foreignKey: Session.roomForeignKey,
});
Session.belongsTo(Room, { foreignKey: Session.roomForeignKey });
