import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/db.js";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

dotenv.config();
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
const updateTimeAgo = (comments) =>
  comments.map((m) => {
    const comment = m.get({ plain: true });
    comment.timeAgo = timeAgo.format(new Date(comment.updatedAt));
    return comment;
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.sequelize.sync();
const Comment = db.comments;

app.get("/comments", async (req, res) => {
  const comments = await Comment.findAll();
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

app.listen(process.env.PORT, process.env.HOST, () =>
  console.log("App is running")
);
