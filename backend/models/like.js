'use strict';

module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    /*userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    }*/
  }, {});
  Like.associate = function (models) {
    models.Post.belongsToMany(models.User, {through: models.Like})
    models.User.belongsToMany(models.Post, {through: models.Like})
  };

  return Like;
};
