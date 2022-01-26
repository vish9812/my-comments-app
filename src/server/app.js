import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.sequelize.sync({ force: true });
const Comment = db.comments;

app.get("/comments", async (req, res) => {
  const comments = await Comment.findAll();
  console.log("Fetched users...", comments.length);

  res.json(comments);
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

  res.json(savedComment);
});

app.listen(process.env.PORT, process.env.HOST, () =>
  console.log("App is running")
);
