'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    contentPost: DataTypes.STRING,
    attachment: DataTypes.STRING,
  }, {});

  Post.associate = function (models) {
    models.Post.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    models.Post.hasMany(models.Like, {onDelete: 'cascade'})
  }
  return Post;
}
