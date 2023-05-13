'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LineItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Order, {
                foreignKey: 'orderId'
            });
            this.belongsTo(models.Product, {
                foreignKey: 'productId'
            });
        }
    }
    LineItem.init({
        orderId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        quantity: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'LineItem',
    });
    return LineItem;
};