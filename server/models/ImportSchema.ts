import mongoose, { Schema } from 'mongoose';

interface SchemaField {
  name: string;
  type: 'string' | 'int' | 'date' | 'float';
}

export interface ImportSchemaInterface {
  amountName: string;
  transactionFields: SchemaField[];
  itemName: string;
  itemFields: SchemaField[];
  transactionName: string;
}

const FieldSchema = new Schema<SchemaField>({
  name: String,
  type: {
    enum: ['string', 'date', 'int', 'float'],
    type: String,
  },
});

const ImportSchema = new Schema<ImportSchemaInterface>({
  amountName: {
    type: String,
    required: true,
  },
  transactionFields: [FieldSchema],
  itemName: {
    type: String,
    required: true,
  },
  itemFields: [FieldSchema],
  transactionName: {
    type: String,
    required: true,
  },
});

export default ImportSchema;
