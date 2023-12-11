import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import sequelize from './database/db';

import './models/associations';

import { authMiddleware } from './middlewares/auth.middleware';

import playerRouter from './routes/player.router';
import roomRouter from './routes/room.router';
import authRouter from './routes/auth.router';

import Player from './models/player.model';
import Token from './models/token.model';
import Session from './models/session.model';

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: [
      'http://127.0.0.1:4200',
      'https://drone-through-cave-game.vercel.app',
    ],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/player', authMiddleware, playerRouter);
app.use('/room', authMiddleware, roomRouter);

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

  const pingInterval = setInterval(() => {
    ws.ping();
  }, 20000);

  setTimeout(() => {
    clearInterval(pingInterval);
  }, 1000 * 60 * 5);

  console.info('connected');
  ws.on('error', console.error);

  ws.on('message', async function message(rawData) {
    try {
      const data = rawData.toString() as string;

      const playerId = data.substring(data.indexOf(':') + 1, data.indexOf('-'));
      const rawToken = data.substring(data.indexOf('-') + 1, data.length);

      type PlayerType = Player & {
        [Player.includeTokenAlias]: Token;
        [Player.includeSessionsAlias]: Session[];
      };

      const player = (await Player.findByPk(playerId, {
        include: [Player.includeTokenAlias, Player.includeSessionsAlias],
      })) as PlayerType;

      if (!player) {
        throw Error(`Player with id: ${playerId} not found`);
      }

      if (player.token.token !== rawToken) {
        throw Error(`Token not match`);
      }

      if (!player.sessions || !player.sessions.length) {
        throw Error(`Player with id: ${playerId} doesn't have any session`);
      }
      const session = player.sessions[0];

      let i = 0;
      const caveWallsData = session.caveData.split(';');

      const interval = setInterval(() => {
        ws.send(caveWallsData[i] || '');

        i++;
        if (i >= caveWallsData.length) {
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
