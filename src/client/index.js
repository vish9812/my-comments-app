const api = "http://localhost:5000/comments";

const onDomLoaded = async () => {
  const comments = await fetchComments();
  bindComments(comments);
};

const onNewComment = async (event) => {
  if (event.target.id !== "newCommentButton") {
    return;
  }

  const name = document.getElementById("username").value;
  if (!name || !name.trim().length) {
    alert("Enter Your Name");
    return;
  }

  const comment = document.getElementById("newCommentText").value;
  if (!comment || !comment.trim().length) {
    alert("Enter Your Comment");
    return;
  }

  const response = await fetch(api, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commenter: name,
      text: comment,
    }),
  });

  const savedComment = await response.json();

  console.log("Saved>>>>", savedComment);
  bindComments([savedComment]);
};

const fetchComments = async () => {
  const response = await fetch(api);
  const comments = await response.json();
  console.log("Got comm>>>", comments);

  return comments;
};

const bindComments = (comments) => {
  console.log("Bind>>>>", comments);
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
        <span class="material-icons">thumb_up_alt</span>
        <span class="upvote-count">&nbsp;${comment.upvotes?.length || 0}</span>
        <span class="reply">Reply</span>
      </div>
    </div>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  onDomLoaded();
});

document.addEventListener("click", (event) => onNewComment(event));
