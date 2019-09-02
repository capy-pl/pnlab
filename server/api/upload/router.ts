import path from 'path';
import { Router } from 'express';
import fileUpload from 'express-fileupload';

import { checkExist, httpMethodNotSupport, Pager } from '../../core/middleware';
import { loginRequired } from '../../core/auth';
import ImportHistory from '../../models/ImportHistory';
import { UploadFile, GetUploadHistories } from './controller';

const router = Router();

router
  .route('/')
  .all(loginRequired)
  .post(
    fileUpload({
      useTempFiles: true,
      tempFileDir: path.resolve(process.env.HOME, 'pnlab', 'temp'),
      abortOnLimit: true,
      limits: {
        // Maximum upload size equals to 2GB.
        fileSize: 2 * Math.pow(2, 30),
      },
    }),
    UploadFile,
  )
  .get(GetUploadHistories)
  .all(httpMethodNotSupport);

router
  .route('/page')
  .all(loginRequired)
  .get(Pager(ImportHistory))
  .all(httpMethodNotSupport);

router
  .route('/:id/delete')
  .all(loginRequired, checkExist(ImportHistory))
  .delete();

export default router;
