const users = [];

const addUser = ({ id, name, room }) => {
  //ONLY TAKES USER UP TILL THE SPACE AND CONVERTS TO LOWERCASE
  //SO WE KNOW WHAT KIND OF INPUT WE ARE DEALING WITH

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  //IF USER EXISTS WITH THAT INDEX
  if (index !== -1) {
    //REMOVE THE USER AND RETURN
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  users.find((user) => user.id === id);
};

const usersInRoom = (room) => {
  //FILTERS OUT ALL THE USERS WIITH MATCHING ROOM
  users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, usersInRoom };
