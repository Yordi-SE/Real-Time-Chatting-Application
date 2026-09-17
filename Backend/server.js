const express = require("express");
const app = express();
const dotenv = require("dotenv");
const chats = require("./data");
const cors = require("cors");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
app.use(cors());

connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.sent("yes");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Server Started on port number " + PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    console.log(newMessageRecieved);
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("Chat.user not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
