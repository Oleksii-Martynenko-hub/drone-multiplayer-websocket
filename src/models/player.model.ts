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

// export type Point = {
//   x: number;
//   y: number;
// };

// export class Player {
//   protected isReady = false;
//   protected position: Point = { x: 0, y: 0 };

//   constructor(
//     protected readonly ws: WebSocket,
//     protected readonly playerId: string
//   ) {}

//   setPlayerReady() {
//     this.isReady = true;
//   }

//   getIsPlayerReady() {
//     return this.isReady;
//   }

//   getId() {
//     return this.playerId;
//   }

//   send(body: WebSocketBody) {
//     this.ws.send(JSON.stringify(body));
//   }
// }
