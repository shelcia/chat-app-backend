const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const {
  addUser,
  removeUser,
  getUser,
  usersInRoom,
} = require("./routes/chat/users");

const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

//IMPORT ROUTES

const authenticationRoute = require("./routes/authentication/authentication");
const router = require("./routes/router");

dotenv.config();

//DATABSE CONNECTION
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db  ")
);

//MIDDLEWARES

app.use(router);
app.use(express.json(), cors());

const server = http.createServer(app);
const io = socketIo(server);

//SOCKET CONNECTION

io.on("connection", (socket) => {
  console.log("New Connection !!");
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    // callback({ error: "error" });
  });
  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

app.use("/api", authenticationRoute);

server.listen(PORT, () => console.log(`server up and running at ${PORT}`));
