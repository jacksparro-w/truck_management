require("dotenv").config();

const http = require("http");

const app = require("./app");

const { Server } = require("socket.io");

const connectDatabase =
  require("./config/database");

const {
  initializeSocket,
} = require("./config/socket");

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async () => {
  await connectDatabase();

  const server = http.createServer(app);

  server.on("error", (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof PORT === "string"
      ? `Pipe ${PORT}`
      : `Port ${PORT}`;

    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  initializeSocket(io);

  io.on("connection", (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
  
  const {
    startCongestionJob,
  } = require(
    "./jobs/congestion.job"
  );

  startCongestionJob();
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
