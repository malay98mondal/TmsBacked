import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import Employee from '../../db/models/Tbl_Employee';

const employeeRoute = Router();

employeeRoute.patch('/update-employee/:Emp_Id', async (req: Request, res: Response) => {
    const { Emp_Id } = req.params; // Extract Emp_Id from the route parameters
    const { Employee_name, Role_Id } = req.body; // Extract fields from the request body

    try {
        // Find the employee by Emp_Id and ensure it's not deleted (Is_deleted is false)
        const employee = await Employee.findOne({ where: { Emp_Id, Is_deleted: false } });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const errors: { field: string; message: string }[] = [];

        // Check if Employee_name is unique, excluding the current employee
        if (Employee_name) {
            const existingEmployee = await Employee.findOne({
                where: {
                    Employee_name,
                    Is_deleted: false,
                    Emp_Id: { [Op.ne]: Emp_Id }, // Exclude the current employee
                },
            });

            if (existingEmployee) {
                errors.push({ field: 'Employee_name', message: `An employee with the name '${Employee_name}' already exists.` });
            }
        }

        // If there are any conflicts, return the errors
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }

        // Update the employee if no conflicts are found
        await employee.update({
            Employee_name,
            Role_Id,
        });

        return res.status(200).json({ message: 'Employee updated successfully', employee });

    } catch (error) {
        console.error('Error in updating employee:', (error as Error).message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default employeeRoute;
