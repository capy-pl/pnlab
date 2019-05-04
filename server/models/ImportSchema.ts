import mongoose, { Schema } from 'mongoose';

interface SchemaField {
  name: string;
  type: 'string' | 'int' | 'date' | 'float';
}

export interface ImportSchemaType {
  amountColName: string;
  transactionCustomFields: SchemaField[];
  itemColName: string;
  itemCustomFields: SchemaField[];
  transactionColName: string;
}

const FieldSchema = new Schema<SchemaField>({
  name: String,
  type: {
    enum: ['string', 'date', 'int', 'float'],
    type: String,
  },
});

const ImportSchemaSche = new Schema<ImportSchemaType>({
  amountColName: FieldSchema,
  transactionCustomFields: [FieldSchema],
  itemColName: FieldSchema,
  itemCustomFields: [FieldSchema],
  transactionColName: FieldSchema,
});

export default ImportSchemaSche;
