const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const serverless = require('serverless-http');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!  SHUTTING DOWN....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
// console.log(process.env);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Fixes deprecated URL parser warning
    useUnifiedTopology: true, // Fixes deprecated server discovery warning
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => {
    console.log('mongo connected');
  })
  .catch((e) => {
    console.log(e);
  });

const port = process.env.PORT || 3000;
let server;

if (process.env.NODE_ENV !== 'serverless') {
  server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}

module.exports.handler = serverless(app);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  SHUTTING DOWN....');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
