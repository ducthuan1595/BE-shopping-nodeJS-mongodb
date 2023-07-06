const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const http = require("http");
const path = require('path');
require("dotenv").config();

const route = require("./router/init");

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

// socket.init(server);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  // console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.on('send-message', data => {
    socket.broadcast.emit('receiver', data);
  })
});

app.set("socketio", socketIo);
// const store = new MongoDBStore({
//   uri: process.env.ACCESS_URL_MONGODB,
//   collection: 'sessions'
// })
///////////////////////
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.set('trust proxy', 1);
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(session({
//   secret: 'my-secret',
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   // cookie: { secure: true }
// }));

route(app);

app.use('/', (req, res) => {
  res.send('Connect successfully to Server!')
})

//mongodb://localhost:27017/sales
mongoose
  .connect('mongodb://localhost:27017/sales')
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
    console.log("Failure!");
  });
