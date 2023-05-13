'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.LineItem, {
                foreignKey: 'orderId'
            });
            this.belongsTo(models.Client, {
                foreignKey: 'clientId'
            });
            this.belongsTo(models.User, {
                foreignKey: 'userId'
            });
        }
    }
    Order.init({
        description: DataTypes.TEXT,
        clientId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM('created', 'open', 'fulfilled', 'cancelled'),
            defaultValue: 'created'
        },
        totalPrice: {
            type: DataTypes.VIRTUAL,
            get: function() {
                var total = this.LineItems.reduce((price, lineItem) => price + lineItem.Product.price * lineItem.quantity ,0);
                return total;
            }
        },
        totalWeight: {
            type: DataTypes.VIRTUAL,
            get: function() {
                var total = this.LineItems.reduce((weight, lineItem) => weight + lineItem.quantity ,0);
                return total;
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return new Date(this.getDataValue('createdAt')).toLocaleString('uk-UA');
            }
        },
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};