const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser')
require('dotenv').config();

const route = require('./router/init');
const User = require('./model/user');

const app = express();
const port = process.env.PORT_URL;
// const store = new MongoDBStore({
//   uri: process.env.ACCESS_URL_MONGODB,
//   collection: 'sessions'
// })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(session({
//   secret: 'my-secret',
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   // cookie: { secure: true }
// }));

route(app);

mongoose.connect(process.env.ACCESS_URL_MONGODB)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      console.log('Connect to mongooDB');
    });
  })
  .catch(err => {
    console.log(err);
    console.log('Failure!');
  })



