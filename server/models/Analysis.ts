import mongoose, { Document, HookSyncCallback, Schema, Types } from 'mongoose';
import { ReportInterface } from './Report';
import { doesNotReject } from 'assert';

export interface AnalysisInterface extends Document {
  title: string;
  description: string;
  report: ReportInterface;
  comments: Types.DocumentArray<Comment>;
  created: Date;
}

export interface Comment extends Document {
  user_id: string;
  name: string;
  content: string;
  created: Date;
  modified: Date;
}

const CommentSchema = new Schema <Comment>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  name: {
    required: true,
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  created: Date,
  modified: Date,
});

const AnalysisSchema = new Schema<AnalysisInterface>({
  title: String,
  description: String,
  report: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'report',
  },
  comments: [CommentSchema],
  created: Date,
});

const AnalysisModel = mongoose.model<AnalysisInterface>('analysis', AnalysisSchema, 'analyses');

export default AnalysisModel;
