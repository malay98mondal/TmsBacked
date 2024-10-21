import { Router, Request, Response } from 'express';
import TaskDetails from '../../db/models/Tbl_TaskDetails';  // Adjust the path as per your project structure

const taskDetailsDeleteRoute = Router();

// Soft Delete API for TaskDetails by Assigned_Emp_Id
taskDetailsDeleteRoute.delete('/delete-task/:Assigned_Emp_Id', async (req: Request, res: Response) => {
    const { Task_details_Id } = req.params;  // Extract Assigned_Emp_Id from request parameters

    try {
        // Find all tasks for the assigned employee that are not already soft deleted
        const taskDetails = await TaskDetails.findAll({
            where: {
                Task_details_Id,
                Is_deleted: false,  // Fetch tasks that are not deleted
            }
        });

        // If no task details are found, return a 404 response
        if (taskDetails.length === 0) {
            return res.status(404).json({ message: 'No tasks found for the assigned employee to delete.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await Promise.all(
            taskDetails.map(async (task) => {
                await task.update({ Is_deleted: true });
            })
        );

        return res.status(200).json({ message: 'Tasks soft deleted successfully', taskDetails });
    } catch (error) {
        console.error('Error performing soft delete:', error);
        return res.status(500).json({ message: 'An error occurred while deleting tasks.' });
    }
});

export default taskDetailsDeleteRoute;
