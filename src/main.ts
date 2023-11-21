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

app.post('/init', (req, res) => {
  const playerName = req.body.name;
  const gameComplexity = req.body.complexity;

  res.json({ playerName, gameComplexity });
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
