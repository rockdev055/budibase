const couchdb = require("../../../../db");

const CLIENT_DB_ID = "client-testing";
const TEST_APP_ID = "test-app";

exports.destroyDatabase = couchdb.db.destroy;

exports.createModel = async instanceId => {
  const model = {
    "name": "TestModel",
    "type": "model",
    "key": "name",
    "schema": {
      "name": { "type": "string" }
    }
  }
  const db = couchdb.db.use(instanceId);
  const response = await db.insert(model);

  const designDoc = await db.get("_design/database");
  designDoc.views = {
    ...designDoc.views,
    [`all_${response.id}`]: {
      map: function(doc) {
        emit([doc.modelId], doc._id); 
      }
    }
  };
  await db.insert(designDoc, designDoc._id);

  return {
    ...response,
    ...model
  };
} 

exports.createClientDatabase = async () => {
  await couchdb.db.create(CLIENT_DB_ID);

  const db = couchdb.db.use(CLIENT_DB_ID);

  await db.insert({
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  }, '_design/client');

  await db.insert({
    _id: TEST_APP_ID,
    type: "app",
    instances: []
  });

  return CLIENT_DB_ID;
}

exports.destroyClientDatabase = async () => await couchdb.db.destroy(CLIENT_DB_ID);

exports.createInstanceDatabase = async instanceId => {
  await couchdb.db.create(instanceId);

  const db = couchdb.db.use(instanceId);

  await db.insert({
    metadata: {
      clientId: CLIENT_DB_ID,
      applicationId: TEST_APP_ID
    },
    views: { 
      by_type: { 
        map: function(doc) { 
          emit([doc.type], doc._id); 
        } 
      } 
    }
  }, '_design/database');

  return instanceId;
}

exports.insertDocument = async (databaseId, document) => {
  const { id, ...documentFields } = document;
  await couchdb.db.use(databaseId).insert(documentFields, id);
}