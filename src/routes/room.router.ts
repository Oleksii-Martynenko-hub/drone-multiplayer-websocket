import express from 'express';

import { roomController } from '../controllers/room.controller';

const router = express.Router();

router
  .get('/', roomController.getRoomById)
  .post('/', roomController.postCreateRoom);

export default router;
