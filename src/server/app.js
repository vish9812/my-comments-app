import express from "express";
import cors from "cors";
import appConfig from "./config/environment.js";
import db from "./models/db.js";
import { Server } from "socket.io";
import { createServer } from "http";
import registerUpvotesHandler from "./io/upvotesHandler.js";
import appRouter from "./app.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", appRouter);

db.sequelize.sync();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New socket connection>>>", socket.id);

  registerUpvotesHandler(io, socket);

  socket.on("disconnect", () =>
    console.log("Socket disconnected>>>>>", socket.id)
  );
});

io.on("disconnect", () => {
  console.log("Disconnected>>>>");
});

httpServer.listen(appConfig.port, () =>
  console.log("App is running on port: ", httpServer.address())
);
