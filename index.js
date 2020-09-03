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

let message = "";
let user = "";

//SOCKET CONNECTION

io.on("connection", (socket) => {
  sendMessage(socket);
  sendUser(socket);

  //TAKES CARE OF SETTING UP WHICH USER CLICKED
  socket.on("user", (data) => {
    console.log(data.user);
    user = data;
    console.log(user);
  });
  socket.on("message", (data) => {
    console.log(data);
    message = data;
    console.log(message);
  });
});

const sendMessage = (socket) => {
  //SEND BACK TO CLIENT THE MESSAGE

  socket.emit("message", message);
};
const sendUser = (socket) => {
  //SEND BACK TO CLIENT THE USER

  socket.emit("user", user);
};

app.use("/api", authenticationRoute);

server.listen(port, () => console.log(`server up and running at ${port}`));
