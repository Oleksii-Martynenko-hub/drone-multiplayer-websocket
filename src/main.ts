import { WebSocketServer } from 'ws';

const port = process.env.PORT ? Number(process.env.PORT) : 8080;

const wss = new WebSocketServer({ port });

wss.on('connection', function connection(ws) {
  console.info('connected');
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    console.log('data', data);
  });

});

