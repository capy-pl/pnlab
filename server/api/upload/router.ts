import path from 'path';
import { Router } from 'express';
import fileUpload from 'express-fileupload';

import { httpMethodNotSupport } from '../../core/middleware';
import { loginRequired } from '../../core/auth';

import { UploadFile } from './controller';

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
  .all(httpMethodNotSupport);

export default router;
