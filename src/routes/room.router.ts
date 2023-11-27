import express from 'express';

import { roomController } from '../controllers/room.controller';

const router = express.Router();

router.get('/', roomController.getRoomById);

router.post('/', roomController.postCreateRoom);

export default router;
