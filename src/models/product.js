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
        expirationPeriod: DataTypes.INTEGER,
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return new Date(this.getDataValue('createdAt')).toLocaleString('uk-UA');
            }
        }
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};