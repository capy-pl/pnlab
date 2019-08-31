import e from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

import { getChannel } from '../../core/mq';
import ImportHistory from '../../models/ImportHistory';
import Action from '../../models/Action';
import { Logger } from '../../core/util';

export async function UploadFile(req: e.Request, res: e.Response): Promise<void> {
  const files = req.files;
  if (files) {
    const file = files.file as fileUpload.UploadedFile;

    const { md5 } = files;

    const hasDuplicate = await ImportHistory.findOne({ md5 });

    if (hasDuplicate) {
      fs.unlink(file.tempFilePath, (err) => {
        if (err) {
          Logger.error(err);
        }
      });
      res.status(400).send('Duplicate files.');
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
      originFilename: file.name,
      type: 'pending',
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
