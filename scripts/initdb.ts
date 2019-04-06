import dotenv from 'dotenv';
import connectMongo from '../server/core/db';
import { User, Organization } from '../server/models';

dotenv.config();

(async () => {
  const connection = await connectMongo();
  if (connection) {
    // drop users
    try {
      await connection.dropCollection('users');
    } catch (err) {
      console.log('No default users collection, continue.');
    }
    // drop organization
    try {
      await connection.dropCollection('orgs');
    } catch (err) {
      console.log('No default users collection, continue.');
    }
    const defaultOrg = new Organization({ name: 'nccu', dbName: 'nccu' });
    await defaultOrg.save();
    const admin = new User({ email: 'admin@gmail.com', org: defaultOrg });
    await admin.setPassword('admin');
    await admin.save();
    console.log('Default user has been created.');
    await connection.close();
    console.log('Close mongo connection');
  }
})();

// const Database = require('arangojs').Database;

// require('dotenv').config();

// const arangoDB = new Database({
//   url: process.env.ARANGO_DB_PATH,
// });

// const collections = [];

// arangoDB.listDatabases()
//   .then(async (list) => {
//     if (list.indexOf(process.env.ARANGO_DB_NAME) !== -1) {
//       await arangoDB.dropDatabase(process.env.ARANGO_DB_NAME);
//     }
//     return arangoDB.createDatabase(process.env.ARANGO_DB_NAME);
//   })
//   .then(() => {
//     arangoDB.useDatabase(process.env.ARANGO_DB_NAME);
//     return Promise.all(collections.map((name) => {
//       const collection = arangoDB.collection(name);
//       return collection.create();
//     }));
//   })
//   .then(() => {
//     console.log('Init ArrangoDB successfully.');
//   })
//   .catch(err => {
//     console.error(err);
//   });
