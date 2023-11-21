import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../database/db';
import Player from './player.model';

class Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>> {
  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<Player['id']>;
  declare complexity: number;
  declare maxPlayers: number;

  declare addPlayer: HasManyAddAssociationMixin<Player, number>;
  declare setPlayer: HasManySetAssociationsMixin<Player, number>;
  declare removePlayer: HasManyRemoveAssociationMixin<Player, number>;
  declare countPlayers: HasManyCountAssociationsMixin;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    complexity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0,
        max: 10,
      },
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      validate: {
        isInt: true,
        min: 2,
        max: 8,
      },
    },
  },
  {
    sequelize,
    tableName: 'room',
  }
);

export default Room;
