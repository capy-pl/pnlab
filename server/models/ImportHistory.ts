import mongoose, { Document, Schema } from 'mongoose';

type ImportHistoryType = 'pending' | 'sucesss' | 'error';

interface ImportHistoryInterface extends Document {
  filepath: string;
  filename: string;
  originFilename: string;
  transactionNum: number;
  itemNum: number;
  created: Date;
  modified: Date;
  type: ImportHistoryType;
  errMessage?: string;
  md5: string;
}

const ImportHistorySchema = new Schema<ImportHistoryInterface>({
  filepath: String,
  filename: String,
  originFilename: String,
  md5: String,
  transactionNum: {
    type: Number,
    default: 0,
    required: false,
  },
  itemNum: {
    type: Number,
    required: false,
    default: 0,
  },
  type: {
    type: String,
    default: 'pending',
    enum: ['pending', 'success', 'error'],
  },
  modified: Date,
  created: Date,
  errMessage: {
    type: String,
    required: false,
  },
});

export default mongoose.model<ImportHistoryInterface>(
  'importHistory',
  ImportHistorySchema,
  'importHistories',
);
