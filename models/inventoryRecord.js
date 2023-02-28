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
        allocation: DataTypes.DOUBLE
    }, {
        sequelize,
        modelName: 'InventoryRecord',
    });
    return InventoryRecord;
};