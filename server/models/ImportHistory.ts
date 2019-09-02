import mongoose, { Document, Schema } from 'mongoose';

type ImportHistoryType = 'pending' | 'sucesss' | 'error';

export interface ImportHistoryInterface extends Document {
  filepath: string;
  filename: string;
  fileSize: number;
  originFilename: string;
  transactionNum: number;
  itemNum: number;
  created: Date;
  modified: Date;
  status: ImportHistoryType;
  errMessage?: string;
  md5: string;
}

const ImportHistorySchema = new Schema<ImportHistoryInterface>({
  filepath: String,
  filename: String,
  fileSize: Number,
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
  status: {
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
