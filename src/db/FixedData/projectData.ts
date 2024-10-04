// services/projectService.ts

import Project from "../models/Tbl_Project";


export const addProject = async () => {
    // First demo project
    const findProject1 = await Project.findOne({ where: { Project_Name: "EMS" } });

    if (findProject1) {
        console.log("Project 'EMS' already exists");
    } else {
        const reqData1: any = {
            Project_Name: "EMS",
            Status: "Active",
            Is_deleted: false,
        };

        const createProject1 = await Project.create(reqData1);
        console.log("Project 'EMS' created:", createProject1);
    }

    // Second demo project
    const findProject2 = await Project.findOne({ where: { Project_Name: "Amb" } });

    if (findProject2) {
        console.log("Project 'Amb' already exists");
    } else {
        const reqData2: any = {
            Project_Name: "Amb",
            Status: "Active",
            Is_deleted: false,
        };

        const createProject2 = await Project.create(reqData2);
        console.log("Project 'Amb' created:", createProject2);
    }
};
