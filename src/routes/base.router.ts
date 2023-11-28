import express from 'express';

import { baseController } from '../controllers/base.controller';

const router = express.Router();

router.post('/init', baseController.postInitSinglePlayerSession);

router.get('/token/:chunk', baseController.getTokenChunkByPlayerId);

export default router;
