import { DataTypes, Model, Optional } from "sequelize";
import Project from "./Tbl_Project";
import Role from "./Tbl_Role";
import sequelizeConnection from "../config";
import ProjectEmployee from "./Tbl_ProjectEmployee";


interface EmployeeAttributes {
  Emp_Id: number;
//  Project_Id: number;
  Employee_name: string;
  Role_Id: number;
  Is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeInput extends Optional<EmployeeAttributes, "Emp_Id"> {}
export interface EmployeeOutput extends Required<EmployeeAttributes> {}

class Employee extends Model<EmployeeAttributes, EmployeeInput> implements EmployeeAttributes {
  public Emp_Id!: number;
  //public Project_Id!: number;
  public Employee_name!: string;
  public Role_Id!: number;
  public Is_deleted!: boolean;
}

Employee.init(
  {
    Emp_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    // Project_Id: {
    //   type: DataTypes.INTEGER.UNSIGNED,
    //   references: {
    //     model: Project,
    //     key: "Project_Id",
    //   },
  //  },
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
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Tbl_Employee",
    timestamps: true,
  }
);

export default Employee;
