import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import sequelize from './database/db';

import './models/associations';

import playerRouter from './routes/player.router';
import roomRouter from './routes/room.router';
import baseRouter from './routes/base.router';

import Player from './models/player.model';
import Token from './models/token.model';

const app = express();
const server = createServer(app);

app.use(express.json());

app.use('/', baseRouter);
app.use('/player', playerRouter);
app.use('/room', roomRouter);

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
  if (!req.url.includes('/cave')) {
    ws.close(1008, 'Invalid URL');
    return;
  }

  console.info('connected');
  ws.on('error', console.error);

  ws.on('message', async function message(rawData) {
    try {
      const data = rawData.toString() as string;

      const playerId = data.substring(data.indexOf(':') + 1, data.indexOf('-'));
      const rawToken = data.substring(data.indexOf('-') + 1, data.length);

      const player = (await Player.findByPk(playerId, {
        include: Player.includeTokenAlias,
      })) as Player & { token: Token };
      if (!player) {
        throw Error(`Player with id: ${playerId} not found`);
      }

      if (player.token.token !== rawToken) {
        throw Error(`Token not match`);
      }

      let i = 0;

      const interval = setInterval(() => {
        ws.send(Math.random().toFixed(3));
        i++;
        if (i > 100) {
          clearInterval(interval);
          ws.send('finished');
          ws.close();
        }
      }, 10);
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

function send(ws, params: object) {
  ws.send(JSON.stringify(params));
}

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
