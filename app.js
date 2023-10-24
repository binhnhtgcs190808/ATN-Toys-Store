const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Import MongoDB ObjectId
const app = express();
const router = express.Router();

require('dotenv').config(); // Correctly load the dotenv config
const dbURI = process.env.CONNECTION_STRING;

let db; // Database connection reference
let Store; // Define the Store collection here

// Centralized database connection setup
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db('toys-store-db'); // Assign the db reference here
    return db; // Return the db reference
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the application on database connection failure
  }
}

async function setupDatabase() {
  await connectToDatabase();
  Store = db.collection('products');

  // Set up Express middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(router);

  // Use route modules for specific routes
  app.use(require('./routes/create'));
  app.use(require('./routes/read'));
  app.use(require('./routes/update'));
  app.use(require('./routes/delete'));

  // Set up Pug as the template engine
  app.set('view engine', 'pug');

  // Serve static files (CSS, images, etc.) from the 'public' directory
  app.use(express.static('public'));

  // Start the Express server
  app.listen(5000, async () => {
    const connectedDB = await connectToDatabase(); // Make sure the database connection is established
    Store = connectedDB.collection('products'); // Assign the Store collection here

    app.locals.db = connectedDB; // Pass the db object as a local variable
    console.log('Server is running on port 5000');
  });
}

setupDatabase().catch((err) => {
  console.error('Error during database setup:', err);
});