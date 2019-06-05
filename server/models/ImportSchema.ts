import mongoose, { Schema } from 'mongoose';

export interface FieldSchemaInterface {
  name: string;
  type: 'string' | 'int' | 'date' | 'float';
  values?: string[] | Date[];
}

export interface ImportSchemaInterface {
  amountName: string;
  transactionFields: FieldSchemaInterface[];
  itemName: string;
  itemFields: FieldSchemaInterface[];
  transactionName: string;
}

const FieldSchema = new Schema<FieldSchemaInterface>({
  name: String,
  type: {
    enum: ['string', 'date', 'int', 'float'],
    type: String,
  },
  values: {
    type: [String]
  }
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
