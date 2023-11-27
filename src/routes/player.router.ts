import express from 'express';

import Player from '../models/player.model';
import Room from '../models/room.model';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const playerName = req.body.name;

    const newPlayer = await Player.create({ name: playerName });

    res.json({ playerId: newPlayer.id });
  } catch (error) {
    console.log('🚀 ~ router.post "/player" ~ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const playerName = req.query.name as string;

    const player = await Player.findOne({
      attributes: Player.getAttrKeys(['roomId']),
      where: { name: playerName },
      include: {
        model: Room,
        as: Player.includeRoomAlias,
        attributes: [
          ...Room.getAttrKeys(['complexity']),
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

export default router;
