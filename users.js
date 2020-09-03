const users = [];

const addUser = ({ id, name, room }) => {
  //GETS STRING TILL IT ENCOUNTERS SPACE AD CONVERTS ALL OF THEM STRING
  //THUS WE KNOW WHAT KIND OF INPUT WE ARE HANDLING

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  //USER CANNOT GET IT WITH INCOMPLETE FIELDS

  if (!name || !room) return { error: "Username and room are required." };

  //USERS SHOULD ENTER UNIQUE USERID

  if (existingUser) return { error: "Username is taken." };

  //ELSE USER IS CREATED AND ADDED

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  //IF USER EXISTS THEN RETURN USERS EXCEPT THE USER MATCHING THE ID
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => {
  //FIND USER BASED ON MATCHING ID

  users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  //FILTERS OUT USERS BASED ON MATCHIN ROOM

  users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
