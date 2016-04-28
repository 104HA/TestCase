/**
 * Created by HuiYi on 2016/3/15.
 */
module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        title: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Task.belongsTo(models.User, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Task;
};
