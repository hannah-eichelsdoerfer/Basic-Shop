const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const mongoDbUrl =
  "mongodb+srv://hannaheich:lTwwqUGLexY2amzT@cluster0.duw7h.mongodb.net/shop?retryWrites=true&w=majority";

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("Database already initialized!");
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Database not initialized");
  }
  return _db;
};

module.exports = { initDb, getDb };
