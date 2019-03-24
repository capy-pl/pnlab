const Database = require('arangojs').Database;

require('dotenv').config();

const arangoDB = new Database({
  url: process.env.ARANGO_DB_PATH,
});

const collections = ['users'];
arangoDB.dropDatabase(process.env.ARANGO_DB_NAME)
  .then(() => {
    return arangoDB.createDatabase(process.env.ARANGO_DB_NAME);
  })
  .then(() => {
    arangoDB.useDatabase(process.env.ARANGO_DB_NAME);
    return Promise.all(collections.map((name) => {
      const collection = arangoDB.collection(name);
      return collection.create();
    }));
  })
  .then(() => {
    console.log('Init ArrangoDB successfully.');
  })
  .catch(err => {
    console.error(err);
  });