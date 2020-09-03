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

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    //INBUILT FUCNTION JOIN IS CALLED TO JOIN THE USER IN ROOM
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });

    //BROADCAST IS INBUILT FUNCTION TO SEND MESSAGE TO CONNECTION EXCEPT THE CLIENT WHO SENT IT

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use("/api", authenticationRoute);

server.listen(PORT, () => console.log(`server up and running at ${PORT}`));
