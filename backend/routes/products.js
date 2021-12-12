const Router = require("express").Router;
const mongodb = require("mongodb");

const db = require("../db");

const Decimal128 = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of products products
router.get("/", (req, res, next) => {
  const products = [];
  db.getDb()
    .db()
    .collection("products")
    .find()
    .forEach((product) => {
      // async task so still needs to be before .then
      product.price = product.price.toString();
      products.push(product);
    })
    .then((result) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred." });
    });
});

// Get single product
// req, res, next - from express framework
router.get("/:id", (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((productDoc) => {
      productDoc.price = productDoc.price.toString();
      res.status(200).json(productDoc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred." });
    });
});

// Add new product
// Requires logged in user
router.post("", (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  db.getDb()
    .db()
    .collection("products")
    .insertOne(newProduct)
    .then((result) => {
      console.log(result);
      res
        .status(201)
        .json({ message: "Product added", productId: result.insertedId });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred." });
    });
});

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  db.getDb()
    .db()
    .collection("products")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedProduct })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Product updated", productId: req.params.id });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred." });
    });
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      res.status(200).json({ message: "Product deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred." });
    });
});

module.exports = router;
