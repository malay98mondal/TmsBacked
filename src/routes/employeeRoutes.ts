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
        const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1
        const pageSize = 10; // Number of employees to return per page (can be adjusted)
        const searchTerm = req.query.searchTerm ? req.query.searchTerm : ''; // Get search term from query params

        // Calculate offset for pagination
        const offset = (page - 1) * pageSize;

        const employees = await Employee.findAndCountAll({
            where: {
                Is_deleted: false,
                Emp_Id: {
                    [Op.ne]: userIdToExclude,  // Exclude the employee with the id from the token
                },
                // Add search filter for employee name (or other fields as necessary)
                [Op.or]: [
                    {
                        Employee_name: {
                            [Op.iLike]: `%${searchTerm}%`, // Case insensitive search
                        },
                    },
                    // You can add more fields here if necessary
                    // {
                    //     AnotherField: {
                    //         [Op.iLike]: `%${searchTerm}%`,
                    //     },
                    // },
                ],
            },
            limit: pageSize,
            offset: offset,
        });

        // Calculate total pages
        const totalPages = Math.ceil(employees.count / pageSize);

        return res.status(200).json({
            success: true,
            data: employees.rows, // Return the paginated employees
            totalPages: totalPages,
            currentPage: page,
            totalEmployees: employees.count,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee details',
            error: error.message,
        });
    }
});
employeeRoutes.get('/GetEmployee1', authenticateManager, async (req: any, res: any) => {
    try {
        const userIdToExclude = req.user.Emp_Id;
        const { page = 1, limit = 10, search = '' } = req.query; // Defaults and query params

        const numericPage = parseInt(page); // Convert to number
        const numericLimit = parseInt(limit); // Convert to number
        const offset = (numericPage - 1) * numericLimit; // Offset for pagination

        const whereClause: any = {
            Is_deleted: false,
            Emp_Id: {
                [Op.ne]: userIdToExclude,
            },
        };

        if (search) {
            whereClause.Employee_name = {
                [Op.iLike]: `%${search}%`,
            };
        }

        const { rows: employees, count: total } = await Employee.findAndCountAll({
            where: whereClause,
            limit: numericLimit, // Use numeric limit
            offset: offset, // Use numeric offset
        });

        return res.status(200).json({
            success: true,
            data: employees,
            total, // Total number of employees matching the query
            page: numericPage,
            totalPages: Math.ceil(total / numericLimit),
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
            Role_Id: 3,
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
