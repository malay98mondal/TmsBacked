"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
class Project extends sequelize_1.Model {
}
Project.init({
    Project_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    Project_Name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    Status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    Is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: config_1.default,
    tableName: "Tbl_Project",
    timestamps: true, // Automatically adds createdAt and updatedAt
});
exports.default = Project;
