import express, { Request, Response } from 'express';
import Employee from '../db/models/Tbl_Employee';
import Role from '../db/models/Tbl_Role';
import { authenticateManager } from '../middleware/authenticateManager';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

const employeeRoutes = express.Router();

employeeRoutes.get('/GetEmployee', authenticateManager, async (req: any, res: any) => {
    try {
        const userIdToExclude = req.user.Emp_Id;

        const employees = await Employee.findAll({
            where: {
                Is_deleted: false,
                Emp_Id: {
                    [Op.ne]: userIdToExclude,  // Exclude the employee with the id from the token
                },
            },  
        });

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

employeeRoutes.post('/post',authenticateManager, async (req: Request, res: Response) => {
    const { Employee_name, email, password } = req.body;

    try {
        if (!Employee_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Employee name, email, and password are required.',
            });
        }

        const existingEmployee = await Employee.findOne({ 
            where: { 
                email, 
                Is_deleted: false
            } 
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Email is already in use.',
            });
        }

        // Hash the password
        const hashed_password = bcrypt.hashSync(password, 7);

        const newEmployee = await Employee.create({
            Employee_name,
            Role_Id: 2,
            email,
            password: hashed_password,
            Is_deleted: false,
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

Employee.belongsTo(Role, { foreignKey: 'Role_Id', as: 'Role' }); // Ensure to use an alias if needed
export default employeeRoutes;
