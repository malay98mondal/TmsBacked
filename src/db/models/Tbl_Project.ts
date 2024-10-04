import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
 // Update this path according to your project structure

interface ProjectAttributes {
  Project_Id: number;
  Project_Name: string;
  Status: string;
  Is_deleted: boolean;
}

export interface ProjectInput extends Optional<ProjectAttributes, "Project_Id"> {}
export interface ProjectOutput extends Required<ProjectAttributes> {}

class Project extends Model<ProjectAttributes, ProjectInput> implements ProjectAttributes {
  public Project_Id!: number;
  public Project_Name!: string;
  public Status!: string;
  public Is_deleted!: boolean;
}

Project.init(
  {
    Project_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Project_Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Tbl_Project",
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default Project;
