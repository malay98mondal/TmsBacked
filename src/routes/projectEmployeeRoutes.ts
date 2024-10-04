import express, { Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';
import Employee from '../db/models/Tbl_Employee';
import Role from '../db/models/Tbl_Role';


const projectEmployeeRoutes = express.Router();

// 1. Create a new project employee by Project_Id
projectEmployeeRoutes.post('/:projectId', async (req: Request, res: Response) => {
    const projectIdString = req.params.projectId; // Get Project_Id from URL parameters
    const { Emp_Id } = req.body; // Get Emp_Id from request body

    try {
        // Validate input data
        if (!Emp_Id) {
            return res.status(400).json({
                success: false,
                message: 'Emp_Id is required.',
            });
        }

        // Convert Project_Id to a number
        const projectIdNumber = Number(projectIdString);

        // Create the new ProjectEmployee record
        const newProjectEmployee = await ProjectEmployee.create({
            Project_Id: projectIdNumber,
            Emp_Id, // Emp_Id from request body
            Is_deleted: false, // Default value
        });

        return res.status(201).json({
            success: true,
            data: newProjectEmployee,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create the project employee',
            error: error.message,
        });
    }
});


// Get API

// Get all project employees by Project_Id, including Employee_name
projectEmployeeRoutes.get('/:projectId', async (req:any, res: any) => {
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
                    attributes: ['Employee_name','Role_Id'], // Fetch only the Employee_name

                    include: [
                        {
                            model: Role, // Include the Role model
                            attributes: ['Name'], // Fetch only the Role_name
                            as: 'Role', // Use the alias here if defined
                        },
                    ],
                },


            ],
        });

        if (projectEmployees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No employees found for this project.',
            });
        }

        // Map the response to include Employee_name
        const response = projectEmployees.map((projectEmployee) => ({
            ProjectMember_Id: projectEmployee.ProjectMember_Id,
            Project_Id: projectEmployee.Project_Id,
            Emp_Id: projectEmployee.Emp_Id,
            Employee_name: projectEmployee.Employee?.Employee_name, // Assuming you've set up associations
           // Role_Id: projectEmployee.Employee?.Role_Id, // Assuming you've set up associations
            Name: projectEmployee.Employee?.Role?.Name, // Fetch Role_name from the Role model
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
