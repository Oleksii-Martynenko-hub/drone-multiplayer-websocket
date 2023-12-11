import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import sequelize from '../database/db';
import Room from './room.model';
import { CommonModel, GetAttrKeysMethod } from './common.model';
import Token from './token.model';
import Session from './session.model';

class Player extends CommonModel<Player> {
  static readonly roomForeignKey = 'roomId';
  static readonly attributes = ['id', 'name', this.roomForeignKey] as const;
  static readonly includeRoomAlias = 'room';
  static readonly includeTokenAlias = 'token';
  static readonly includeSessionsAlias = 'sessions';

  declare id: CreationOptional<number>;
  declare roomId: ForeignKey<Room['id']>;
  declare name: string; // TODO: 1. make unique value

  declare createRoom: HasOneCreateAssociationMixin<Room>;
  declare createToken: HasOneCreateAssociationMixin<Token>;
  declare createSession: HasOneCreateAssociationMixin<Session>;

  declare static getAttrKeys: GetAttrKeysMethod<Player>;
}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'player',
  }
);

export default Player;
