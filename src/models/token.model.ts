import { CreationOptional, DataTypes, ForeignKey } from 'sequelize';

import sequelize from '../database/db';
import Player from './player.model';
import { CommonModel, GetAttrKeysMethod } from './common.model';

class Token extends CommonModel<Token> {
  static readonly attributes = ['id', 'token', 'playerId'] as const;

  declare id: CreationOptional<number>;
  declare token: string;
  declare playerId: ForeignKey<Player['id']>;

  declare static getAttrKeys: GetAttrKeysMethod<Token>;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'token',
  }
);

export default Token;
