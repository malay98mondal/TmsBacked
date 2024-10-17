import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config";
import Employee from "./Tbl_Employee";


interface RoleAttributes {
  Role_Id: number;
  Name: string;
  Status: string;
  Is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleInput extends Optional<RoleAttributes, "Role_Id"> {}
export interface RoleOutput extends Required<RoleAttributes> {}

class Role extends Model<RoleAttributes, RoleInput> implements RoleAttributes {
  public Role_Id!: number;
  public Name!: string;
  public Status!: string;
  public Is_deleted!: boolean;
}

Role.init(
  {
    Role_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
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
    tableName: "Tbl_Role",
    timestamps: true,
  }
);

Role.hasMany(Employee, {
  foreignKey: 'Role_Id',
});

export default Role;
