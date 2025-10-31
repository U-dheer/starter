const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!  SHUTTING DOWN....');
  server.close(() => {
    process.exit(1);
  });
});
//'mongodb+srv://udithadheerendra10:kdzLCDV5HB5Vuqbl@natours.vmca4a5.mongodb.net/'
//'mongodb+srv://udithadheerendra10:CVLueE7jACOrsWwk@natours.bbryaso.mongodb.net/'
//'mongodb+srv://udithadheerendra10:CVLueE7jACOrsWwk@natours.bbryaso.mongodb.net/'
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

// mongoose.connect('mongodb://127.0.0.1:27017/natours', {
//     // useNewUrlParser: true,      // Fixes deprecated URL parser warning
//     // useUnifiedTopology: true,   // Fixes deprecated server discovery warning
//     // useCreateIndex: true,
//     // useFindAndModify: false
// }).then(() => {
//     console.log('mongo connected')
// }).catch((e) => {
//     console.log(e)
// })

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  //mongo case eka alnne methana
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  SHUTTING DOWN....');
  server.close(() => {
    process.exit(1);
  });
});
