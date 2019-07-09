import dotenv from 'dotenv';
import connectMongo from '../server/core/db';
import { Logger } from '../server/core/util';

import {
  Organization,
  Transactinos,
  User,
} from '../server/models';
import {
  ImportSchemaInterface,
} from '../server/models/ImportSchema';
dotenv.config();

(async () => {
  const connection = await connectMongo();
  if (connection) {
    // drop users
    try {
      await connection.dropCollection('users');
    } catch (err) {
      Logger.log('No default users collection, continue.');
    }

    // drop organization
    try {
      await connection.dropCollection('orgs');
    } catch (err) {
      Logger.log('No default users collection, continue.');
    }

    try {
      await connection.dropCollection('reports');
    } catch (err) {
      Logger.log('No default report, continue.');
    }

    const defaultSchema: ImportSchemaInterface = {
      transactionFields: [{
        name: '餐別帶',
        type: 'string',
      }, {
        name: '縣市別',
        type: 'string',
      }, {
        name: '主商圈',
        type: 'string',
      }, {
        name: '資料日期與時間',
        type: 'date',
      }],
      amountName: '交易金額',
      itemName: '單品名稱',
      transactionName: '交易id',
      itemFields: [],
    };

    for (const field of defaultSchema.transactionFields) {
      if (field.type === 'string') {
        const values = await connection.db.collection('transactions')
          .distinct(field.name, {});
        field.values = values;
      }
      if (field.type === 'date') {
        const [max] = await connection.db.collection('transactions')
        .find<Transactinos>({})
        .sort({[field.name]: -1})
        .limit(1)
        .project({
          [field.name]: 1,
        })
        .toArray();
        const [min] = await connection.db.collection('transactions')
        .find<Transactinos>({})
        .sort({[field.name]: 1})
        .limit(1)
        .project({
          [field.name]: 1,
        })
        .toArray();
        field.values = [new Date(min[field.name]).toISOString(), new Date(max[field.name]).toISOString()];
      }
    }

    const defaultOrg = new Organization({
      name: 'nccu',
      dbName: 'nccu',
      importSchema: defaultSchema,
    });

    await defaultOrg.save();

    const admin = new User({
      email: 'admin@gmail.com',
      name: 'admin',
      org: defaultOrg,
    });
    await admin.setPassword('admin');
    await admin.save();
    Logger.log('Default user has been created.');
    await connection.close();
    Logger.log('Close mongo connection');
  }
})();
