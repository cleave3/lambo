const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", socket => {
  socket.on("join-room", (roomId, userid) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user connected", userid);
  });
});
server.listen(3000);
