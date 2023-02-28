'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        static associate(models) {
            this.hasMany(models.InventoryRecord, {
                foreignKey: 'inventoryId'
            });
        }
    }
    Inventory.init({
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        capacity: DataTypes.DOUBLE
    }, {
        sequelize,
        modelName: 'Inventory',
    });
    return Inventory;
};