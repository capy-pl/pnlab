import { DocumentCollection } from 'arangojs/lib/cjs/collection';
import arangoDB from './db/arango';

export default class Model {
  public collectionName!: string;
  public collection: DocumentCollection;
  constructor() {
    this.collection = arangoDB.collection(this.collectionName);
  }
}
