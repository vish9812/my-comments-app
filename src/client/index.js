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

  const name = utils.validateName();
  if (!name) return;

  const commentText =
    commentButtonNode.parentNode.querySelector(".newCommentText").value;
  if (!commentText || !commentText.trim().length) {
    alert("Enter Your Comment");
    return;
  }

  const replyOnCommentId = utils.getCommentIdFromDom(commentButtonNode);

  const comment = {
    commenter: name,
    text: commentText,
    commentId: replyOnCommentId,
  };

  const response = await fetch(utils.api, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  const savedComment = await response.json();

  console.log("Saved>>>>", savedComment);

  if (replyOnCommentId) {
    commentButtonNode.parentNode.remove();
  }

  bindComments([savedComment]);

  const allUpvotes = document.querySelectorAll(".react-upvote-count");

  utils.events.dispatchCommentsAddedToHtml([
    allUpvotes.item(allUpvotes.length - 1),
  ]);
};

const onReply = async (event) => {
  const replyNode = event.target;

  if (!replyNode.classList.contains("reply")) {
    return;
  }

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

const bindComments = (comments) => {
  const commentsSection = document.getElementById("comments");

  if (comments.length === 0) {
    commentsSection.innerHTML = "No comments yet!";
    return;
  }

  const commentsHtmlList = [];

  comments.forEach((comment) => {
    commentsHtmlList.push(utils.getCommentHtml(comment));
  });

  commentsSection.insertAdjacentHTML("beforeend", commentsHtmlList.join(""));
};

document.addEventListener("DOMContentLoaded", () => {
  onDomLoaded();
});

document.addEventListener("click", (event) => onComment(event));
document.addEventListener("click", (event) => onReply(event));
