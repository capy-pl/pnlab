import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryInterface extends Document {
  items: string[];
  name: string;
  startTime?: Date;
  endTime?: Date;
}

const CategorySchema = new Schema<CategoryInterface>({
  items: {
    type: [String],
  },
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
});

const Category = mongoose.model<CategoryInterface>('group', CategorySchema);

export default Category;
