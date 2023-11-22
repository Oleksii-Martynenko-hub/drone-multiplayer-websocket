import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasOneCreateAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../database/db';
import Room from './room.model';

class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  static readonly attrs = ['id', 'name', 'roomId'] as const;
  static readonly roomForeignKey = 'ownerId';
  static readonly includeRoomAlias = 'room';

  declare id: CreationOptional<number>;
  declare roomId: ForeignKey<Room['id']>;
  declare name: string;

  declare createRoom: HasOneCreateAssociationMixin<Room>;

  static getAttributesKeys(except?: ReturnType<typeof this.attrs.slice>) {
    if (Array.isArray(except)) {
      return this.attrs.filter((key) => !except.includes(key)) as string[];
    }
    return this.attrs as unknown as string[];
  }
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
