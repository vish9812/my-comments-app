export default (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    commenter: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
  });

  Comment.hasMany(Comment);
  Comment.belongsTo(Comment);

  return Comment;
};
