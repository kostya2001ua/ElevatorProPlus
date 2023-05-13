'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InventoryRecord extends Model {
        static associate(models) {
            this.belongsTo(models.Inventory, {
                foreignKey: 'inventoryId'
            });
            this.belongsTo(models.Product, {
                foreignKey: 'productId'
            });
        }
    }
    InventoryRecord.init({
        allocation: DataTypes.DOUBLE,
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return new Date(this.getDataValue('createdAt')).toLocaleString('uk-UA');
            }
        },
        expiresAt: {
            type: DataTypes.VIRTUAL,
            get() {
                var createdAt = new Date(this.getDataValue('createdAt'));
                var expiresAt = createdAt;
                expiresAt.setDate(expiresAt.getDate() + this.Product.expirationPeriod)
                return expiresAt.toLocaleString('uk-UA');
            }
        },
        expiresAtDate: {
            type: DataTypes.VIRTUAL,
            get() {
                var createdAt = new Date(this.getDataValue('createdAt'));
                var expiresAt = createdAt;
                expiresAt.setDate(expiresAt.getDate() + this.Product.expirationPeriod)
                return expiresAt;
            }
        }
    }, {
        sequelize,
        modelName: 'InventoryRecord',
    });
    return InventoryRecord;
};