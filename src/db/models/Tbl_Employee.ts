import { DataTypes, Model, Optional } from "sequelize";
import Project from "./Tbl_Project";
import Role from "./Tbl_Role";
import sequelizeConnection from "../config";
import ProjectEmployee from "./Tbl_ProjectEmployee";

interface EmployeeAttributes {
  Emp_Id: number;
  Employee_name: string;
  Role_Id: number;
  Is_deleted: boolean;
  email: string; // New field
  password: string; // New field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeInput extends Optional<EmployeeAttributes, "Emp_Id"> {}
export interface EmployeeOutput extends Required<EmployeeAttributes> {}

class Employee extends Model<EmployeeAttributes, EmployeeInput> implements EmployeeAttributes {
  public Emp_Id!: number;
  public Employee_name!: string;
  public Role_Id!: number;
  public Is_deleted!: boolean;
  public email: string; // New field
  public password: string; // New field
}

Employee.init(
  {
    Emp_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Employee_name: {
      type: DataTypes.STRING(255),
    },
    Role_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Role,
        key: "Role_Id",
      },
    },
    Is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email: { // New field
      type: DataTypes.STRING(255),
     
    },
    password: { // New field
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Tbl_Employee",
    timestamps: true,
  }
);

export default Employee;
