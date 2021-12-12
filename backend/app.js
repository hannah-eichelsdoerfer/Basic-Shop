const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

// const { MongoClient } = require('mongodb');
// const uri =
//   "mongodb+srv://hannaheich:sZWQpDY5McoI23rU@cluster0.duw7h.mongodb.net/shop?retryWrites=true&w=majority"; // shop will be created on the fly
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const mongodb = require("mongodb").MongoClient;
mongodb
  .connect(
    "mongodb+srv://hannaheich:lTwwqUGLexY2amzT@cluster0.duw7h.mongodb.net/shop?retryWrites=true&w=majority"
  ) // use promise or callback
  .then((client) => {
    console.log("Connected!");
    client.close();
  })
  .catch((err) => console.log(err));

const productRoutes = require("./routes/products").default.default;
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/products", productRoutes);
app.use("/", authRoutes);

app.listen(3100);
