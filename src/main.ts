import { WebSocketServer } from 'ws';

import { Room } from './models/Room';

const port = process.env.PORT ? Number(process.env.PORT) : 8080;

type Data = {
  type: 'create' | 'join' | 'leave' | 'ready';
  params: object;
};

const rooms: Map<string, Room> = new Map();

const wss = new WebSocketServer({ port });

wss.on('connection', function connection(ws) {
  console.info('connected');
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    const obj = JSON.parse(data) as Data;
    console.log('data', obj);
    const type = obj.type;
    const params = obj.params;

    const handlers = {
      create,
      join,
      ready,
      leave,
    };

    const eventHandler = handlers[type] ?? defaultHandler(type);

    eventHandler(params);

    console.log('rooms', rooms);
  });

  function defaultHandler(type) {
    return () => {
      send(ws, { type: 'error', message: `Type: ${type} unknown` });
      console.warn(`Type: ${type} unknown`);
    };
  }

  function create(params) {
    const playerId = params.playerId;
    const room = new Room(ws, playerId);

    rooms.set(room.roomId, room);

    send(ws, { type: 'create', roomId: room });
  }

  function ready(params) {
  }

  function join(params) {
  }

  function leave(params) {
  }

  function close(roomId: string) {
    rooms.delete(roomId);
  }

  function send(ws, params: object) {
    ws.send(JSON.stringify(params));
  }
});

