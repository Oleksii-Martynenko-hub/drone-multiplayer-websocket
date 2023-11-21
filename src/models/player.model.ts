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
  declare id: CreationOptional<number>;
  declare roomId: ForeignKey<Room['id']>;
  declare name: string;

  declare createRoom: HasOneCreateAssociationMixin<Room>;
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
