const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.MONGO_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

// FOR LOCAL DEV
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
}

// FOR VERCEL
module.exports = app;

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // In serverless, we can't really gracefully close the server the same way
  process.exit(1);
});
