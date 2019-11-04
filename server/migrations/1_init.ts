import mongoose from 'mongoose';
import { Logger } from '../core/util';
import { Organization, User } from '../models';
import { ImportSchemaInterface } from '../models/ImportSchema';
import Migration from '../core/migration';

export default class MigrationInit1 implements Migration {
  public readonly version: number = 1;
  public async apply() {
    const { connection } = mongoose;
    if (connection) {
      const defaultSchema: ImportSchemaInterface = {
        transactionTime: '資料日期',
        transactionFields: [
          {
            name: '餐別帶',
            type: 'string',
            belong: 'transaction',
            actions: ['reserve'],
            values: [],
          },
          {
            name: '縣市別',
            type: 'string',
            belong: 'transaction',
            actions: ['reserve'],
            values: [],
          },
          {
            name: '主商圈',
            type: 'string',
            belong: 'transaction',
            actions: ['reserve'],
            values: [],
          },
          {
            name: '資料日期',
            type: 'date',
            belong: 'transaction',
            actions: ['reserve'],
            values: [],
          },
        ],
        amountName: '交易金額',
        itemName: '單品名稱',
        transactionName: '交易id',
        itemFields: [
          {
            name: '品號-品名稱',
            type: 'string',
            belong: 'item',
            actions: ['reserve'],
            values: [],
          },
          {
            name: '群號-群名稱',
            type: 'string',
            belong: 'item',
            actions: ['reserve'],
            values: [],
          },
          {
            name: '銷售單價',
            type: 'int',
            belong: 'item',
            actions: ['reserve'],
            values: [],
          },
          {
            name: '銷售數量',
            type: 'int',
            belong: 'item',
            actions: ['reserve'],
            values: [],
          },
        ],
      };

      const defaultOrg = new Organization({
        name: 'nccu',
        dbName: 'nccu',
        importSchema: defaultSchema,
      });

      await defaultOrg.save();

      try {
        await connection.db.createCollection('items');
        Logger.info('Collection items created.');
      } catch (err) {
        Logger.info('Collection items alread exist.');
      }

      try {
        Logger.info('Create unique index for item name.');
        await connection.db.collection('items').createIndex(defaultSchema.itemName, {
          unique: true,
          dropDups: true,
        });
      } catch (err) {
        Logger.error(err);
      }

      try {
        Logger.info('Create unique index for transactions id.');
        await connection.db
          .collection('transactions')
          .createIndex(defaultSchema.transactionName, {
            unique: true,
            dropDups: true,
          });
      } catch (err) {
        Logger.error(err);
      }

      const admin = new User({
        email: 'admin@gmail.com',
        name: 'admin',
        org: defaultOrg,
      });

      await admin.setPassword('admin');
      await admin.save();
      Logger.info('Default user has been created.');
    }
  }
}
