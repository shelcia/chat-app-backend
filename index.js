const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 8000;
const index = require("./routes/index");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//IMPORT ROUTES

const authenticationRoute = require("./routes/authentication/authentication");
const { valid } = require("@hapi/joi");

dotenv.config();

//DATABSE CONNECTION
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db  ")
);

//MIDDLEWARES

app.use(index);
app.use(express.json(), cors());

const server = http.createServer(app);
const io = socketIo(server);

let counter1 = 0;
let counter2 = 0;
let userName1 = "";
let userName2 = "";

//SOCKET CONNECTION

io.on("connection", (socket) => {
  sendCounterValue1(socket);
  sendCounterValue2(socket);
  sendUserClicked1(socket);
  sendUserClicked2(socket);

  //TAKES CARE OF SETTING UP WHICH USER CLICKED
  socket.on("clickeduser1", (data) => {
    console.log(data.user);
    userName1 = data;
    console.log(userName1);
  });
  socket.on("clickeduser2", (data) => {
    console.log(data);
    userName2 = data;
    console.log(userName2);
  });
  //TAKES CARE OF COUNTER INCREEMENTS
  socket.on("clicked1", () => {
    counter1++;
    console.log(counter1);
  });
  socket.on("clicked2", () => {
    counter2++;
    console.log(counter2);
  });
});

const sendCounterValue1 = (socket) => {
  //SEND BACK TO CLIENT THE FIRST COUNTER VALUE

  socket.emit("counter1", counter1);
};
const sendCounterValue2 = (socket) => {
  //SEND BACK TO CLIENT THE SECOND COUNTER VALUE

  socket.emit("counter2", counter2);
};
const sendUserClicked1 = (socket) => {
  //SEND BACK TO CLIENT WHO HAS ACCESS FOR FIRST COUNTER BUTTON

  socket.emit("user1", userName1);
};
const sendUserClicked2 = (socket) => {
  //SEND BACK TO CLIENT  WHO HAS ACCESS FOR FIRST SECOND BUTTON

  socket.emit("user2", userName2);
};

app.use("/api", authenticationRoute);

server.listen(port, () => console.log(`server up and running at ${port}`));
