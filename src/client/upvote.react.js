const socket = io();
socket.on("connect", () => {
  console.log("Connected>>>", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected>>>", socket.id);
});

const el = React.createElement;

const Upvote = ({ commentId, upvotes }) => {
  const [count, setCount] = React.useState(upvotes);

  React.useEffect(() => {
    socket.on("upvoteSaved", (upvotedCommentId) => {
      if (upvotedCommentId === commentId) {
        setCount((c) => c + 1);
      }
    });
  }, []);

  const handleUpvote = async () => {
    socket.emit("upvoted", commentId);
  };

  return el(
    React.Fragment,
    null,
    el(
      "span",
      {
        className: "material-icons upvote",
        onClick: handleUpvote,
      },
      "thumb_up_alt"
    ),
    "\xA0",
    el(
      "span",
      {
        className: "upvote-count",
      },
      count
    )
  );
};

document.addEventListener("commentsAddedToHtml", (e) => {
  e.detail.forEach((node) => {
    const commentId = +node.dataset.id;
    const upvotes = +node.dataset.upvotes;
    ReactDOM.render(el(Upvote, { commentId, upvotes }), node);
  });
});
