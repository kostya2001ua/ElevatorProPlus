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
        capacity: DataTypes.DOUBLE,
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return new Date(this.getDataValue('createdAt')).toLocaleString('uk-UA');
            }
        },
        totalAllocation: {
            type: DataTypes.VIRTUAL,
            get() {
                var inventoryRecords = this.InventoryRecords;
                return inventoryRecords.reduce(function (totalAllocation, inventoryRecord) {
                    return totalAllocation + inventoryRecord.allocation;
                }, 0);
            }
        },
        allocationPercentage: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.totalAllocation / this.capacity * 100;
            }
        },
        allocationString: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.totalAllocation + '/' + this.capacity + '(' + this.allocationPercentage.toFixed(2) + '%)';
            }
        }
    }, {
        sequelize,
        modelName: 'Inventory',
    });
    return Inventory;
};