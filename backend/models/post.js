'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    contentPost: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        models.Post.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })

        models.Post.hasMany(models.Like)
      }
    }
  });
  return Post;
}