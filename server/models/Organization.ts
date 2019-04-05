import mongoose, { Schema } from 'mongoose';
import ImportSchema, { ImportSchemaType } from './ImportSchema';

interface OrgSchema {
  dbName: string;
  importSchema: ImportSchemaType;
  name: string;
}

const OrgSchema = new Schema<OrgSchema>({
  dbName: String,
  importSchema: ImportSchema,
  name: String,
});

const Organization = mongoose.model('org', OrgSchema);

export default Organization;
