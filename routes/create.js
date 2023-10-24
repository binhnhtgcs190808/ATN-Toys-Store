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

// Route for rendering the form to create a Store
router.get('/create', function (req, res, next) {
  res.render('create'); // Render the create form
});

// Route for handling the creation of a new product
router.post('/create', async function (req, res, next) {
  try {
    const newStore = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
    };
    await Store.insertOne(newStore);
    res.redirect('/'); // Redirect to the home page after creating the product
  } catch (err) {
    console.log(err);
    res.redirect('/create'); // Redirect back to the create form in case of an error
  }
});

module.exports = router;