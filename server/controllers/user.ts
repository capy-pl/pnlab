import e from 'express';

export function Info(req: e.Request, res: e.Response, next: e.NextFunction): void {
  const { user } = req;
  res.send(user);
}
