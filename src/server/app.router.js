import express from "express";
import db from "./models/db.js";
import { updateTimeAgo } from "./utility.js";

const router = express.Router();
const Comment = db.comments;

const getComments = async (req, res) => {
  const comments = await Comment.findAll({
    order: [["createdAt", "DESC"]],
  });
  console.log("Fetched users...", comments.length);

  const commentsJson = updateTimeAgo(comments);

  res.json(commentsJson);
};

const saveComment = async (req, res) => {
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
  console.log("Comment by>>>>>", savedComment.commenter);

  const commentJson = updateTimeAgo([savedComment])[0];

  res.json(commentJson);
};

router.route("/comments").get(getComments).post(saveComment);

export default router;
