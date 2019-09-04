import dotenv from 'dotenv';
import connectMongo from '../server/core/db';
import { Logger } from '../server/core/util';
import { Organization, Transactinos } from '../server/models';

dotenv.config();

(async () => {
  const connection = await connectMongo();
  if (connection) {
    const org = await Organization.findOne({});
    if (org) {
      try {
        for (const field of org.importSchema.transactionFields) {
          if (field.type === 'string') {
            const values = await connection.db
              .collection('transactions')
              .distinct(field.name, {});
            field.values = values;
          }
          if (field.type === 'date') {
            const [max] = await connection.db
              .collection('transactions')
              .find<Transactinos>({})
              .sort({ [field.name]: -1 })
              .limit(1)
              .project({
                [field.name]: 1,
              })
              .toArray();
            const [min] = await connection.db
              .collection('transactions')
              .find<Transactinos>({})
              .sort({ [field.name]: 1 })
              .limit(1)
              .project({
                [field.name]: 1,
              })
              .toArray();
            field.values = [
              new Date(min[field.name]).toISOString(),
              new Date(max[field.name]).toISOString(),
            ];
          }
        }
        for (const field of org.importSchema.itemFields) {
          if (field.type === 'string') {
            const values = await connection.db
              .collection('items')
              .distinct(field.name, {});
            field.values = values;
          }
          await org.save();
        }
      } catch (err) {
        Logger.error(err);
        process.exit(1);
      }
    } else {
      Logger.error('Cannot not find org.');
    }
  } else {
    throw new Error('Connection failed.');
  }
  process.exit();
})();
