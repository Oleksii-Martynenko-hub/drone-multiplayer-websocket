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

class Player extends CommonModel<Player> {
  static readonly attributes = ['id', 'name', 'roomId'] as const;
  static readonly roomForeignKey = 'ownerId';
  static readonly tokenForeignKey = 'playerId';
  static readonly includeRoomAlias = 'room';
  static readonly includeTokenAlias = 'token';

  declare id: CreationOptional<number>;
  declare roomId: ForeignKey<Room['id']>;
  declare name: string;

  declare createRoom: HasOneCreateAssociationMixin<Room>;
  declare createToken: HasOneCreateAssociationMixin<Token>;

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
