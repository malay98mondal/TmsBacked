import express, { Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';


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

export default projectEmployeeRoutes;
