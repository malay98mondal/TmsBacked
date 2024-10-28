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

// Task.get('/tasks',authenticateTeamLead, async (req: any, res: any) => {
//   // const empId = parseInt(req.params.empId);
//   const empId = req.user.Emp_Id;

//   const { search = '', page = 1, limit = 5 } = req.query; // Get search query, page, and limit from request query
//   const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

//   try {
//     // Find projects associated with the employee
//     const projects = await ProjectEmployee.findAll({
//       where: { Emp_Id: empId, Is_deleted: false },
//       include: [{ model: Project }],
//     });

//     if (projects.length === 0) {
//       return res.status(404).json({ message: 'No projects found for this employee.' });
//     }

//     const projectId = projects[0].Project_Id;
//     const projectName = projects[0].Project?.Project_Name;

//     // Find tasks associated with the project, applying search and pagination
//     const tasks = await TaskDetails.findAndCountAll({
//       where: {
//         Project_Id: projectId,
//         Is_deleted: false,
//         [Op.or]: [
//           {
//             Task_Details: {
//               [Op.iLike]: `%${search}%`, // Case-insensitive search in Task_Details
//             },
//           },
//           {
//             '$Employee.Employee_name$': {
//               [Op.iLike]: `%${search}%`, // Case-insensitive search in Employee_name
//             },
//           },
//         ],
//       },
//       offset, // Apply pagination offset
//       limit: parseInt(limit as string), // Apply pagination limit
//       include: [
//         {
//           model: Employee, // Include the Employee model
//           attributes: ['Emp_Id', 'Employee_name'], // Specify attributes you want from Employee
//         },
//       ],
//     });

//     // Map through tasks to include employee id and name in each task
//     const tasksWithEmployeeInfo = tasks.rows.map((task) => ({
//       ...task.toJSON(),
//       employeeId: task.Employee?.Emp_Id, // Get employee ID from the included Employee model
//       employeeName: task.Employee?.Employee_name, // Get employee name from the included Employee model
//     }));

//     // Return paginated data with total count for frontend pagination
//     return res.status(200).json({
//       projectId,
//       projectName,
//       tasks: tasksWithEmployeeInfo,
//       total: tasks.count, // Total number of matching tasks
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred while fetching tasks.' });
//   }
// });

Task.get('/tasks', authenticateTeamLead, async (req: any, res: any) => {
  const empId = req.user.Emp_Id;
  const { search = '', page = 1, limit = 5, status, priority, dueDate, sortOrder = 'DESC' } = req.query; // Default to descending order (latest first)
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

    // Create a filter object for tasks based on query parameters
    const taskFilters: any = {
      Project_Id: projectId,
      Is_deleted: false,
      [Op.or]: [
        {
          Task_Details: {
            [Op.iLike]: `%${search}%`, // Case-insensitive search in Task_Details
          },
        },
        {
          Status: {
            [Op.iLike]: `%${search}%`, // Case-insensitive search in Task_Details

          },
        },
        {
          '$Employee.Employee_name$': {
            [Op.iLike]: `%${search}%`, // Case-insensitive search in Employee_name
          },
        },
      ],
    };

    // Apply additional filters if provided
    if (status) {
      taskFilters.Status = status; // Filter by task status
    }

    if (priority) {
      taskFilters.Priority = priority; // Filter by task priority
    }

    if (dueDate) {
      taskFilters.Due_Date = {
        [Op.lte]: new Date(dueDate), // Filter tasks due on or before the specified date
      };
    }

    // Find tasks associated with the project, applying search, filters, and pagination
    const tasks = await TaskDetails.findAndCountAll({
      where: taskFilters,
      offset, // Apply pagination offset
      limit: parseInt(limit as string), // Apply pagination limit
      order: [['createdAt', sortOrder]], // Sort by latest date (createdAt or updatedAt) in descending or ascending order
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


  Task.get("/project-employees/:projectId/exclude", authenticateTeamLead, async (req: any, res: any) => {
    const { projectId } = req.params;
    const employeeId = req.user.Emp_Id;
    const { search = '', limit = 10, offset = 0 } = req.query; // Get search term, limit, and offset from query parameters

    try {
        const projectEmployees = await ProjectEmployee.findAll({
            where: {
                Project_Id: projectId,
                Emp_Id: { [Op.ne]: employeeId }, 
                Is_deleted: false,
                [Op.or]: [ // Allow search in multiple fields
                    {
                        // Search in Degesination (Job Title) field
                        Degesination: { [Op.iLike]: `%${search}%` } // PostgreSQL case-insensitive search
                    },
                    {
                        // If you want to include search by employee name, use a join
                        '$Employee.Employee_name$': { [Op.iLike]: `%${search}%` } // Search in related Employee's name
                    }
                ]
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
            limit: parseInt(limit as string), // Limit results
            offset: parseInt(offset as string), // Pagination offset
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
            const acceptedFormats = ['MM/dd/yyyy', 'yyyy-MM-dd', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yy', 'dd/MM/yy'];
            let parsedDate;

            for (const format of acceptedFormats) {
                parsedDate = parse(dateString, format, new Date());
                if (isValid(parsedDate)) {
                    return parsedDate;
                }
            }
            throw new Error(`Invalid date format: ${dateString}`);
        };

        const formatDateWithTimezone = (date: Date, timeString: string) => {
            // Set the default time
            const [hours, minutes, seconds] = timeString.split(':');

            // Set the hours, minutes, and seconds on the date
            date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds.split('.')[0]), parseInt(seconds.split('.')[1]));

            // Format the date in YYYY-MM-DD HH:mm:ss.SSS±hh format
            const offset = date.getTimezoneOffset();
            const offsetHours = String(Math.abs(Math.floor(offset / 60))).padStart(2, '0');
            const offsetMinutes = String(Math.abs(offset % 60)).padStart(2, '0');
            const offsetSign = offset <= 0 ? '+' : '-';
            const formattedDate = date.toISOString().replace('Z', ''); // Remove 'Z' from UTC format

            return `${formattedDate.replace('T', ' ').substring(0, 23)}${offsetSign}${offsetHours}:${offsetMinutes}`;
        };

        const tasks = await Promise.all(
            data.map(async (row: any) => {
                try {
                    let { Start_Time, Task_Details, End_Date, End_Time, Role_Id, Assigned_Emp_Id } = row;

                    Start_Time = convertExcelTimeToTimeString(Start_Time);
                    End_Time = convertExcelTimeToTimeString(End_Time);
                    End_Date = parseDate(End_Date);

                    const formattedEndDateString = formatDateWithTimezone(End_Date, '07:10:58.017'); // Get the formatted string
                    const formattedEndDate = new Date(formattedEndDateString); // Convert to Date object
                    
                    return TaskDetails.create({
                        Emp_Id,
                        Project_Id,
                        Status: 'In Progress',
                        Start_Date: new Date(),
                        Start_Time,
                        Task_Details,
                        Actual_Start_Date: new Date(),
                        Actual_Start_Time: '',
                        End_Date: formattedEndDate, // Store the formatted End_Date
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
  
// Define the GET API to retrieve all employees for a specific project

// Define the GET API to retrieve employee details based on Project_Id
// Define the GET API to retrieve employee details based on authenticated employee and Role_Id = 2
// Define the GET API to retrieve employee details with role information
Task.get('/project-employees', authenticateTeamLead, async (req: any, res: any) => {
  try {
    const empId = req.user.Emp_Id; // Get the Emp_Id from authenticated user

    if (!empId) {
      return res.status(400).json({ message: 'Employee ID not found in the request.' });
    }

    // Step 1: Find the project where this employee has Role_Id = 2
    const projectEmployee = await ProjectEmployee.findOne({
      where: { Emp_Id: empId, Role_Id: 2, Is_deleted: false },
      attributes: ['Project_Id'], // Fetch Project_Id
    });

    if (!projectEmployee) {
      return res.status(404).json({ message: 'No project found for this employee with Role_Id = 2.' });
    }

    const projectId = projectEmployee.Project_Id;

    // Step 2: Fetch all employees for this project
    const projectEmployees = await ProjectEmployee.findAll({
      where: { Project_Id: projectId, Is_deleted: false },
      attributes: ['Emp_Id', 'Degesination', 'Role_Id'], // Fetch Emp_Id, Degesination, and Role_Id
    });

    if (projectEmployees.length === 0) {
      return res.status(404).json({ message: 'No employees found for this project.' });
    }

    // Step 3: Get Employee names and Role names from Employee and Role table
    const employeeDetails = await Promise.all(
      projectEmployees.map(async (projectEmployee) => {
        // Fetch Employee name from Employee table
        const employee = await Employee.findOne({
          where: { Emp_Id: projectEmployee.Emp_Id, Is_deleted: false },
          attributes: ['Emp_Id', 'Employee_name'], // Fetch Emp_Id and Employee_name
        });

        // Fetch Role name from Role table
        const role = await Role.findOne({
          where: { Role_Id: projectEmployee.Role_Id, Is_deleted: false },
          attributes: ['Role_Id', 'Name'], // Fetch Role_Id and Role Name
        });

        return {
          empId: employee?.Emp_Id || projectEmployee.Emp_Id, // In case employee is not found
          employeeName: employee?.Employee_name || 'Unknown', // In case employee is not found
          designation: projectEmployee.Degesination,
          roleName: role?.Name || 'Unknown', // In case role is not found
        };
      })
    );

    // Step 4: Return the employee details with role name
    return res.status(200).json({
      projectId,
      employees: employeeDetails,
    });
  } catch (error) {
    console.error('Error fetching employee data:', error); // Log the error
    return res.status(500).json({ message: 'An error occurred while fetching employee data.' });
  }
});



// get own task of teamLead

// Define the GET API to retrieve tasks for the authenticated employee where Role_Id = 2
// Define the GET API to retrieve project names and task details for the authenticated employee
Task.get('/team-lead-tasks', authenticateTeamLead, async (req: any, res: any) => {
  try {
    const assignedEmpId = req.user.Emp_Id; // Get the Emp_Id from the authenticated user

    if (!assignedEmpId) {
      return res.status(400).json({ message: 'Assigned employee ID not found in request.' });
    }

    // Step 1: Find unique project IDs and task details for tasks assigned to this employee
    const assignedTasks = await TaskDetails.findAll({
      where: {
        Assigned_Emp_Id: assignedEmpId, // Use Assigned_Emp_Id to match authenticated user ID
        Is_deleted: false, // Filter out deleted tasks
      },
      attributes: [
        'Task_details_Id', // Corrected field: Task ID
        'Task_Details', // Corrected field: Task Details
        'Emp_Id',
        'Project_Id',
        'Status',
        'Start_Date',
        'Start_Time',
        'End_Date',
        'End_Time',
        'Extend_Start_Date',
        'Extend_Start_Time',
        'Extend_End_Time',
        'Remarks',
        'Role_Id',
        'Assigned_Emp_Id',
        'Actual_Start_Date',
        'Actual_Start_Time',
        'Project_Id',    // Corrected field: Project ID
      ],
    });

    if (!assignedTasks.length) {
      return res.status(404).json({ message: 'No tasks found for this team leader.' });
    }

    // Step 2: Extract unique project IDs from assigned tasks
    const projectIds = [...new Set(assignedTasks.map(task => task.Project_Id))]; // Corrected field: Project ID

    // Step 3: Get project names using the unique project IDs
    const projects = await Project.findAll({
      where: {
        Project_Id: projectIds, // Corrected field: Project ID
        Is_deleted: false,      // Filter out deleted projects
      },
      attributes: [
        'Project_Id', // Corrected field: Project ID
        'Project_Name', // Corrected field: Project Name
      ],
    });

    // Step 4: Format the response to include project names and corresponding task details
    const projectTasks = projects.map(project => {
      // Filter tasks that match this project ID
      const tasks = assignedTasks
        .filter(task => task.Project_Id === project.Project_Id) // Corrected field: Project ID
        .map(task => ({
          Task_details_Id: task.Task_details_Id, // Corrected field: Task ID
          taskDetails: task.Task_Details, // Corrected field: Task Details
          Emp_Id:task.Emp_Id,
          Project_Id:task.Project_Id,
          Status: task.Status,
          Start_Date: task.Start_Date,
          Start_Time: task.Start_Time,
          End_Date: task.End_Date,
          End_Time:task.End_Time,
          Extend_Start_Date: task.Extend_Start_Date,
          Extend_Start_Time: task.Extend_Start_Time,
          Extend_End_Time: task.Extend_End_Time,
          Remarks: task.Remarks,
          Role_Id: task.Role_Id,
          Assigned_Emp_Id: task.Assigned_Emp_Id,
          Actual_Start_Date: task.Actual_Start_Date,
          Actual_Start_Time: task.Actual_Start_Time,
          //Project_Id: task.Project_Id,









          
          

        }));

      return {
        projectId: project.Project_Id, // Corrected field: Project ID
        projectName: project.Project_Name, // Corrected field: Project Name
        tasks, // Include task details associated with this project
      };
    });

    return res.status(200).json({ projectTasks });
  } catch (error) {
    console.error('Error fetching projects and tasks for team lead:', error);
    return res.status(500).json({ message: 'An error occurred while fetching projects and tasks.'});
  }
});  

//
Task.patch('/UpdateTask/:taskId', authenticateTeamLead, async (req: any, res: any) => {
  const { taskId } = req.params; // Get the task ID from the route parameters
  const Emp_Id = req.user.Emp_Id; // Get employee ID from the authenticated user

  try {
    const {
      Start_Time,
      Start_Date,
      Task_Details,
      End_Date,
      End_Time,
      Assigned_Emp_Id,
    } = req.body; // Destructure the fields from the request body

    // Find the task by its ID
    const task = await TaskDetails.findOne({ where: { Task_details_Id: taskId, Emp_Id } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Update the task with the new data, if it exists
    const updatedTask = await task.update({
      Start_Time: Start_Time || task.Start_Time,
      Start_Date: Start_Date || task.Start_Date,
      Task_Details: Task_Details || task.Task_Details,
      End_Date: End_Date || task.End_Date,
      End_Time: End_Time || task.End_Time,
      Assigned_Emp_Id: Assigned_Emp_Id || task.Assigned_Emp_Id,
    });

    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Error updating task',
      error: error.message,
    });
  }
});


  
export default Task;


