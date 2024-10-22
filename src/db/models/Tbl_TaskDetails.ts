import { DataTypes, Model, Optional } from "sequelize";

import Employee from "./Tbl_Employee";
import Task from "./Tbl_Task";
import Role from "./Tbl_Role";
import sequelizeConnection from "../config";

interface TaskDetailsAttributes {
  Task_details_Id: number;
  Emp_Id: number;
  Project_Id:number;
  Status: string;
  Start_Date: Date;
  Task_Details:string;
  Start_Time: string;
   Actual_Start_Date?: Date;
   Actual_Start_Time?: string;
  End_Date?: Date;
  End_Time?: string;
  Extend_Start_Date?: Date;
  Extend_Start_Time?: string;
  Extend_End_Date?: Date;
  Extend_End_Time?: string;
  Remarks?: string;
  Modified_By?: string;
  Modified_DateTime?: Date;
  Role_Id: number;
  Assigned_Emp_Id: number;
  Is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskDetailsInput extends Optional<TaskDetailsAttributes, "Task_details_Id"> {}
export interface TaskDetailsOutput extends Required<TaskDetailsAttributes> {}

class TaskDetails extends Model<TaskDetailsAttributes, TaskDetailsInput> implements TaskDetailsAttributes {
  public Task_details_Id!: number;
  public Emp_Id!: number;
  public Project_Id:number;
  public Status!: string;
  public Start_Date!: Date;
  public Start_Time!: string;
  public Actual_Start_Date?: Date;
  public Actual_Start_Time?: string;
  public Task_Details: string;
  public End_Date?: Date;
  public End_Time?: string;
  public Extend_Start_Date?: Date;
  public Extend_Start_Time?: string;
  public Extend_End_Date?: Date;
  public Extend_End_Time?: string;
  public Remarks?: string;
  public Modified_By?: string;
  public Modified_DateTime?: Date;
  public Role_Id!: number;
  public Assigned_Emp_Id!: number;
  public Is_deleted!: boolean;
  Employee: any;
}

TaskDetails.init(
  {
    Task_details_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Emp_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Employee,
        key: "Emp_Id",
      },
    },
    
    Project_Id:{
      type:DataTypes.INTEGER.UNSIGNED,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Start_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Start_Time: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Actual_Start_Date: {
      type: DataTypes.DATE,
   },
    Actual_Start_Time: {
      type: DataTypes.STRING(50),
    },
    Task_Details:{
      type:DataTypes.STRING(70),
    },
    End_Date: {
      type: DataTypes.DATE,
    },
    End_Time: {
      type: DataTypes.STRING(50),
    },
    Extend_Start_Date: {
      type: DataTypes.DATE,
    },
    Extend_Start_Time: {
      type: DataTypes.STRING(50),
    },
    Extend_End_Date: {
      type: DataTypes.DATE,
    },
    Extend_End_Time: {
      type: DataTypes.STRING(50),
    },
    Remarks: {
      type: DataTypes.STRING(255),
    },
    Modified_By: {
      type: DataTypes.STRING(50),
    },
    Modified_DateTime: {
      type: DataTypes.DATE,
    },
    Role_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Role,
        key: "Role_Id",
      },
    },
    Assigned_Emp_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    Is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Tbl_TaskDetails",
    timestamps: true,
  }
);

TaskDetails.belongsTo(Employee, { foreignKey: 'Assigned_Emp_Id' });



export default TaskDetails;
