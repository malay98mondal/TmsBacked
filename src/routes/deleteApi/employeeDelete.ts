import { Router, Request, Response } from 'express';
import Employee from '../../db/models/Tbl_Employee'; // Adjust the path as per your project structure
import { Transaction } from "sequelize";
import sequelizeConnection from '../../db/config';
import ProjectEmployee from '../../db/models/Tbl_ProjectEmployee';
import TaskDetails from '../../db/models/Tbl_TaskDetails';
import { authenticateManager } from '../../middleware/authenticateManager';

const employeeDeleteRoute = Router();

// Soft Delete API for Employee by Emp_Id
// employeeDeleteRoute.delete('/delete-employee/:Emp_Id', async (req: Request, res: Response) => {
//     const { Emp_Id } = req.params; // Extract Emp_Id from request parameters

//     try {
//         // Find the employee by Emp_Id and ensure they are not already soft deleted
//         const employee = await Employee.findOne({
//             where: { Emp_Id, Is_deleted: false }
//         });

//         // If the employee is not found, return a 404 response
//         if (!employee) {
//             return res.status(404).json({ message: 'Employee not found or already deleted.' });
//         }

//         // Perform a soft delete by updating the Is_deleted field to true
//         await employee.update({ Is_deleted: true });

//         return res.status(200).json({ message: 'Employee soft deleted successfully', employee });
//     } catch (error) {
//         console.error('Error in performing soft delete for employee:', error);
//         return res.status(500).json({ message: 'An error occurred while deleting the employee.' });
//     }
// });

employeeDeleteRoute.delete('/delete-employee/:Emp_Id',authenticateManager, async (req: any, res: any) => {
    const { Emp_Id } = req.params;
  
    let transaction: Transaction | null = null;
  
    try {
      transaction = await sequelizeConnection.transaction();
  
      await Employee.update(
        { Is_deleted: true },
        {
          where: {
            Emp_Id: Emp_Id,
          },
          transaction,
        }
      );
  
      // Step 2: Soft delete the ProjectEmployee entries related to this employee
      await ProjectEmployee.update(
        { Is_deleted: true },
        {
          where: {
            Emp_Id: Emp_Id,
          },
          transaction,
        }
      );
  
      // Step 3: Soft delete all TaskDetails related to this employee
      await TaskDetails.update(
        { Is_deleted: true },
        {
          where: {
            Assigned_Emp_Id: Emp_Id,
          },
          transaction,
        }
      );
  
      // Step 4: Commit the transaction to save the changes
      await transaction.commit();
  
      res.status(200).json({ message: "Employee and related data soft-deleted successfully." });
    } catch (error) {
      // Rollback transaction in case of error
      if (transaction) await transaction.rollback();
      console.error("Error soft-deleting employee and related data:", error);
      res.status(500).json({ message: "An error occurred while soft-deleting employee and related data." });
    }
  });

export default employeeDeleteRoute;
