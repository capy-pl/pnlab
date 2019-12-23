import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { Logger } from '../../core/util';
import { Analysis, Report } from '../../models';
import { AnalysisInterface, Comment } from '../../models/Analysis';
import { UserSchemaInterface } from '../../models/User';

/**
 * Add an analysis.
 * @api POST /api/analysis Add an Analysis
 * @apiName AddAnalysis
 * @apiGroup Analysis
 * @apiSuccess (201) The analysis has been created.
 * @apiError (400) Required request body param is missing or invalid.
 * @apiError (404) The report is not found.
 */
export async function AddAnalysis(req: Request, res: Response, next): Promise<void> {
  const { body } = req;
  if (!(body.report && Types.ObjectId.isValid(body.report))) {
    Logger.error(new Error(`${body.report} is empty or not a valid ObjectID.`));
    res.status(400).send({ message: 'Id is empty or invalid.' });
    return;
  }

  try {
    const report = await Report.findById(body.report);
    if (!report) {
      const errMessage = `Report ${body.report} not found.`;
      Logger.error(new Error(errMessage));
      res.status(404).send({ message: errMessage });
      return;
    }

    const analysis = new Analysis(body);
    if (!analysis.title) {
      analysis.title = '未命名的分析';
    }
    analysis.created = new Date();
    analysis.modified = new Date();
    await analysis.save();
    res.status(201).send({ id: analysis._id });
  } catch (err) {
    return next(err);
  }
}

interface GetCollectionQuery {
  page?: string;
  limit?: string;
}

/**
 * Get analyses list.
 * @api GET /api/analysis Get analyses preview.
 * @apiName GetAnalyses
 * @apiGroup Analysis
 * @apiDescription
 * Get an review of analyses. The return order is
 * descending based on created date. Page and limit
 * rule is the same as report. If page and limit is not
 * provided, only latest 50 records will be returned.
 *
 * @apiSuccess (200) The analysis has been created.
 */
export async function GetAnalyses(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const query = req.query as GetCollectionQuery;
  const { page, limit } = query;
  try {
    if (page && limit) {
      const collection = await Analysis.find(
        {},
        {
          title: 1,
          created: 1,
          modified: 1,
          description: 1,
        },
      )
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .sort({ created: -1 });
      res.send(collection);
    } else {
      const collection = await Analysis.find(
        {},
        {
          title: 1,
          created: 1,
          description: 1,
        },
      )
        .sort({ created: -1 })
        .limit(50);
      res.send(collection);
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Get single analysis.
 * @api GET /api/analysis/:id
 * @apiName GetAnalysis
 * @apiGroup Analysis
 * @apiParam id {String} The analysis's id.
 * @apiSuccess (200)
 * @apiFail (404) The analysis is not found(handle by middleware).
 */
export async function GetAnalysis(req: Request, res: Response): Promise<void> {
  res.send(req.object);
}

/**
 * Modify analysis.
 * @api PUT /api/analysis/:id
 * @apiName ModifyAnalysis
 * @apiGroup Analysis
 * @apiParam id {String} The analysis's id.
 * @apiSuccess (200)
 * @apiFail (404) The analysis is not found(handle by middleware).
 */
export async function ModifyAnalysis(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const body = req.body;
  const analysis = req.object as AnalysisInterface;

  try {
    analysis.set(body);
    await analysis.save();
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
}

export async function DeleteAnalysis(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  try {
    await analysis.remove();
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
}

export async function AddAnalysisComment(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  const user = req.user as UserSchemaInterface;
  const body = req.body as Comment;
  body.created = new Date();
  body.modified = new Date();
  body.name = user.name;
  body.userId = user._id;
  try {
    analysis.comments.push(body);
    await analysis.save();
    res.status(200).end();
  } catch (err) {
    Logger.error(err);
    res.status(422).end();
  }
}

export async function GetAnalysisComment(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  const commentId = req.params.comment_id as string;
  const comment = analysis.comments.id(commentId);
  if (comment) {
    res.send(comment);
  } else {
    Logger.error(
      new Error(`Comment ${commentId} not found in Analysis ${analysis._id}.`),
    );
    res.status(404).end();
  }
}

export async function ModifyAnalysisComment(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  const commentId = req.params.comment_id as string;
  const comment = analysis.comments.id(commentId);
  const { body } = req;
  if (!comment) {
    Logger.error(
      new Error(`Comment ${commentId} not found in Analysis ${analysis._id}.`),
    );
    res.status(404).end();
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).end();
  }

  try {
    comment.set(body);
    await analysis.save();
    res.status(200).end();
  } catch (err) {
    Logger.error(err);
    res.status(422).end();
  }
}

export async function DeleteAnalysisComment(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  const commentId = req.params.comment_id as string;
  const comment = analysis.comments.id(commentId);
  if (!comment) {
    Logger.error(
      new Error(`Comment ${commentId} not found in Analysis ${analysis._id}.`),
    );
    res.status(404).end();
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).end();
  }

  try {
    analysis.comments.id(commentId).remove();
    await analysis.save();
    res.status(200).end();
  } catch (err) {
    Logger.error(err);
    res.status(422).end();
  }
}
