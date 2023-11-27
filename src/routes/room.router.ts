import express from 'express';

import Player from '../models/player.model';
import Room from '../models/room.model';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const roomId = req.query.roomId as string;

    const room = await Room.findByPk(roomId, {
      attributes: Room.getAttrKeys(['complexity']),
      include: {
        model: Player,
        as: Room.includePlayersAlias,
        attributes: Player.getAttrKeys(['roomId']),
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ data: room.dataValues });
  } catch (error) {
    console.log('🚀 ~ router.get "/room" ~ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const playerId = req.body.playerId;

    const player = await Player.findOne({
      where: { id: playerId },
      include: {
        model: Room,
        as: Player.includeRoomAlias,
        attributes: Room.getAttrKeys(['maxPlayers', 'ownerId']),
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
    console.log('🚀 ~ router.post ~ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
