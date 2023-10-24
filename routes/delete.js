const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Import ObjectId

// Define the collection
let Store;

// Middleware function to set up the Store collection
router.use(async (req, res, next) => {
  if (!Store) {
    Store = req.app.locals.db.collection('products');
  }
  next();
});

// Route for handling the deletion of a product
router.post('/delete', async function (req, res, next) {
  try {
    const id = new ObjectId(req.body.id);
    const filter = { _id: id };
    await Store.deleteOne(filter);
  } catch (err) {
    console.log(err);
  }
  res.redirect('/');
});

module.exports = router;