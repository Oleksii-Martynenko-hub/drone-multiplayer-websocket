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
  static readonly attrs = [
    'id',
    'ownerId',
    'complexity',
    'maxPlayers',
  ] as const;
  static readonly playerForeignKey = 'roomId';
  static readonly includePlayersAlias = 'players';

  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<Player['id']>;
  declare complexity: number;
  declare maxPlayers: number;

  declare addPlayer: HasManyAddAssociationMixin<Player, number>;
  declare setPlayer: HasManySetAssociationsMixin<Player, number>;
  declare removePlayer: HasManyRemoveAssociationMixin<Player, number>;
  declare countPlayers: HasManyCountAssociationsMixin;

  static getAttributesKeys(except?: ReturnType<typeof this.attrs.slice>) {
    if (except) {
      return this.attrs.filter((key) => !except.includes(key)) as string[];
    }
    return this.attrs as unknown as string[];
  }
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
