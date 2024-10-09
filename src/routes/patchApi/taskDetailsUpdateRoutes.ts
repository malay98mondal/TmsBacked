import { Router } from 'express';
import { Op } from 'sequelize';
import TaskDetails from '../../db/models/Tbl_TaskDetails'; // Adjust the import path based on your project structure

const taskDetailsUpdateRoute = Router();

taskDetailsUpdateRoute.patch('/update-task/:Task_details_Id', async (req: any, res: any) => {
    const { Task_details_Id } = req.params; // Extract Task_details_Id from the route parameters
    const {
        Emp_Id,
        Project_Id,
        Status,
        Start_Date,
        Start_Time,
        Task_Details,
        End_Date,
        End_Time,
        Extend_Start_Date,
        Extend_Start_Time,
        Extend_End_Date,
        Extend_End_Time,
        Remarks,
        Modified_By
    } = req.body; // Extract fields from the request body

    try {
        // Find the task details by Task_details_Id and ensure it's not deleted (Is_deleted is false)
        const taskDetails = await TaskDetails.findOne({ where: { Task_details_Id, Is_deleted: false } });

        if (!taskDetails) {
            return res.status(404).json({ message: 'Task details not found' });
        }

        // Update the task details if found
        await taskDetails.update({
            Emp_Id,
            Project_Id,
            Status,
            Start_Date,
            Start_Time,
            Task_Details,
            End_Date,
            End_Time,
            Extend_Start_Date,
            Extend_Start_Time,
            Extend_End_Date,
            Extend_End_Time,
            Remarks,
            Modified_By,
            Modified_DateTime: new Date() // Set the modified date to now
        });

        return res.status(200).json({ message: 'Task details updated successfully', taskDetails });

    } catch (error) {
        console.error('Error in updating task details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default taskDetailsUpdateRoute;
