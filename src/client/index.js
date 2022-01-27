import utils from "./utils.js";

const onDomLoaded = async () => {
  document
    .querySelector("main")
    .insertAdjacentHTML("afterbegin", utils.getNewCommentHtml());

  const comments = await fetchComments();
  bindComments(comments);

  utils.events.dispatchCommentsAddedToHtml(
    document.querySelectorAll(".react-upvote-count")
  );
};

const onComment = async (event) => {
  const commentButtonNode = event.target;

  if (!commentButtonNode.classList.contains("newCommentButton")) {
    return;
  }

  // Validate
  const name = utils.validateName();
  if (!name) return;

  const commentText =
    commentButtonNode.parentNode.querySelector(".newCommentText").value;
  if (!commentText || !commentText.trim().length) {
    alert("Enter Your Comment");
    return;
  }

  // To check if new comment or a reply
  const replyOnCommentId = utils.getCommentIdFromDom(commentButtonNode);

  const comment = {
    commenter: name,
    text: commentText,
    commentId: replyOnCommentId,
  };

  // Save
  const response = await fetch(utils.api, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  const savedComment = await response.json();

  console.log("Saved>>>>", savedComment);

  // Update Html
  if (replyOnCommentId) {
    document
      .getElementById("comments")
      .querySelector(".new-comment-section")
      .remove();
  } else {
    document.querySelector(".newCommentText").value = "";
  }

  bindComments([savedComment], replyOnCommentId);
  const addedComment = document.getElementById("comment_" + savedComment.id);

  // Bind React
  utils.events.dispatchCommentsAddedToHtml([
    addedComment.querySelector(".react-upvote-count"),
  ]);
};

const onReply = async (event) => {
  const replyNode = event.target;

  if (!replyNode.classList.contains("reply")) {
    return;
  }

  // Remove previous replyBox, if any
  const prevReplyBox = document
    .getElementById("comments")
    .querySelector(".new-comment-section");

  if (prevReplyBox) {
    prevReplyBox.remove();
  }

  // Add new replyBox
  replyNode
    .closest(".comment-response")
    .insertAdjacentHTML("afterend", utils.getNewCommentHtml());
};

const fetchComments = async () => {
  const response = await fetch(utils.api);
  const comments = await response.json();
  console.log("Got comm>>>", comments);

  return comments;
};

// Bind new comments at top
// Bind replies 1-level down
const bindComments = (comments, replyOnCommentId) => {
  const commentsSection = document.getElementById("comments");

  if (comments.length === 0) {
    commentsSection.innerHTML = "No comments yet!";
    return;
  }

  if (comments.length === 1) {
    if (replyOnCommentId) {
      // Reply comment
      const commentParent = utils.getCommentSection(replyOnCommentId);
      commentParent.insertAdjacentHTML(
        "afterend",
        utils.getCommentHtml(comments[0])
      );
    } else {
      // New comment
      commentsSection.insertAdjacentHTML(
        "afterbegin",
        utils.getCommentHtml(comments[0])
      );
    }
  } else {
    // First time all comments

    // First render parents
    // Then render respective children under top parent
    const parents = [];
    const children = [];
    const lookup = new Map();
    for (const comment of comments) {
      const parentId = comment.commentId;
      lookup.set(comment.id, parentId || 0);

      if (parentId) {
        children.push(comment);
      } else {
        parents.push(comment);
      }
    }

    // Add Parents
    const parentsHtmlList = [];
    parents.forEach((comment) => {
      parentsHtmlList.push(utils.getCommentHtml(comment));
    });
    commentsSection.insertAdjacentHTML("afterbegin", parentsHtmlList.join(""));

    // Add children
    const childrenHtmlMap = new Map();
    children.forEach((comment) => {
      // get top parent
      let parentId = comment.commentId;
      let topParentId = parentId;

      while (parentId) {
        topParentId = parentId;
        parentId = lookup.get(parentId);
      }

      const childrenHtmlList = childrenHtmlMap.get(topParentId) || [];
      childrenHtmlList.push(utils.getCommentHtml(comment));
      childrenHtmlMap.set(topParentId, childrenHtmlList);
    });

    // Bind children
    childrenHtmlMap.forEach((commentsHtml, topParentId) => {
      const topParent = utils.getCommentSection(topParentId);
      topParent.insertAdjacentHTML("afterend", commentsHtml.join(""));
    });
  }
};

document.addEventListener("DOMContentLoaded", onDomLoaded);

document.addEventListener("click", onComment);
document.addEventListener("click", onReply);
