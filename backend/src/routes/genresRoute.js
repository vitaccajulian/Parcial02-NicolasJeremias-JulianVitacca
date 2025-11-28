import express from 'express';
import { getAllGenres  } from '../controllers/dataController.js';

const router = express.Router();

router.get('/', getAllGenres);

export default router;