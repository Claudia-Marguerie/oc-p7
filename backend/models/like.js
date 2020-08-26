'use strict';

module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    isLike: DataTypes.INTEGER
  }, {});
  Like.associate = function (models) {

    models.User.belongsToMany(models.Post, {
      through: models.Like,
      onDelete: 'CASCADE'
    });

    models.Post.belongsToMany(models.User, {
      through: models.Like,
    });
  };
  return Like;
};