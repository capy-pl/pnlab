import e, { NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

import { getChannel } from '../../core/mq';
import ImportHistory, { ImportHistoryInterface } from '../../models/ImportHistory';
import Action from '../../models/Action';
import { Logger } from '../../core/util';

/**
 * Upload a file.
 * @api POST /api/upload Upload a file.
 * @apiName UploadFile
 * @apiGroup Upload
 * @apiSuccess (200)
 * @response (403) Cannot delete the report because it is referenced by other analysis.
 * @response (404) Not found
 */
export async function UploadFile(
  req: e.Request,
  res: e.Response,
  next: NextFunction,
): Promise<void> {
  const files = req.files;
  if (files) {
    const file = files.file as fileUpload.UploadedFile;

    const { md5 } = file;

    const hasDuplicate = await ImportHistory.findOne({ md5 });

    if (hasDuplicate) {
      // If it is a duplicate file, remove the temporary file.
      fs.unlink(file.tempFilePath, (err) => {
        if (err) {
          return next(err);
        }
        res.status(400).send('Duplicate files.');
      });
      return;
    }

    const { name, dir } = path.parse(file.tempFilePath);
    const action = new Action({
      type: 'import',
      created: new Date(),
      modified: new Date(),
      status: 'pending',
    });

    const history = new ImportHistory({
      filepath: dir,
      filename: name,
      fileSize: file.size,
      originFilename: file.name,
      md5,
      status: 'pending',
      created: new Date(),
      modified: new Date(),
    });

    await history.save();
    res.json({ id: history.id });

    action.targetId = history.id;
    await action.save();

    const channel = getChannel();
    channel.sendToQueue('pn', Buffer.from(action.id));
  } else {
    return res.status(400).end();
  }
  res.status(200).end();
}

/**
 * Delete an unused report.
 * @api /api/report/<id>
 * @method DELETE
 * @apiName DeleteReport
 * @apiGroup Report
 * @apiParam {string} id
 * @apiSuccess (200)
 * @response (403) Cannot delete the report because it is referenced by other analysis.
 * @response (404) Not found
 */
export async function GetUploadHistories(req: e.Request, res: e.Response): Promise<void> {
  const { page, limit } = req.query;
  if (page && limit) {
    const histories = await ImportHistory.find({})
      .sort({ created: -1 })
      .skip(parseInt(limit) * (parseInt(page) - 1))
      .limit(parseInt(limit));
    res.send(histories);
  } else {
    const histories = await ImportHistory.find({})
      .sort({ created: -1 })
      .limit(50);
    res.send(histories);
  }
}

/**
 * @deprecated
 */
export async function DeleteUploadFile(req: e.Request, res: e.Response): Promise<void> {
  const obj = req.object as ImportHistoryInterface;
  if (obj.status === 'pending') {
    res.status(400).send('The file is still waiting for processing.');
    return;
  }
  fs.unlink(path.resolve(obj.filepath, obj.filename), (err) => {
    if (err) {
      res.status(500).end();
      return;
    }
    res.status(200).end();
  });
}
