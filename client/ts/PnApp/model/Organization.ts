export type FieldType = 'string' | 'int' | 'date' | 'float' | 'promotion' | 'method';
export type FieldBelong = 'transaction' | 'item' | 'promotion' | 'method';
export type FieldAction = 'delete' | 'reserve';

export interface Field {
  name: string;
  // type promotion cannot be saved and is only for return conditions.
  type: FieldType;
  belong: FieldBelong;
  values?: string[] | Date[];
  actions: FieldAction[];
}

export interface ImportSchema {
  amountName: string;
  transactionFields: Field[];
  itemName: string;
  itemFields: Field[];
  transactionName: string;
  transactionTime: string;
}

export default interface Organization {
  _id: string;
  dbName: string;
  name: string;
  importSchema: ImportSchema;
}
