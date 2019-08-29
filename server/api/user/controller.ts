import e from 'express';

/**
 * Get user info.
 * @api /user/info
 * @method GET
 * @apiName Info
 * @apiGroup User
 */
export function Info(req: e.Request, res: e.Response): void {
  const { user } = req;
  res.send(user);
}
