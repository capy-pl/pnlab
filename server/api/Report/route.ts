import { Router } from 'express';
import {
  SearchItem
} from './controller';

const router = Router();

router.get('/searchItem', SearchItem);

export default router;
