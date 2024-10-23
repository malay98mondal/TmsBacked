import { Router, Request, Response } from 'express';
import ProjectEmployee from '../db/models/Tbl_ProjectEmployee';
import Project from '../db/models/Tbl_Project';
import TaskDetails, { TaskDetailsInput } from '../db/models/Tbl_TaskDetails';
import { Op } from 'sequelize';
import Employee from '../db/models/Tbl_Employee';
import multer from 'multer';
import xlsx from 'xlsx';
import Role from '../db/models/Tbl_Role';
import { authenticateTeamLead } from '../middleware/autherticateTeamLead';
import { parse, isValid } from 'date-fns';

const Task = Router();

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

Task.get('/tasks',authenticateTeamLead, async (req: any, res: any) => {
  // const empId = parseInt(req.params.empId);
  const empId = req.user.Emp_Id;

  const { search = '', page = 1, limit = 5 } = req.query; // Get search query, page, and limit from request query
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  try {
    // Find projects associated with the employee
    const projects = await ProjectEmployee.findAll({
      where: { Emp_Id: empId, Is_deleted: false },
      include: [{ model: Project }],
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this employee.' });
    }

    const projectId = projects[0].Project_Id;
    const projectName = projects[0].Project?.Project_Name;

    // Find tasks associated with the project, applying search and pagination
    const tasks = await TaskDetails.findAndCountAll({
      where: {
        Project_Id: projectId,
        Is_deleted: false,
        [Op.or]: [
          {
            Task_Details: {
              [Op.iLike]: `%${search}%`, // Case-insensitive search in Task_Details
            },
          },
          {
            '$Employee.Employee_name$': {
              [Op.iLike]: `%${search}%`, // Case-insensitive search in Employee_name
            },
          },
        ],
      },
      offset, // Apply pagination offset
      limit: parseInt(limit as string), // Apply pagination limit
      include: [
        {
          model: Employee, // Include the Employee model
          attributes: ['Emp_Id', 'Employee_name'], // Specify attributes you want from Employee
        },
      ],
    });

    // Map through tasks to include employee id and name in each task
    const tasksWithEmployeeInfo = tasks.rows.map((task) => ({
      ...task.toJSON(),
      employeeId: task.Employee?.Emp_Id, // Get employee ID from the included Employee model
      employeeName: task.Employee?.Employee_name, // Get employee name from the included Employee model
    }));

    // Return paginated data with total count for frontend pagination
    return res.status(200).json({
      projectId,
      projectName,
      tasks: tasksWithEmployeeInfo,
      total: tasks.count, // Total number of matching tasks
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while fetching tasks.' });
  }
});



Task.post('/CreateTask',authenticateTeamLead, async (req:any, res:any) => {
  const Emp_Id = req.user.Emp_Id;

    try {
      const {
        Project_Id,
        Start_Time,
        Start_Date,
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
        Start_Date ,
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


  Task.get("/project-employees/:projectId/exclude",authenticateTeamLead, async (req: any, res: any) => {
    const { projectId } = req.params;
    const employeeId = req.user.Emp_Id;

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
  
  // Task.post('/importTasks/:Project_Id', authenticateTeamLead, upload.single('file'), async (req: any, res: Response) => {
  //   try {
  //     // Check if a file is uploaded
  //     if (!req.file) {
  //       return res.status(400).json({ message: 'No file uploaded' });
  //     }
  //     const { Project_Id } = req.params;
  //     const Emp_Id = req.user.Emp_Id;
  
  //     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  //     const sheetName = workbook.SheetNames[0]; // Get the first sheet
  //     const sheet = workbook.Sheets[sheetName];
  //     const data = xlsx.utils.sheet_to_json(sheet); // Convert the sheet to JSON format
  
  //     // Helper function to convert Excel time fractions to HH:mm format
  //     const convertExcelTimeToTimeString = (excelTime: any) => {
  //       if (typeof excelTime === 'number') {
  //         const totalMinutes = Math.round(excelTime * 24 * 60); // Convert days fraction to total minutes
  //         const hours = Math.floor(totalMinutes / 60);
  //         const minutes = totalMinutes % 60;
  //         return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  //       }
  //       return excelTime; // If it's not a number, return as it is
  //     };
  
  //     // Iterate over each row in the Excel sheet and create tasks
  //     const tasks = await Promise.all(data.map(async (row: any) => {
  //       let {
  //         Start_Time,
  //         Task_Details,
  //         End_Date,
  //         End_Time,
  //         Role_Id,
  //         Assigned_Emp_Id,
  //       } = row;
  
  //       // Convert Excel time fractions to proper time strings in HH:mm format
  //       Start_Time = convertExcelTimeToTimeString(Start_Time);
  //       End_Time = convertExcelTimeToTimeString(End_Time);
  
  //       return TaskDetails.create({
  //         Emp_Id,
  //         Project_Id,
  //         Status: 'In Progress',
  //         Start_Date: new Date(),
  //         Start_Time,
  //         Task_Details,
  //         Actual_Start_Date: new Date(),
  //         Actual_Start_Time:'',
  //         End_Date,
  //         End_Time,
  //         Role_Id,
  //         Assigned_Emp_Id,
  //         Is_deleted: false,
  //       });
  //     }));
  
  //     return res.status(201).json({
  //       message: 'Tasks imported successfully',
  //       tasks,
  //     });
  //   } catch (error: any) {
  //     console.error(error);
  //     return res.status(500).json({
  //       message: 'Error importing tasks',
  //       error: error.message,
  //     });
  //   }
  // });
  

  Task.post('/importTasks/:Project_Id', authenticateTeamLead, upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const { Project_Id } = req.params;
      const Emp_Id = req.user.Emp_Id;
  
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet); 
  
      const convertExcelTimeToTimeString = (excelTime: any) => {
        if (typeof excelTime === 'number') {
          const totalMinutes = Math.round(excelTime * 24 * 60); 
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        return excelTime; 
      };
  
      const parseDate = (dateString: any) => {
        const acceptedFormats = ['MM/dd/yyyy', 'yyyy-MM-dd','yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yy', 'dd/MM/yy'];
        let parsedDate;
  
        for (const format of acceptedFormats) {
          parsedDate = parse(dateString, format, new Date());
          if (isValid(parsedDate)) {
            return parsedDate;
          }
        }
        throw new Error(`Invalid date format: ${dateString}`);
      };
  
      const tasks = await Promise.all(
        data.map(async (row: any) => {
          try {
            let { Start_Time, Task_Details, End_Date, End_Time, Role_Id, Assigned_Emp_Id } = row;
  
            Start_Time = convertExcelTimeToTimeString(Start_Time);
            End_Time = convertExcelTimeToTimeString(End_Time);
            End_Date = parseDate(End_Date);
  
            return TaskDetails.create({
              Emp_Id,
              Project_Id,
              Status: 'In Progress',
              Start_Date: new Date(),
              Start_Time,
              Task_Details,
              Actual_Start_Date: new Date(),
              Actual_Start_Time: '',
              End_Date,
              End_Time,
              Role_Id,
              Assigned_Emp_Id,
              Is_deleted: false,
            });
          } catch (rowError: unknown) {
            if (rowError instanceof Error) {
              console.error(`Error processing row: ${rowError.message}`);
              throw rowError;
            } else {
              console.error(`Unexpected error processing row`);
              throw new Error('Unexpected error processing row');
            }
          }
        })
      );
  
      return res.status(201).json({
        message: 'Tasks imported successfully',
        tasks,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({
          message: 'Error importing tasks',
          error: error.message,
        });
      } else {
        console.error('Unexpected error');
        return res.status(500).json({
          message: 'Unexpected error',
        });
      }
    }
  });
  
// Task.get("/task-details/:id",authenticateTeamLead, async (req: Request, res: Response) => {
//     const { id } = req.params;
  
//     try {
//       // Step 1: Fetch the task details
//       const taskDetails = await TaskDetails.findOne({
//         where: { Task_details_Id: id, Is_deleted: false }, // Only fetch if not deleted
//       });
  
//       if (!taskDetails) {
//         return res.status(404).json({ message: "Task not found" });
//       }
  
//       // Step 2: Extract Emp_Id and Role_Id
//       const { Assigned_Emp_Id, Role_Id,Project_Id } = taskDetails;
  
//       // Step 3: Fetch Employee details
//       const employee = await Employee.findOne({
//         where: { Emp_Id:Assigned_Emp_Id }, // Assuming Emp_Id is the primary key for Employee
//         attributes: ['Emp_Id', 'Employee_name'], // Specify the fields you want
//       });
  
//       // Step 4: Fetch Role details
//       const role = await Role.findOne({
//         where: { Role_Id }, // Assuming Role_Id is the primary key for Role
//         attributes: ['Role_Id', 'Name'], // Specify the fields you want
//       });
//       const project = await Project.findOne({
//         where: { Project_Id:Project_Id }, // Assuming Emp_Id is the primary key for Employee
//         attributes: [ 'Project_Name'], // Specify the fields you want
//       });
  
//       // Combine the results
//       const result = {
//         taskDetails,
//         employee: employee || null, // Set to null if employee is not found
//         role: role || null,
//         project :project|| null
//       };
  
//       return res.status(200).json(result);
//     } catch (error) {
//       console.error("Error fetching task details:", error);
//       return res.status(500).json({ message: "An error occurred while fetching the task details" });
//     }
//   });
  
Task.get("/task-details/:id", authenticateTeamLead, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      // Step 1: Fetch the task details from TaskDetails table
      const taskDetails = await TaskDetails.findOne({
          where: { Task_details_Id: id, Is_deleted: false }, // Only fetch if not deleted
      });

      if (!taskDetails) {
          return res.status(404).json({ message: "Task not found" });
      }

      // Step 2: Extract Assigned_Emp_Id from TaskDetails
      const { Assigned_Emp_Id, Project_Id } = taskDetails;

      // Step 3: Fetch Employee details, which includes Role_Id
      const employee = await Employee.findOne({
          where: { Emp_Id: Assigned_Emp_Id }, // Find employee by Emp_Id
          attributes: ['Emp_Id', 'Employee_name', 'Role_Id'], // Include Role_Id
      });

      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      // Step 4: Fetch Role details using Role_Id from Tbl_Employee
      const { Role_Id } = employee;
      const role = await Role.findOne({
          where: { Role_Id }, // Find role by Role_Id
          attributes: ['Role_Id', 'Name'], // Specify the fields to retrieve
      });

      if (!role) {
          return res.status(404).json({ message: "Role not found" });
      }

      // Step 5: Fetch Project details using Project_Id
      const project = await Project.findOne({
          where: { Project_Id }, // Find project by Project_Id
          attributes: ['Project_Name'], // Specify the fields to retrieve
      });

      // Combine the results
      const result = {
          taskDetails,
          employee: {
              Emp_Id: employee.Emp_Id,
              Employee_name: employee.Employee_name,
          },
          role: {
              Role_Id: role.Role_Id,
              Name: role.Name,
          },
          project: project ? { Project_Name: project.Project_Name } : null
      };

      return res.status(200).json(result);
  } catch (error) {
      console.error("Error fetching task details:", error);
      return res.status(500).json({ message: "An error occurred while fetching the task details" });
  }
});  
  
export default Task;




