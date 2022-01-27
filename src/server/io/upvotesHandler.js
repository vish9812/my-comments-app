import db from "../models/db.js";

const Comment = db.comments;

export default (io, socket) => {
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
};
