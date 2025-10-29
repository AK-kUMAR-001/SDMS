'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RolePermission extends Model {
        static associate(models) {
            RolePermission.belongsTo(models.Role, { foreignKey: 'roleId' });
            RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId' });
        }
    }
    RolePermission.init({
        roleId: {
            type: DataTypes.UUID
        },
        permissionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Permissions',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'role_permissions',
        timestamps: false
    });
    return RolePermission;
};