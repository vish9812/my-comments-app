import utils from "./utils.js";

const el = React.createElement;

const Upvote = ({ commentId, upvotes }) => {
  const [count, setCount] = React.useState(upvotes);

  const handleUpvote = async () => {
    await fetch(`${utils.api}/${commentId}/upvote`, {
      method: "put",
    });

    setCount(count + 1);
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
