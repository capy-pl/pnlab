import mongoose, { Document, Schema } from 'mongoose';

type MigrationStatus = 'success' | 'failed';

interface MigrationInterface extends Document {
  version: number;
  applyStatus: MigrationStatus;
  applyDate: Date;
}

const MigrationSchema = new Schema<MigrationInterface>({
  version: Number,
  applyStatus: String,
  applyDate: Date,
});

export default mongoose.model<MigrationInterface>('migration', MigrationSchema);
