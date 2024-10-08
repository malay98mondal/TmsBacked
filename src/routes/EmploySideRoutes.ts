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


  //update

  EmploySideRoute.put('/UpdateTask/:Task_details_Id', async (req, res) => {
    try {
        const { Task_details_Id } = req.params; // Get the Task_details_Id from the URL parameter
        const {
            Status,
            Extend_Start_Date,
            Extend_Start_Time,
            Extend_End_Date,
            Extend_End_Time,
            Remarks
        } = req.body; // Extract data from request body

        // Find the task by Task_details_Id
        const task = await TaskDetails.findOne({
            where: { Task_details_Id, Is_deleted: false } // Ensure that the task is not soft-deleted
        });

        // If the task does not exist, return a 404 error
        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        // Update the task with the new values
        const updatedTask = await task.update({
            Status,
            Extend_Start_Date,
            Extend_Start_Time,
            Extend_End_Date,
            Extend_End_Time,
            Remarks
        });

        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        // Assert the error type and handle unknown errors safely
        const errorMessage = (error as Error).message || 'Error updating task';
        console.error(error);
        return res.status(500).json({
            message: errorMessage
        });
    }
});
export default EmploySideRoute