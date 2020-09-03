const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

//SOCKET CONNECTION

io.on("connect", (socket) => {
  //ADDING NEW USER
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    //JOIN IS INBUILT FUNCTION WHICH JOINS THE USER WITH MATCHING ROOM
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `Hi!${user.name}, welcome to ${user.room}.`,
    });

    //BROADCAST IS INBUILT METHOD TO SEND MWESSAGE TO ALL CONNECTED CLIENT EXCEPT THE CLIENT WHO SENT IT
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    //SENDING ROOM DATA SPECIFIC TO ROOM
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    //ERROR HANDLING

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    //ON DISCONNECT REMOVE THE USER
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} left the group.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log(`Server has started.`)
);
