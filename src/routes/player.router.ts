import express from 'express';

import { playerController } from '../controllers/player.controller';

const router = express.Router();

router.post('/', playerController.postCreatePlayer);

router.get('/', playerController.getPlayerByName);

export default router;
