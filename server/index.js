require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const chats = require("./data/data");
const app = express();
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
connectDB();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notification", notificationRoutes);
app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat users not found");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", (userData) => {
    socket.leave(userData._id);
  });
});
