export default (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    commenter: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });

  Comment.hasMany(Comment);
  Comment.belongsTo(Comment);

  return Comment;
};
