import express from 'express';

import { playerController } from '../controllers/player.controller';

const router = express.Router();

router.get('/', playerController.getPlayerByName);

export default router;
