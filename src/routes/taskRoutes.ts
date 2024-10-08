import { Router, Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';
import Project from '../db/models/Tbl_Project';
import TaskDetails, { TaskDetailsInput } from '../db/models/Tbl_TaskDetails';
import { Op } from 'sequelize';
import Employee from '../db/models/Tbl_Employee';

const Task = Router();

// API to get tasks by employee ID
Task.get('/tasks/:empId', async (req: Request, res: Response) => {
    const empId = parseInt(req.params.empId);
  
    try {
      // Find projects associated with the employee
      const projects = await ProjectEmployee.findAll({
        where: { Emp_Id: empId, Is_deleted: false },
        include: [{ model: Project }],
      });
  
      if (projects.length === 0) {
        return res.status(404).json({ message: 'No projects found for this employee.' });
      }
  
      // Extract project ID and name (assuming the employee can be associated with only one project)
      const projectId = projects[0].Project_Id; // Get the first project ID
      const projectName = projects[0].Project?.Project_Name; // Get the first project name
  
      // Find tasks associated with the project
      const tasks = await TaskDetails.findAll({
        where: {
          Project_Id: projectId,
          Is_deleted: false,
        },
      });
  
      // Return project name and tasks in the response
      return res.status(200).json({
        projectId:projectId,
        ProjectName: projectName,
        Tasks: tasks,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while fetching tasks.' });
    }
  });

Task.post('/CreateTask', async (req:any, res:any) => {
    try {
      const {
        Emp_Id,
        Project_Id,
        Start_Time,
        Task_Details,
        End_Date,
        End_Time,
        Role_Id,
        Assigned_Emp_Id,
      } = req.body;


      const newTask = await TaskDetails.create({
        Emp_Id,
        Project_Id,
        Status :'In Progress',
        Start_Date :new Date(),
        Start_Time,
        Task_Details,
        End_Date,
        End_Time,
        Role_Id,
        Assigned_Emp_Id,
        Is_deleted: false, 
      });
  
      return res.status(201).json({
        message: 'Task created successfully',
        task: newTask,
      });
    } catch (error:any) {
      console.error(error);
      return res.status(500).json({
        message: 'Error creating task',
        error: error.message,
      });
    }
  });


  Task.get("/project-employees/:projectId/exclude/:employeeId", async (req: Request, res: Response) => {
    const { projectId, employeeId } = req.params;
  
    try {
      const projectEmployees = await ProjectEmployee.findAll({
        where: {
          Project_Id: projectId,
          Emp_Id: { [Op.ne]: employeeId }, 
          Is_deleted: false,
        },
        include: [
          {
            model: Employee,
            required: true,
            attributes: ['Emp_Id', 'Employee_name'], // Ensure this matches the model
          },
          {
            model: Project,
            required: true,
          },
        ],
        logging: console.log, // Log the generated SQL query
      });
  
      // Log the results to verify data before sending response
      console.log(JSON.stringify(projectEmployees, null, 2));
  
      res.status(200).json(projectEmployees);
    } catch (error) {
      console.error("Error fetching project employees:", error);
      res.status(500).json({ message: "An error occurred while fetching project employees." });
    }
  });
  
  
export default Task;
