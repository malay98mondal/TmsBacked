"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Tbl_Employee_1 = __importDefault(require("./Tbl_Employee"));
const Tbl_Role_1 = __importDefault(require("./Tbl_Role"));
const config_1 = __importDefault(require("../config"));
class TaskDetails extends sequelize_1.Model {
}
TaskDetails.init({
    Task_details_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    Emp_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Employee_1.default,
            key: "Emp_Id",
        },
    },
    Project_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    Status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    Start_Date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    Start_Time: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    Actual_Start_Date: {
        type: sequelize_1.DataTypes.DATE,
    },
    Actual_Start_Time: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    Task_Details: {
        type: sequelize_1.DataTypes.STRING(70),
    },
    End_Date: {
        type: sequelize_1.DataTypes.DATE, // Use DATEONLY for storing only date (without time)
    },
    End_Time: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    Extend_Start_Date: {
        type: sequelize_1.DataTypes.DATE,
    },
    Extend_Start_Time: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    Extend_End_Date: {
        type: sequelize_1.DataTypes.DATE,
    },
    Extend_End_Time: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    Remarks: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    Modified_By: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    Modified_DateTime: {
        type: sequelize_1.DataTypes.DATE,
    },
    Role_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Tbl_Role_1.default,
            key: "Role_Id",
        },
    },
    Assigned_Emp_Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    Is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: config_1.default,
    tableName: "Tbl_TaskDetails",
    timestamps: true,
});
TaskDetails.belongsTo(Tbl_Employee_1.default, { foreignKey: 'Assigned_Emp_Id' });
exports.default = TaskDetails;
