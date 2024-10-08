import { Router, Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';
import Project from '../db/models/Tbl_Project';
import TaskDetails, { TaskDetailsInput } from '../db/models/Tbl_TaskDetails';
import { Op } from 'sequelize';
import Employee from '../db/models/Tbl_Employee';

const EmploySideRoute = Router();


EmploySideRoute.get("/assigned/:Assigned_Emp_Id", async (req: Request, res: Response) => {
    const { Assigned_Emp_Id } = req.params;
  
    try {
      // Query the database to find all tasks assigned to the employee and include project name
      const taskDetails = await TaskDetails.findAll({
        where: {
          Assigned_Emp_Id: Assigned_Emp_Id,  // Filter by Assigned_Emp_Id
          Is_deleted: false,                 // Only fetch tasks that are not deleted
        }
      });
  
      // Check if tasks are found
      if (taskDetails.length > 0) {
        return res.status(200).json(taskDetails);
      } else {
        return res.status(404).json({ message: "No tasks found for the assigned employee." });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      return res.status(500).json({ message: "An error occurred while fetching task details." });
    }
  });

export default EmploySideRoute