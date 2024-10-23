"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Tbl_Project_1 = __importDefault(require("./Tbl_Project"));
const config_1 = __importDefault(require("../config"));
const Tbl_Employee_1 = __importDefault(require("./Tbl_Employee"));
class ProjectEmployee extends sequelize_1.Model {
}
ProjectEmployee.init({
    ProjectMember_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    Project_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Project_1.default,
            key: "Project_Id",
        },
    },
    Emp_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Employee_1.default,
            key: "Emp_Id",
        },
    },
    Role_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    Degesination: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    Is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: config_1.default,
    tableName: "Tbl_ProjectEmployee",
    timestamps: true,
});
// Define associations after the model is initialized
ProjectEmployee.belongsTo(Tbl_Employee_1.default, { foreignKey: "Emp_Id" });
ProjectEmployee.belongsTo(Tbl_Project_1.default, { foreignKey: "Project_Id" });
exports.default = ProjectEmployee;
