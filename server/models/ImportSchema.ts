import mongoose, { Schema } from 'mongoose';

interface SchemaFieldType {
  name: string;
  type: 'string' | 'int' | 'date' | 'float';
}

export interface ImportSchemaType {
  amountColName: string;
  transactionCustomFields: SchemaFieldType[];
  itemColName: string;
  itemCustomFields: SchemaFieldType[];
  transactionColName: string;
}

const FieldSchema = new Schema<SchemaFieldType>({
  name: String,
  type: {
    enum: ['string', 'date', 'int', 'float'],
    type: String,
  },
});

const ImportSchema = new Schema<ImportSchemaType>({
  amountColName: {
    type: String,
    required: true
  },
  transactionCustomFields: [FieldSchema],
  itemColName: {
    type: String,
    required: true
  },
  itemCustomFields: [FieldSchema],
  transactionColName: {
    type: String,
    required: true
  },
});

export default ImportSchema;
