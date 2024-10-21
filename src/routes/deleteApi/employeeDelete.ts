import { Router, Request, Response } from 'express';
import Employee from '../../db/models/Tbl_Employee'; // Adjust the path as per your project structure

const employeeDeleteRoute = Router();

// Soft Delete API for Employee by Emp_Id
employeeDeleteRoute.delete('/delete-employee/:Emp_Id', async (req: Request, res: Response) => {
    const { Emp_Id } = req.params; // Extract Emp_Id from request parameters

    try {
        // Find the employee by Emp_Id and ensure they are not already soft deleted
        const employee = await Employee.findOne({
            where: { Emp_Id, Is_deleted: false }
        });

        // If the employee is not found, return a 404 response
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or already deleted.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await employee.update({ Is_deleted: true });

        return res.status(200).json({ message: 'Employee soft deleted successfully', employee });
    } catch (error) {
        console.error('Error in performing soft delete for employee:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the employee.' });
    }
});

export default employeeDeleteRoute;
