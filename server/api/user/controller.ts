import e from 'express';

/**
 * Get user info.
 * @api /user/info
 * @method GET
 * @apiName Info
 * @apiGroup User
 * @response 200
 * @response 401
 */
export function Info(req: e.Request, res: e.Response, next: e.NextFunction): void {
  try {
    const { user } = req;
    res.send(user);
  } catch (err) {
    return next(err);
  }
}
