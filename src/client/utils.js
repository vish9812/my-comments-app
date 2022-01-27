const utils = {
  baseApi: "http://localhost:3000",
  api: "http://localhost:3000/comments",

  validateName: () => {
    const name = document.getElementById("username").value;
    if (!name || !name.trim().length) {
      alert("Enter Your Name");
      return null;
    }

    return name;
  },

  getCommentIdFromDom: (node) => node.closest(".comment-section")?.dataset?.id,

  getCommentSection: (id) => document.getElementById("comment_" + id),

  events: {
    dispatchCommentsAddedToHtml: (nodes) => {
      const event = new CustomEvent("commentsAddedToHtml", {
        detail: nodes,
      });

      document.dispatchEvent(event);
    },
  },

  getCommentHtml: (comment) => `
  <div id="comment_${comment.id}" class="comment-section ${
    !!comment.commentId ? "child-comment" : ""
  }" data-id="${comment.id}">
    <img class="user-pic" src="image 2.png" alt="user" />
    <div class="comment-data">
      <div>
        <span class="commenter">${comment.commenter}</span>
        <span class="time-ago">. ${comment.timeAgo}</span>
      </div>
      <div class="comment">${comment.text}</div>
      <div class="comment-response">
        <span class="react-upvote-count" data-id="${
          comment.id
        }" data-upvotes="${comment.upvotes}"></span>
        <span class="reply">Reply</span>
      </div>
    </div>
  </div>
`,

  getNewCommentHtml: () => `
  <div class="new-comment-section">
    <img class="user-pic" src="image 2.png" alt="user" />
    <input
      type="text"
      class="newCommentText"
      placeholder="What are your thoughts?"
    />
    <button class="newCommentButton">Comment</button>
  </div>
`,
};

export default utils;
