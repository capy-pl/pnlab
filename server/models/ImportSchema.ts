import { Schema } from 'mongoose';

export type FieldSchemaType =
  | 'string'
  | 'int'
  | 'date'
  | 'float'
  | 'promotion'
  | 'method';
export type FieldSchemaBelong = 'transaction' | 'item' | 'promotion' | 'method';
export type FieldSchemaAction = 'delete' | 'reserve';

export interface FieldSchemaInterface {
  name: string;
  // type promotion cannot be saved and is only for return conditions.
  type: FieldSchemaType;
  belong: FieldSchemaBelong;
  values?: string[] | Date[];
  actions: FieldSchemaAction[];
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
  belong: {
    enum: ['promotion', 'transaction', 'item'],
    type: String,
  },
  actions: {
    type: [String],
  },
  values: {
    type: [String],
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
