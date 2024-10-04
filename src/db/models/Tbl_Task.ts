import { DataTypes, Model, Optional } from "sequelize";
import Role from "./Tbl_Role";
import sequelizeConnection from "../config";
import Employee from "./Tbl_Employee";


interface TaskAttributes {
  Task_Id: number;
  Task_Name: string;
  Role_Id: number;
  Emp_Id: number;
  Is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskInput extends Optional<TaskAttributes, "Task_Id"> {}
export interface TaskOutput extends Required<TaskAttributes> {}

class Task extends Model<TaskAttributes, TaskInput> implements TaskAttributes {
  public Task_Id!: number;
  public Task_Name!: string;
  public Role_Id!: number;
  public Emp_Id!: number;
  public Is_deleted!: boolean;
}

Task.init(
  {
    Task_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Task_Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Role_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Role,
        key: "Role_Id",
      },
    },
    Emp_Id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: Employee,
          key: "Emp_Id",
        },
      },

    Is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Tbl_Task",
    timestamps: true,
  }
);

export default Task;
