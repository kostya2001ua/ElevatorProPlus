'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            this.hasMany(models.InventoryRecord, {
                foreignKey: 'productId'
            });
        }
    }
    Product.init({
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.DOUBLE,
        expirationPeriod: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};