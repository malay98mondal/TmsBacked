import { Router, Request, Response } from 'express';
import Project from '../../db/models/Tbl_Project'; // Adjust the path according to your project structure
import sequelizeConnection from '../../db/config';
import ProjectEmployee from '../../db/models/Tbl_ProjectEmployee';
import TaskDetails from '../../db/models/Tbl_TaskDetails';
import { Transaction } from "sequelize";
import { authenticateManager } from '../../middleware/authenticateManager';

const projecDeletetRoute = Router();

// Soft Delete API for Project by Project_Id
projecDeletetRoute.delete('/delete-project/:Project_Id',authenticateManager, async (req: Request, res: Response) => {
    const { Project_Id } = req.params; // Extract Project_Id from the route parameters

    try {
        // Find the Project by Project_Id and ensure it's not already soft deleted
        const project = await Project.findOne({
            where: { Project_Id, Is_deleted: false }
        });

        // If the Project is not found, return a 404 response
        if (!project) {
            return res.status(404).json({ message: 'Project not found or already deleted.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await project.update({ Is_deleted: true });

        return res.status(200).json({ message: 'Project soft deleted successfully', project });
    } catch (error) {
        console.error('Error in soft deleting Project:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the project.' });
    }
});

projecDeletetRoute.delete("/projects/:projectId",authenticateManager, async (req: any, res: any) => {
    const { projectId } = req.params;
    let transaction: Transaction | null = null;

    try {
      // Start a transaction to ensure all operations are atomic
      transaction = await sequelizeConnection.transaction();
  
      // Soft delete the Project
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      await project.update({ Is_deleted: true }, { transaction });
  
      // Soft delete associated ProjectMembers
      await ProjectEmployee.update(
        { Is_deleted: true },
        {
          where: {
            Project_Id: projectId,
          },
          transaction,
        }
      );
  
    
      // Soft delete related Tasks
      await TaskDetails.update(
        { Is_deleted: true },
        {
          where: {
            Project_Id: projectId,
          },
          transaction,
        }
      );
  

      const projectEmployees = await ProjectEmployee.findAll({
        where: {
          Project_Id: projectId,
          Role_Id: 2,
        },
        transaction,
      });
  
      for (let employee of projectEmployees) {
        // Update the Role_Id to 3 for employees with Role_Id 2
        await employee.update(
          { Role_Id: 3 },
          { transaction }
        );
      }
      // Commit the transaction
      await transaction.commit();
  
      res.status(200).json({ message: "Project and related data soft deleted successfully" });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error soft-deleting project employee and tasks:", error);
        res.status(500).json({ message: "An error occurred while soft-deleting project." });
      }
  });

export default projecDeletetRoute;
