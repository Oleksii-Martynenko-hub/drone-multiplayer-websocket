import express from 'express';

import { authController } from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.get('/logout', authController.getLogout);

export default router;
