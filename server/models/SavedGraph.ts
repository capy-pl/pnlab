import mongoose, { Schema } from 'mongoose';
import { ReportInterface } from './Report';
interface SavedGraphInterface {
  title: string;
  description: string;
  report: ReportInterface;
};

const SavedGraphSchema = new Schema<SavedGraphInterface>({
  title: String,
  description: String,
  report: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'report'
  }
});

const SavedGraph = mongoose.model('savedgraph', SavedGraphSchema);

export default SavedGraph;
