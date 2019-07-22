import mongoose, { Document, Schema } from 'mongoose';

export type PromotionType = 'combination' | 'direct';

export interface PromotionInterface extends Document {
  name: string;
  type: PromotionType;
  groupOne: string[];
  groupTwo?: string[];
  startTime: Date;
  endTime: Date;
}

const PromotionSchema = new Schema<PromotionInterface>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['combination', 'direct'],
  },
  groupOne: {
    type: [String],
    required: true,
  },
  groupTwo: [String],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('promotion', PromotionSchema);
