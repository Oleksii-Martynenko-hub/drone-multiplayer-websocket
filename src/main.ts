import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import sequelize from './database/db';
import Player from '../src/models/player.model';
import Room from '../src/models/room.model';

import './models/associations';

const app = express();
const server = createServer(app);

app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

export type WebSocketBody<T extends object = object> = {
  type: 'create' | 'join' | 'leave' | 'ready' | 'start' | 'update';
  params: T;
};

export type EventParams<T extends 'create' | null = null> = {
  playerId: string;
} & (T extends 'create' ? Record<string, never> : Record<'roomId', string>);

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws, req) {
  console.log('req.url', req.url);
  console.log('req.headers', req.headers);

  console.info('connected');
  ws.on('error', console.error);

  ws.on('message', function message(rawData: string) {
    try {
      const data = JSON.parse(rawData) as WebSocketBody<EventParams>;
      console.log('data', data);
      const type = data.type;
      const params = data.params;

      const handlers = {
        create,
        join,
        ready,
        leave,
      };

      const eventHandler = handlers[type] ?? defaultHandler(type);

      eventHandler(ws, params);
    } catch (error) {
      const err = error as Error;

      if (err instanceof Error) {
        send(ws, {
          type: 'error',
          params: {
            message: err.message,
          },
        });
        console.warn(err.message);
        return;
      }

      send(ws, {
        type: 'error',
        params: { error },
      });
      console.warn(error);
    }
  });
});

function defaultHandler(type) {
  throw Error(`Type: ${type} unknown`);
}

function create(ws: WebSocket, { playerId }: EventParams<'create'>) {
}

function join(ws: WebSocket, { playerId, roomId }: EventParams) {
}

function ready(ws: WebSocket, { playerId, roomId }: EventParams) {
}
function leave(ws: WebSocket, { playerId, roomId }: EventParams) {
}

function send(ws, params: object) {
  ws.send(JSON.stringify(params));
}

app.post('/player', async (req, res) => {
  try {
    const playerName = req.body.name;

    const newPlayer = await Player.create({ name: playerName });

    res.json({ playerId: newPlayer.id });
  } catch (error) {
    console.log('🚀 ~ app.post "/player" ~ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/player', async (req, res) => {
  try {
    const playerName = req.query.name as string;

    const player = await Player.findOne({
      attributes: Player.getAttributesKeys(['roomId']),
      where: { name: playerName },
      include: {
        model: Room,
        as: Player.includeRoomAlias,
        attributes: [
          ...Room.getAttributesKeys(['complexity']),
          ['complexity', 'difficulty'],
        ],
      },
    });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ data: player.dataValues });
  } catch (error) {
    console.log('🚀 ~ app.get "/player" ~ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/room', async (req, res) => {
  try {
    const playerId = req.body.playerId;

    const player = await Player.findOne({
      where: { id: playerId },
      include: {
        model: Room,
        as: Player.includeRoomAlias,
        attributes: Room.getAttributesKeys(['maxPlayers', 'ownerId']),
      },
    });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    if (player.get('room')) {
      return res.status(404).json({ error: 'Player already have room' });
    }

    const room = await player.createRoom();
    await room.addPlayer(player);

    res.json({ roomId: room.id });
  } catch (error) {
    console.log('🚀 ~ app.post ~ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
