import { CreationOptional, DataTypes, ForeignKey } from 'sequelize';

import sequelize from '../database/db';
import Player from './player.model';
import Room from './room.model';
import { CommonModel, GetAttrKeysMethod } from './common.model';

class Session extends CommonModel<Session> {
  static readonly playerForeignKey = 'playerId';
  static readonly roomForeignKey = 'roomId';
  static readonly attributes = [
    'id',
    'complexity',
    'createdAt',
    'finishedAt',
    'score',
    this.playerForeignKey,
    this.roomForeignKey,
  ] as const;

  declare id: CreationOptional<number>;
  declare complexity: number;
  declare createdAt: CreationOptional<Date>;
  declare finishedAt: CreationOptional<Date>;
  declare score: number;
  declare playerId: ForeignKey<Player['id']>;
  declare roomId: ForeignKey<Room['id']>;

  declare static getAttrKeys: GetAttrKeysMethod<Session>;
}

Session.init(
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
    createdAt: DataTypes.DATE,
    finishedAt: DataTypes.DATE,
    score: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: 'token',
    timestamps: true,
    updatedAt: false,
  }
);

export default Session;
