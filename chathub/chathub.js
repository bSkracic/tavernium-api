const { v4: uuidv4 } = require("uuid");
const db = require("../db/db");

const createChathub = (server) => {
  const io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`client connected with id: ${socket.id}`);

    // Listen to message event from any client and broadcast it to other clients
    socket.on("MESSAGE", (data) => {
      // TODO: Save to database
      db.query(
        "insert into messages(sender, campaign_id, content) values($1, $2, $3)",
        [data.sender, data.campaign_id, data.content]
      )
        .then((res) => {
          io.in(data.campaign_id).emit("MESSAGE", data);
        })
        .catch((e) => console.log(e));
    });

    socket.on("JOIN_ROOM", (data) => {
      socket.join(data.room_id);
    });
  });
};

module.exports = { createChathub };
