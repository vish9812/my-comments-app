import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const updateTimeAgo = (comments) =>
  comments.map((m) => {
    const comment = m.get({ plain: true });
    comment.timeAgo = timeAgo.format(new Date(comment.createdAt));
    return comment;
  });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { updateTimeAgo, delay };
