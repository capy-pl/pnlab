import mongoose, { Document, Schema } from 'mongoose';
import { ReportInterface } from './Report';
interface SavedGraphInterface extends Document {
  title: string;
  description: string;
  report: ReportInterface;
}

const SavedGraphSchema = new Schema<SavedGraphInterface>({
  title: String,
  description: String,
  report: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'report',
  },
});

const SavedGraph = mongoose.model<SavedGraphInterface>('savedgraph', SavedGraphSchema);

export default SavedGraph;
