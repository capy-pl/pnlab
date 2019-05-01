import dotenv from 'dotenv';
import connectMongo from '../server/core/db';
import { Organization, User } from '../server/models';

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
