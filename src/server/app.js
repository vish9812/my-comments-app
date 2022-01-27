import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/db.js";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
const updateTimeAgo = (comments) =>
  comments.map((m) => {
    const comment = m.get({ plain: true });
    comment.timeAgo = timeAgo.format(new Date(comment.createdAt));
    return comment;
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.sequelize.sync();
const Comment = db.comments;

app.get("/comments", async (req, res) => {
  const comments = await Comment.findAll({
    order: [["createdAt", "DESC"]],
  });
  console.log("Fetched users...", comments.length);

  const commentsJson = updateTimeAgo(comments);

  res.json(commentsJson);
});

app.post("/comments", async (req, res) => {
  // Validate
  if (!req.body.text || req.body.text.trim().length === 0) {
    res.status(400).json({
      message: "Comment can't be empty",
    });

    return;
  }

  const comment = { ...req.body };
  comment.commenter = comment.commenter || "Random Guy";

  const savedComment = await Comment.create(comment);
  console.log("Saved comment...", savedComment.commenter);

  const commentJson = updateTimeAgo([savedComment])[0];

  res.json(commentJson);
});

// app.put("/comments/:commentId/upvote", async (req, res) => {
//   const commentId = +req.params.commentId;

//   await Comment.increment(
//     { upvotes: 1 },
//     {
//       where: {
//         id: commentId,
//       },
//     }
//   );

//   res.sendStatus(200);
//   io.emit("upvoted", commentId, req.query.socketId);
// });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New socket connection>>>", socket.id);

  socket.on("upvoted", async (commentId) => {
    console.log("upvoted>>>>", commentId);
    await Comment.increment(
      { upvotes: 1 },
      {
        where: {
          id: +commentId,
        },
      }
    );

    io.emit("upvoteSaved", commentId);
  });
});

httpServer.listen(process.env.PORT, process.env.HOST, () =>
  console.log("App is running")
);
