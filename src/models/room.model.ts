import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import sequelize from '../database/db';
import Player from './player.model';
import { CommonModel, GetAttrKeysMethod } from './common.model';
import Session from './session.model';

class Room extends CommonModel<Room> {
  static readonly playerForeignKey = 'ownerId';
  static readonly attributes = [
    'id',
    'maxPlayers',
    this.playerForeignKey,
  ] as const;
  static readonly includePlayersAlias = 'players';
  static readonly includeSessionsAlias = 'sessions';

  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<Player['id']>;
  declare maxPlayers: number;

  declare addPlayer: HasManyAddAssociationMixin<Player, number>;
  declare setPlayer: HasManySetAssociationsMixin<Player, number>;
  declare removePlayer: HasManyRemoveAssociationMixin<Player, number>;
  declare countPlayers: HasManyCountAssociationsMixin;
  declare createSession: HasOneCreateAssociationMixin<Session>;

  declare static getAttrKeys: GetAttrKeysMethod<Room>;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
