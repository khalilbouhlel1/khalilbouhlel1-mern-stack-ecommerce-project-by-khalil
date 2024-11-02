import express from 'express';
import { subscribe, sendNewsToSubscribers } from '../controllers/newsletterController.js';
import { newsletterLimiter } from '../middlewares/ratelimit.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/subscribe', newsletterLimiter, subscribe);
router.post('/send', isAdmin, sendNewsToSubscribers);

export default router;