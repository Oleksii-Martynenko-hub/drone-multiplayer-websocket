import Player from './player.model';
import Room from './room.model';

Room.hasMany(Player, { foreignKey: 'roomId' });

Player.hasOne(Room, { as: 'room', foreignKey: 'ownerId' });

Room.belongsTo(Player, { foreignKey: 'ownerId' });
