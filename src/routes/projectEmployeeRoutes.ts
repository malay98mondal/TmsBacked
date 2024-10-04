import express, { Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';
import Employee from '../db/models/Tbl_Employee';
import Role from '../db/models/Tbl_Role';
import Project from '../db/models/Tbl_Project';


const projectEmployeeRoutes = express.Router();

projectEmployeeRoutes.post('/:projectId', async (req: any, res: any) => {
    const projectIdString = req.params.projectId; // Get Project_Id from URL parameters
    const { Emp_Id, Role_Id } = req.body; // Get Emp_Id and Role_Id from request body

    try {
        // Validate input data
        if (!Emp_Id || !Role_Id) {
            return res.status(400).json({
                success: false,
                message: 'Both Emp_Id and Role_Id are required.',
            });
        }

        // Convert Project_Id to a number
        const projectIdNumber = Number(projectIdString);

        // Check if the employee exists
        const employee = await Employee.findByPk(Emp_Id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.',
            });
        }

        // Update Role_Id of the employee in the Employee table
        await Employee.update(
            { Role_Id }, // Set new Role_Id from request body
            { where: { Emp_Id } } // Find employee by Emp_Id
        );

        // Check if the ProjectEmployee record already exists
        const existingProjectEmployee = await ProjectEmployee.findOne({
            where: {
                Project_Id: projectIdNumber,
                Emp_Id: Emp_Id,
            },
        });

        if (existingProjectEmployee) {
            // If the ProjectEmployee exists, update it
            await ProjectEmployee.update(
                { Role_Id }, // Update Role_Id
                { where: { ProjectMember_Id: existingProjectEmployee.ProjectMember_Id } } // Use the existing ProjectEmployee ID
            );

            return res.status(200).json({
                success: true,
                message: 'Project employee role updated successfully.',
                data: existingProjectEmployee,
            });
        } else {
            // If the ProjectEmployee does not exist, create a new record
            const newProjectEmployee = await ProjectEmployee.create({
                Project_Id: projectIdNumber,
                Emp_Id, // Use Emp_Id from request body
                Role_Id, // Use Role_Id from request body
                Is_deleted: false, // Default value
            });

            return res.status(201).json({
                success: true,
                message: 'Project employee created and role updated successfully.',
                data: newProjectEmployee,
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create or update the project employee',
            error: error.message,
        });
    }
});


// Get API

// // Get all project employees by Project_Id, including Employee_name
projectEmployeeRoutes.get('/:projectId', async (req: any, res: any) => {
    const projectIdString = req.params.projectId; // Get Project_Id from URL parameters

    try {
        // Convert Project_Id to a number
        const projectIdNumber = Number(projectIdString);

        // Fetch project employees by Project_Id
        const projectEmployees = await ProjectEmployee.findAll({
            where: {
                Project_Id: projectIdNumber,
                Is_deleted: false, // Optional: Only fetch non-deleted records
            },
            include: [
                {
                    model: Employee, // Include the Employee model
                    attributes: ['Employee_name', 'Role_Id'], // Fetch Employee_name and Role_Id

                    include: [
                        {
                            model: Role, // Include the Role model
                            attributes: ['Name'], // Fetch the Role name
                            as: 'Role', // Use the alias here if defined
                        },
                    ],
                },
                {
                    model: Project, // Include the Project model to fetch the project name
                    attributes: ['Project_Name'], // Fetch only the Project_Name
                },
            ],
        });

        if (projectEmployees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No employees found for this project.',
            });
        }

        // Map the response to include Employee_name and Project_Name
        const response = projectEmployees.map((projectEmployee) => ({
            ProjectMember_Id: projectEmployee.ProjectMember_Id,
            Project_Id: projectEmployee.Project_Id,
            Emp_Id: projectEmployee.Emp_Id,
            Employee_name: projectEmployee.Employee?.Employee_name, // Employee name
            Role_Id: projectEmployee.Employee?.Role_Id, // Role ID
            Role_Name: projectEmployee.Employee?.Role?.Name, // Role name from Role model
            Project_Name: projectEmployee.Project?.Project_Name, // Project name from Project model
            Is_deleted: projectEmployee.Is_deleted,
        }));

        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve project employees',
            error: error.message,
        });
    }
});

export default projectEmployeeRoutes;
