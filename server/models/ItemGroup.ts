import mongoose, { Schema } from 'mongoose';

export interface ItemGroupInterface {
  items: string[];
  name: string;
  startTime: Date;
  endTime: Date;
}

const ItemGroupSchema = new Schema<ItemGroupInterface>({
  items: {
    type: [String]
  },
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
});

const ItemGroup =  mongoose.model('group', ItemGroupSchema);

export default ItemGroup;
