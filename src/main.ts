import { WebSocketServer } from 'ws';

import { RoomManager } from './models/room-manager';

const port = process.env.PORT ? Number(process.env.PORT) : 8080;

export type WebSocketBody<T extends object = object> = {
  type: 'create' | 'join' | 'leave' | 'ready';
  params: T;
};

const wss = new WebSocketServer({ port });

const roomsManager = new RoomManager(wss);

wss.on('connection', function connection(ws) {
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

  function defaultHandler(type) {
    return () => {
      send(ws, { type: 'error', message: `Type: ${type} unknown` });
      console.warn(`Type: ${type} unknown`);
    };
  }

  function create(params) {
    const playerId = params.playerId;
    roomsManager.createRoom(ws, playerId);
  }

  function ready(params) {
  }

  function join(params) {
  }

  function leave(params) {
  }

  function send(ws, params: object) {
    ws.send(JSON.stringify(params));
  }
});

