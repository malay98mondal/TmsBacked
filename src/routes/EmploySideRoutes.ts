import { Router, Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';
import Project from '../db/models/Tbl_Project';
import TaskDetails, { TaskDetailsInput } from '../db/models/Tbl_TaskDetails';
import { Op } from 'sequelize';
import Employee from '../db/models/Tbl_Employee';
import { authenticateMember } from '../middleware/authenticateMember';

const EmploySideRoute = Router();


EmploySideRoute.get("/assigned",authenticateMember, async (req: any, res: any) => {
  const Assigned_Emp_Id = req.user.Emp_Id;
  const { page = 1, limit = 5, search = '' } = req.query; // Extract search, page, and limit from query parameters
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string); // Calculate offset

  try {
    // Query the database to find all tasks assigned to the employee and exclude completed tasks
    const { count, rows: taskDetails } = await TaskDetails.findAndCountAll({
      where: {
        Assigned_Emp_Id: Assigned_Emp_Id,  // Filter by Assigned_Emp_Id
        Is_deleted: false,                 // Only fetch tasks that are not deleted
        Status: {                          // Exclude tasks that are marked as completed
          [Op.ne]: 'Completed'             // Sequelize 'not equal' operator to exclude completed tasks
        },
        Task_Details: {                    // Search in Task_Details
          [Op.iLike]: `%${search}%`  
        },
      },
      limit: parseInt(limit as string),   // Set limit for pagination
      offset: offset,                      // Set offset for pagination
    });

    // Check if tasks are found
      return res.status(200).json({
        total: count,               
        page: parseInt(page as string),   
        limit: parseInt(limit as string),   
        tasks: taskDetails,                 
      });
    
  } catch (error) {
    console.error("Error fetching task details:", error);
    return res.status(500).json({ message: "An error occurred while fetching task details." });
  }
});


// EmploySideRoute.get("/CompletedTask/:Assigned_Emp_Id", async (req: Request, res: Response) => {
//   const { Assigned_Emp_Id } = req.params;
//   const search = req.query.search as string || ''; // Search term from query parameters
//   const page = parseInt(req.query.page as string) || 1; // Current page number
//   const limit = parseInt(req.query.limit as string) || 10; // Number of items per page
//   const offset = (page - 1) * limit; // Calculate offset for pagination

//   try {
//     // Query the database to find all tasks assigned to the employee that are completed
//     const taskDetails = await TaskDetails.findAndCountAll({
//       where: {
//         Assigned_Emp_Id: Assigned_Emp_Id, // Filter by Assigned_Emp_Id
//         Is_deleted: false, // Only fetch tasks that are not deleted
//         Status: 'Completed', // Only fetch completed tasks
//         ...(search && { // If a search term is provided, add the search condition
//           Task_Details: { [Op.like]: `%${search}%` }, // Assuming `Title` is the field to search
//         }),
//       },
//       limit: limit, // Limit the results per page
//       offset: offset, // Pagination offset
//     });

//     // Check if tasks are found
//     if (taskDetails.rows.length > 0) {
//       return res.status(200).json({
//         tasks: taskDetails.rows,
//         total: taskDetails.count, // Total number of matching tasks
//         totalPages: Math.ceil(taskDetails.count / limit), // Total number of pages
//         currentPage: page, // Current page
//       });
//     } else {
//       return res.status(404).json({ message: "No tasks found for the assigned employee." });
//     }
//   } catch (error) {
//     console.error("Error fetching task details:", error);
//     return res.status(500).json({ message: "An error occurred while fetching task details." });
//   }
// });

EmploySideRoute.get("/CompletedTask",authenticateMember, async (req: any, res: any) => {
  const Assigned_Emp_Id = req.user.Emp_Id;
  const { page = 1, limit = 5, search = '' } = req.query; // Extract search, page, and limit from query parameters
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string); // Calculate offset

  try {
    // Query the database to find all tasks assigned to the employee and exclude completed tasks
    const { count, rows: taskDetails } = await TaskDetails.findAndCountAll({
      where: {
        Assigned_Emp_Id: Assigned_Emp_Id,  // Filter by Assigned_Emp_Id
        Is_deleted: false,                 // Only fetch tasks that are not deleted
        Status: 'Completed', // Only fetch completed tasks
        Task_Details: {                    // Search in Task_Details
          [Op.iLike]: `%${search}%`  
        },
      },
      limit: parseInt(limit as string),   // Set limit for pagination
      offset: offset,                      // Set offset for pagination
    });

    // Check if tasks are found
   
      return res.status(200).json({
        total: count,               
        page: parseInt(page as string),   
        limit: parseInt(limit as string),   
        tasks: taskDetails,                 
      });

  } catch (error) {
    console.error("Error fetching task details:", error);
    return res.status(500).json({ message: "An error occurred while fetching task details." });
  }
});


  //update

  EmploySideRoute.put('/UpdateTask/:Task_details_Id', authenticateMember, async (req:any, res:any) => {
    try {
        const { Task_details_Id } = req.params;
        const { Status, Remarks, Actual_Start_Date, Actual_Start_Time } = req.body;
        const Emp_Id  = req.user.Emp_Id;

        // Find the task by Task_details_Id
        const task = await TaskDetails.findOne({
            where: { Task_details_Id, Is_deleted: false } // Ensure that the task is not soft-deleted
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        // Prepare update payload
        let updatePayload: any = { Status };

        // Handle Actual_Start_Date and Actual_Start_Time
        if (Actual_Start_Date && Actual_Start_Time) {
            // If both are provided, use them to update the task
            updatePayload.Actual_Start_Date = Actual_Start_Date;
            updatePayload.Actual_Start_Time = Actual_Start_Time;
        } else {
            // If either is missing, use Start_Date and Start_Time
            updatePayload.Actual_Start_Date = task.Start_Date; // Fallback to Start_Date
            updatePayload.Actual_Start_Time = task.Start_Time; // Fallback to Start_Time
        }

        // Check if Status is 'Completed' and Remarks is not empty
        if (Status === 'Completed' && Remarks) {
            // Get current date and time
            const currentDate = new Date();
            const currentTimeString = currentDate.toTimeString().split(' ')[0].slice(0, 5); // Format as HH:mm
          
            // Add Extend_End_Date and Extend_End_Time to update payload
            updatePayload.Extend_End_Date = currentDate; // update Set the current date 
            updatePayload.Extend_End_Time = currentTimeString; // Set the current time
        }

        // Always update Remarks if provided
        if (Remarks) {
            updatePayload.Remarks = Remarks;
        }

        //  // Get current date and time in IST (Asia/Kolkata)
        //  const currentDateIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        //  const formattedISTDate = new Date(currentDateIST); // Convert it back to a Date object
 
        //  // Set Modified_DateTime to current date and time in IST
        //  updatePayload.Modified_DateTime = formattedISTDate.toISOString(); // Convert to ISO format for the database

        

        //Set Modified_DateTime to current date and time
        updatePayload.Modified_DateTime = new Date();

        //Set Modified_By to Emp_Id
        updatePayload.Modified_By = Emp_Id;
        

        // Update the task
        const updatedTask = await task.update(updatePayload);
        

        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
        
    } catch (error) {
        const errorMessage = (error as Error).message || 'Error updating task';
        console.error(error);
        return res.status(500).json({
            message: errorMessage
        });
    }
});



export default EmploySideRoute