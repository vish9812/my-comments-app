document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const comments = await fetchComments();
    bindComments(comments);
  })();
});

const fetchComments = async () => {
  const response = await fetch("http://localhost:5000/comments");
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

  commentsSection.innerHTML = commentsHtmlList.join();
};

const getCommentHtml = (comment) => `
  <div class="comment-section">
    <img class="user-pic" src="image 2.png" alt="user" />
    <div class="comment-data">
      <div>
        <span class="commenter">${comment.commenter}</span>
        <span class="time-ago">. ${getAgoTime(comment.time)} min ago</span>
      </div>
      <div class="comment">${comment.text}</div>
      <div class="comment-response">
        <span class="material-icons">thumb_up_alt</span>
        <span class="upvote-count">&nbsp;${comment.upvotes.length}</span>
        <span class="reply">Reply</span>
      </div>
    </div>
  </div>
`;

const getAgoTime = (time) =>
  new Date().getMinutes() - new Date(time).getMinutes();
