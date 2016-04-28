/**
 * Created by HuiYi on 2016/3/15.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Task)
            }
        }
    });

    return User;
};
