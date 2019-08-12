import { Request, Response } from 'express';

import { isNumber } from 'util';
import { Logger } from '../../core/util';
import { Analysis, Report } from '../../models';
import { AnalysisInterface, Comment } from '../../models/Analysis';
import { UserSchemaInterface } from '../../models/User';

export async function AddAnalysis(req: Request, res: Response): Promise<void> {
  const { body } = req;
  try {
    await Report.findById(body.report);
  } catch (err) {
    Logger.error(err);
    res.status(404).send({ message: `Report ${body.report} not found.` });
  }

  try {
    const analysis = new Analysis(body);
    if (!analysis.title) {
      analysis.title = '未命名的分析';
    }
    analysis.created = new Date();
    await analysis.save();
    res.status(201).send({ id: analysis._id });
  } catch (err) {
    Logger.error(err);
    res.send({ error: err.message });
  }
}

interface GetCollectionQuery {
  from?: number;
  limit?: number;
}

export async function GetAnalyses(req: Request, res: Response): Promise<void> {
  const query = req.query as GetCollectionQuery;
  const { from, limit } = query;
  try {
    if (from && limit && isNumber(from) && isNumber(limit)) {
      const collection = await Analysis.find({}, {
        title: 1,
        created: -1,
      }).skip(from).limit(limit);
      res.send(collection);
    } else {
      const collection = await Analysis.find({}, {
        title: 1,
        created: -1,
      });
      res.send(collection);
    }
  } catch (err) {
    Logger.error(err);
    res.status(400).end();
  }
}

export async function GetAnalysis(req: Request, res: Response): Promise<void> {
  res.send(req.object);
}

export async function ModifyAnalysis(req: Request, res: Response): Promise<void> {
  const body = req.body;
  const analysis = req.object as AnalysisInterface;
  analysis.set(body);
  try {
    await analysis.save();
    res.status(200).end();
  } catch (err) {
    Logger.error(err);
    res.status(422).send({ message: err.message });
  }
}

export async function DeleteAnalysis(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  try {
    await analysis.remove();
    res.status(200).end();
  } catch (err) {
    Logger.error(err);
    res.status(400).end();
  }
}

export async function AddAnalysisComment(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  const user = req.user as UserSchemaInterface;
  const body = req.body as Comment;
  body.created = new Date();
  body.modified = new Date();
  body.name = user.name;
  body.user_id = user._id;
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
    Logger.error(new Error(`Comment ${commentId} not found in Analysis ${analysis._id}.`));
    res.status(404).end();
  }
}

export async function ModifyAnalysisComment(req: Request, res: Response): Promise<void> {
  const analysis = req.object as AnalysisInterface;
  const commentId = req.params.comment_id as string;
  const comment = analysis.comments.id(commentId);
  const { body } = req;
  if (!comment) {
    Logger.error(new Error(`Comment ${commentId} not found in Analysis ${analysis._id}.`));
    res.status(404).end();
  }

  if (comment.user_id.toString() !== req.user._id.toString()) {
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
    Logger.error(new Error(`Comment ${commentId} not found in Analysis ${analysis._id}.`));
    res.status(404).end();
  }

  if (comment.user_id.toString() !== req.user._id.toString()) {
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
