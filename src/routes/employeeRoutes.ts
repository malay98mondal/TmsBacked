import express, { Request, Response } from 'express';
import Employee from '../db/models/Tbl_Employee';

const employeeRoutes = express.Router();

// 1. Fetching all employee details
employeeRoutes.get('/GetEmployee', async (req: Request, res: Response) => {
    try {
        const employees = await Employee.findAll({ where: { Is_deleted: false } });
        return res.status(200).json({
            success: true,
            data: employees,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee details',
            error: error.message,
        });
    }
});



// 3. Fetching all employee details by Role_Id
employeeRoutes.get('/role/:roleId', async (req: Request, res: Response) => {
    const roleId = req.params.roleId;
    try {
        const employees = await Employee.findAll({
            where: {
                Role_Id: roleId,
                Is_deleted: false,
            },
        });

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No employees found for this role ID',
            });
        }

        return res.status(200).json({
            success: true,
            data: employees,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee details by role ID',
            error: error.message,
        });
    }
});

//post API

// 1. Create a new employee
employeeRoutes.post('/post', async (req: Request, res: Response) => {
    const { Employee_name, Role_Id } = req.body; // Add other employee attributes as needed

    try {
        // Validate input data
        if ( !Employee_name || !Role_Id) {
            return res.status(400).json({
                success: false,
                message: ' Employee_name, and Role_Id are required.',
            });
        }

        const newEmployee = await Employee.create({
           
            Employee_name,
            Role_Id,
            Is_deleted: false, // Default value
        });

        return res.status(201).json({
            success: true,
            data: newEmployee,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create the employee',
            error: error.message,
        });
    }
});

// 2. Create a new employee by Role_Id
employeeRoutes.post('/by-role/:roleId', async (req: any, res: any) => {
    const roleId = req.params.roleId;
    const { Project_Id, Employee_name } = req.body; // Add other employee attributes as needed

    try {
        // Validate input data
        if (!Project_Id || !Employee_name) {
            return res.status(400).json({
                success: false,
                message: 'Employee_name are required.',
            });
        }

        const newEmployee = await Employee.create({
            Employee_name,
            Role_Id: roleId,
            Is_deleted: false, // Default value
        });

        return res.status(201).json({
            success: true,
            data: newEmployee,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create the employee by Role_Id',
            error: error.message,
        });
    }
});

export default employeeRoutes;
