import { DataTypes, Model, Optional } from "sequelize";
import Project from "./Tbl_Project";
import sequelizeConnection from "../config";
import Employee from "./Tbl_Employee";


interface ProjectEmployeeAttributes {
  ProjectMember_Id: number;
  Project_Id: number;
  Emp_Id: number;
  Is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectEmployeeInput extends Optional<ProjectEmployeeAttributes, "ProjectMember_Id"> {}
export interface ProjectEmployeeOutput extends Required<ProjectEmployeeAttributes> {}

class ProjectEmployee extends Model<ProjectEmployeeAttributes, ProjectEmployeeInput> implements ProjectEmployeeAttributes {
  public ProjectMember_Id!: number;
  public Project_Id!: number;
  public Emp_Id!: number;
  public Is_deleted!: boolean;
}

ProjectEmployee.init(
  {
    ProjectMember_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Project_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Project,
        key: "Project_Id",
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
    tableName: "Tbl_ProjectEmployee",
    timestamps: true,
  }
);

export default ProjectEmployee;
