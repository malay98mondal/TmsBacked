// services/RoleService.ts

import Role from "../models/Tbl_Role";


export const addRole = async () => {
    // First demo role
    const findRole1 = await Role.findOne({ where: {Name: "Manager" } });

    if (findRole1) {
        console.log("Role 'EMS' already exists");
    } else {
        const reqData1: any = {
            Name: "Manager",
            Status: "Active",
            Is_deleted: false,
        };

        const createRole1 = await Role.create(reqData1);
        console.log("Role 'Manager' created:", createRole1);
    }

    // Second demo Role
    const findRole2 = await Role.findOne({ where: { Name: "Team_Lead" } });

    if (findRole2) {
        console.log("Role 'Team_Lead' already exists");
    } else {
        const reqData2: any = {
            Name: "Team_Lead",
            Status: "Active",
            Is_deleted: false,
        };

        const createRole2 = await Role.create(reqData2);
        console.log("Role 'Team_Lead' created:", createRole2);
    }

    // Third demo Role
    const findRole3 = await Role.findOne({ where: { Name: "Employee" } });

    if (findRole3) {
        console.log("Role 'Team_Lead' already exists");
    } else {
        const reqData3: any = {
            Name: "Employee",
            Status: "Active",
            Is_deleted: false,
        };

        const createRole3 = await Role.create(reqData3);
        console.log("Role 'Team_Lead' created:", createRole3);
    }
};
