const express = require('express');
const router = express.Router();

// Define the collection
let Store;

// Middleware function to set up the Store collection
router.use(async (req, res, next) => {
  if (!Store) {
    Store = req.app.locals.db.collection('products');
  }
  next();
});

// Route for rendering the list of products
router.get('/', async function (req, res, next) {
  try {
    const stores = await Store.find().toArray();
    res.render('index', { Stores: stores }); // Pass the stores to the template
  } catch (err) {
    console.log(err);
    res.render('index', { Stores: [] });
  }
});

module.exports = router;