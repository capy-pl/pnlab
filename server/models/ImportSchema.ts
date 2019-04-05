import mongoose, { Schema } from 'mongoose';

export interface ImportSchemaType {
  amountColName: string;
  edgeCustomFields: [string];
  itemColName: string;
  nodeCustomFields: [string];
  transactionColName: string;
}

const FieldSchema = new Schema({
  name: String,
  type: {
    enum: ['string', 'uint', 'int', 'float'],
    type: String,
  },
});

const ImportSchemaSche = new Schema<ImportSchemaType>({
  amountColName: FieldSchema,
  edgeCustomFields: [FieldSchema],
  itemColName: FieldSchema,
  nodeCustomFields: [FieldSchema],
  transactionColName: FieldSchema,
});

export default ImportSchemaSche;
