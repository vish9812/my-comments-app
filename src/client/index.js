const api = "http://localhost:3000/comments";

const onDomLoaded = async () => {
  document
    .querySelector("main")
    .insertAdjacentHTML("afterbegin", getNewCommentHtml());

  const comments = await fetchComments();
  bindComments(comments);
};

const validateName = () => {
  const name = document.getElementById("username").value;
  if (!name || !name.trim().length) {
    alert("Enter Your Name");
    return null;
  }

  return name;
};

const getCommentIdFromDom = (node) =>
  node.closest(".comment-section")?.dataset?.id;

const onComment = async (event) => {
  const commentButtonNode = event.target;

  if (!commentButtonNode.classList.contains("newCommentButton")) {
    return;
  }

  const name = validateName();
  if (!name) return;

  const commentText =
    commentButtonNode.parentNode.querySelector(".newCommentText").value;
  if (!commentText || !commentText.trim().length) {
    alert("Enter Your Comment");
    return;
  }

  const replyOnCommentId = getCommentIdFromDom(commentButtonNode);

  const comment = {
    commenter: name,
    text: commentText,
    commentId: replyOnCommentId,
  };

  const response = await fetch(api, {
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
};

const onUpvote = async (event) => {
  const upvoteNode = event.target;

  if (!upvoteNode.classList.contains("upvote")) {
    return;
  }

  if (!validateName()) return;

  const commentId = getCommentIdFromDom(upvoteNode);

  await fetch(`${api}/${commentId}/upvote`, {
    method: "put",
  });

  const upvoteCountNode = upvoteNode.nextSibling.nextSibling;

  upvoteCountNode.innerHTML = +upvoteCountNode.innerHTML + 1;
};

const onReply = async (event) => {
  const replyNode = event.target;

  if (!replyNode.classList.contains("reply")) {
    return;
  }

  replyNode
    .closest(".comment-response")
    .insertAdjacentHTML("afterend", getNewCommentHtml());
};

const fetchComments = async () => {
  const response = await fetch(api);
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
    commentsHtmlList.push(getCommentHtml(comment));
  });

  commentsSection.insertAdjacentHTML("beforeend", commentsHtmlList.join(""));
};

const getCommentHtml = (comment) => `
  <div class="comment-section" data-id="${comment.id}">
    <img class="user-pic" src="image 2.png" alt="user" />
    <div class="comment-data">
      <div>
        <span class="commenter">${comment.commenter}</span>
        <span class="time-ago">. ${comment.timeAgo}</span>
      </div>
      <div class="comment">${comment.text}</div>
      <div class="comment-response">
        <span class="material-icons upvote">thumb_up_alt</span>
        &nbsp;<span class="upvote-count">${comment.upvotes}</span>
        <span class="reply">Reply</span>
      </div>
    </div>
  </div>
`;

const getNewCommentHtml = () => `
  <div class="new-comment-section">
    <img class="user-pic" src="image 2.png" alt="user" />
    <input
      type="text"
      class="newCommentText"
      placeholder="What are your thoughts?"
    />
    <button class="newCommentButton">Comment</button>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  onDomLoaded();
});

document.addEventListener("click", (event) => onComment(event));
document.addEventListener("click", (event) => onUpvote(event));
document.addEventListener("click", (event) => onReply(event));
