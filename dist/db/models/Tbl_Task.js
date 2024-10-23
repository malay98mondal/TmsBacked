"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Tbl_Role_1 = __importDefault(require("./Tbl_Role"));
const config_1 = __importDefault(require("../config"));
const Tbl_Employee_1 = __importDefault(require("./Tbl_Employee"));
class Task extends sequelize_1.Model {
}
Task.init({
    Task_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    Task_Name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    Role_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Role_1.default,
            key: "Role_Id",
        },
    },
    Emp_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Employee_1.default,
            key: "Emp_Id",
        },
    },
    Is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: config_1.default,
    tableName: "Tbl_Task",
    timestamps: true,
});
exports.default = Task;
