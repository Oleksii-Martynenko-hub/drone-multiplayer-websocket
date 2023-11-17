import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);

app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws, req) {
  setInterval(() => {
    ws.ping();
  }, 20000);
  console.log('req.url', req.url);
  console.log('req.headers', req.headers);

  console.info('connected');
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    console.log('data', data);

    ws.send('I received: ' + data);
  });
});

app.post('/init', (req, res) => {
  const playerName = req.body.name;
  const gameComplexity = req.body.complexity;

  res.json({ playerName, gameComplexity });
});

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
