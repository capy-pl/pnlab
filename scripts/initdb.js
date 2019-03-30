const Database = require('arangojs').Database;

require('dotenv').config();

const arangoDB = new Database({
  url: process.env.ARANGO_DB_PATH,
});

const collections = [];

arangoDB.listDatabases()
  .then(async (list) => {
    if (list.indexOf(process.env.ARANGO_DB_NAME) !== -1) {
      await arangoDB.dropDatabase(process.env.ARANGO_DB_NAME);
    }
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