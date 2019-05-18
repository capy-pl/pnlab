import mongoose, { Schema } from 'mongoose';
import ImportSchema, { ImportSchemaInterface } from './ImportSchema';

interface OrgSchema {
  dbName: string;
  importSchema: ImportSchemaInterface;
  name: string;
}

const OrgSchema = new Schema<OrgSchema>({
  dbName: String,
  importSchema: ImportSchema,
  name: String,
});

const Organization = mongoose.model('Org', OrgSchema);

export default Organization;
