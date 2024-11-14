import { Router, Request, Response } from 'express';
import ProjectEmployee from '../../db/models/Tbl_ProjectEmployee'; // Adjust the path according to your project structure
import TaskDetails from '../../db/models/Tbl_TaskDetails';
import { Transaction } from "sequelize";
import sequelizeConnection from '../../db/config';
import transaction from 'sequelize/types/transaction';
import Employee from '../../db/models/Tbl_Employee';
import { authenticateManager } from '../../middleware/authenticateManager';

const projectEmployeeDeleteRoute = Router();

// Soft Delete API for ProjectEmployee by ProjectMember_Id
projectEmployeeDeleteRoute.delete('/delete-project-employee/:ProjectMember_Id', authenticateManager, async (req: Request, res: Response) => {
    const { ProjectMember_Id } = req.params; // Extract ProjectMember_Id from the route parameters

    try {
        // Find the ProjectEmployee by ProjectMember_Id and ensure it's not already soft deleted
        const projectEmployee = await ProjectEmployee.findOne({
            where: { ProjectMember_Id, Is_deleted: false }
        });

        // If the ProjectEmployee is not found, return a 404 response
        if (!projectEmployee) {
            return res.status(404).json({ message: 'ProjectEmployee not found or already deleted.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await projectEmployee.update({ Is_deleted: true });

        return res.status(200).json({ message: 'ProjectEmployee soft deleted successfully', projectEmployee });
    } catch (error) {
        console.error('Error in soft deleting ProjectEmployee:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the project employee.' });
    }
});


projectEmployeeDeleteRoute.delete('/projectEmployee/:projectId/:empId',authenticateManager, async (req: any, res: any) => {
    const { projectId, empId } = req.params;

  // Initialize a variable for the transaction instance
  let transaction: Transaction | null = null;

  try {
    // Start a transaction instance
    transaction = await sequelizeConnection.transaction();

    await ProjectEmployee.update(
      { Is_deleted: true },
      {
        where: {
          Project_Id: projectId,
          Emp_Id: empId,
        },
        transaction,
      }
    );

    // Step 2: Soft delete all TaskDetails related to this Project_Id and Emp_Id
    await TaskDetails.update(
      { Is_deleted: true },
      {
        where: {
          Project_Id: projectId,
          Assigned_Emp_Id: empId,
        },
        transaction,
      }
    );
    const employee = await Employee.findOne({
        where: {
          Emp_Id: empId,
        },
        transaction,
      });
  
      if (employee && employee.Role_Id === 2) {
        // Only update Role_Id to 3 if current Role_Id is 2
        await Employee.update(
          { Role_Id: 3 },
          {
            where: {
              Emp_Id: empId,
            },
            transaction,
          }
        );
      }

    await transaction.commit();
    res.status(200).json({ message: "Project employee soft-deleted and tasks marked as deleted successfully." });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error soft-deleting project employee and tasks:", error);
    res.status(500).json({ message: "An error occurred while soft-deleting project employee and tasks." });
  }
  });

export default projectEmployeeDeleteRoute;
