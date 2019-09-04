import mongoose, { Document, Schema } from 'mongoose';

type ActionType = 'report' | 'import';
type ActionStatus = 'pending' | 'success' | 'error';

interface ActionInterface extends Document {
  type: ActionType;
  targetId: string;
  status: ActionStatus;
  created: Date;
  modified: Date;
}

const ActionSchema = new Schema({
  type: {
    type: String,
    enum: ['report', 'import'],
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'error'],
  },
  targetId: String,
  created: Date,
  modified: Date,
});

export default mongoose.model<ActionInterface>('action', ActionSchema);
