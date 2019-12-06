import e from 'express';
import fs from 'fs';

export default function serveGzip(contentType: string, staticPath: string) {
  return (req: e.Request, res: e.Response, next: e.NextFunction) => {
    // does browser support gzip? does the file exist?
    const acceptedEncodings = req.acceptsEncodings();
    const paths = req.url.split('/');
    const fineName = paths[paths.length - 1];

    if (
      acceptedEncodings.indexOf('gzip') === -1 ||
      !fs.existsSync(`${staticPath}/${fineName}.gz`)
    ) {
      next();
      return;
    }

    req.url = `${req.url}.gz`;

    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', contentType);

    next();
  };
}
