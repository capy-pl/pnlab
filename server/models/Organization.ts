import mongoose, { Document, Schema } from 'mongoose';
import ImportSchema, { ImportSchemaInterface } from './ImportSchema';

export interface OrgSchema extends Document {
  dbName: string;
  importSchema: ImportSchemaInterface;
  name: string;
}

const OrgSchema = new Schema<OrgSchema>({
  dbName: String,
  importSchema: ImportSchema,
  name: String,
});

const Organization = mongoose.model<OrgSchema>('Org', OrgSchema);

export default Organization;
