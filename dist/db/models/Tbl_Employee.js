"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Tbl_Role_1 = __importDefault(require("./Tbl_Role"));
const config_1 = __importDefault(require("../config"));
class Employee extends sequelize_1.Model {
}
Employee.init({
    Emp_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    Employee_name: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    Role_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Role_1.default,
            key: "Role_Id",
        },
    },
    Is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
    },
}, {
    sequelize: config_1.default,
    tableName: "Tbl_Employee",
    timestamps: true,
});
exports.default = Employee;
