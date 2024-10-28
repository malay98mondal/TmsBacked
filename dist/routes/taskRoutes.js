"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tbl_ProjectEmployee_1 = __importDefault(require("../db/models/Tbl_ProjectEmployee"));
const Tbl_Project_1 = __importDefault(require("../db/models/Tbl_Project"));
const Tbl_TaskDetails_1 = __importDefault(require("../db/models/Tbl_TaskDetails"));
const sequelize_1 = require("sequelize");
const Tbl_Employee_1 = __importDefault(require("../db/models/Tbl_Employee"));
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const Tbl_Role_1 = __importDefault(require("../db/models/Tbl_Role"));
const autherticateTeamLead_1 = require("../middleware/autherticateTeamLead");
const date_fns_1 = require("date-fns");
const Task = (0, express_1.Router)();
// Multer configuration for file upload
const storage = multer_1.default.memoryStorage(); // Store files in memory
const upload = (0, multer_1.default)({ storage });
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
Task.get('/tasks', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const empId = req.user.Emp_Id;
    const { search = '', page = 1, limit = 5, status, priority, dueDate, sortOrder = 'DESC' } = req.query; // Default to descending order (latest first)
    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
        // Find projects associated with the employee
        const projects = yield Tbl_ProjectEmployee_1.default.findAll({
            where: { Emp_Id: empId, Is_deleted: false },
            include: [{ model: Tbl_Project_1.default }],
        });
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this employee.' });
        }
        const projectId = projects[0].Project_Id;
        const projectName = (_a = projects[0].Project) === null || _a === void 0 ? void 0 : _a.Project_Name;
        // Create a filter object for tasks based on query parameters
        const taskFilters = {
            Project_Id: projectId,
            Is_deleted: false,
            [sequelize_1.Op.or]: [
                {
                    Task_Details: {
                        [sequelize_1.Op.iLike]: `%${search}%`, // Case-insensitive search in Task_Details
                    },
                },
                {
                    '$Employee.Employee_name$': {
                        [sequelize_1.Op.iLike]: `%${search}%`, // Case-insensitive search in Employee_name
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
                [sequelize_1.Op.lte]: new Date(dueDate), // Filter tasks due on or before the specified date
            };
        }
        // Find tasks associated with the project, applying search, filters, and pagination
        const tasks = yield Tbl_TaskDetails_1.default.findAndCountAll({
            where: taskFilters,
            offset,
            limit: parseInt(limit),
            order: [['createdAt', sortOrder]],
            include: [
                {
                    model: Tbl_Employee_1.default,
                    attributes: ['Emp_Id', 'Employee_name'], // Specify attributes you want from Employee
                },
            ],
        });
        // Map through tasks to include employee id and name in each task
        const tasksWithEmployeeInfo = tasks.rows.map((task) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, task.toJSON()), { employeeId: (_a = task.Employee) === null || _a === void 0 ? void 0 : _a.Emp_Id, employeeName: (_b = task.Employee) === null || _b === void 0 ? void 0 : _b.Employee_name }));
        });
        // Return paginated data with total count for frontend pagination
        return res.status(200).json({
            projectId,
            projectName,
            tasks: tasksWithEmployeeInfo,
            total: tasks.count,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetching tasks.' });
    }
}));
Task.post('/CreateTask', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Emp_Id = req.user.Emp_Id;
    try {
        const { Project_Id, Start_Time, Start_Date, Task_Details, End_Date, End_Time, Role_Id, Assigned_Emp_Id, } = req.body;
        const newTask = yield Tbl_TaskDetails_1.default.create({
            Emp_Id,
            Project_Id,
            Status: 'In Progress',
            Start_Date,
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creating task',
            error: error.message,
        });
    }
}));
Task.get("/project-employees/:projectId/exclude", autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const employeeId = req.user.Emp_Id;
    const { search = '', limit = 10, offset = 0 } = req.query; // Get search term, limit, and offset from query parameters
    try {
        const projectEmployees = yield Tbl_ProjectEmployee_1.default.findAll({
            where: {
                Project_Id: projectId,
                Is_deleted: false,
                [sequelize_1.Op.or]: [
                    {
                        // Search in Degesination (Job Title) field
                        Degesination: { [sequelize_1.Op.iLike]: `%${search}%` } // PostgreSQL case-insensitive search
                    },
                    {
                        // If you want to include search by employee name, use a join
                        '$Employee.Employee_name$': { [sequelize_1.Op.iLike]: `%${search}%` } // Search in related Employee's name
                    }
                ]
            },
            include: [
                {
                    model: Tbl_Employee_1.default,
                    required: true,
                    attributes: ['Emp_Id', 'Employee_name'], // Ensure this matches the model
                },
                {
                    model: Tbl_Project_1.default,
                    required: true,
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            logging: console.log, // Log the generated SQL query
        });
        // Log the results to verify data before sending response
        console.log(JSON.stringify(projectEmployees, null, 2));
        res.status(200).json(projectEmployees);
    }
    catch (error) {
        console.error("Error fetching project employees:", error);
        res.status(500).json({ message: "An error occurred while fetching project employees." });
    }
}));
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
Task.post('/importTasks/:Project_Id', autherticateTeamLead_1.authenticateTeamLead, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { Project_Id } = req.params;
        const Emp_Id = req.user.Emp_Id;
        const workbook = xlsx_1.default.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx_1.default.utils.sheet_to_json(sheet);
        const convertExcelTimeToTimeString = (excelTime) => {
            if (typeof excelTime === 'number') {
                const totalMinutes = Math.round(excelTime * 24 * 60);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            }
            return excelTime;
        };
        const parseDate = (dateString) => {
            const acceptedFormats = ['MM/dd/yyyy', 'yyyy-MM-dd', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yy', 'dd/MM/yy'];
            let parsedDate;
            for (const format of acceptedFormats) {
                parsedDate = (0, date_fns_1.parse)(dateString, format, new Date());
                if ((0, date_fns_1.isValid)(parsedDate)) {
                    return parsedDate;
                }
            }
            throw new Error(`Invalid date format: ${dateString}`);
        };
        const formatDateWithTimezone = (date, timeString) => {
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
        const tasks = yield Promise.all(data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { Start_Time, Task_Details, End_Date, End_Time, Role_Id, Assigned_Emp_Id } = row;
                Start_Time = convertExcelTimeToTimeString(Start_Time);
                End_Time = convertExcelTimeToTimeString(End_Time);
                End_Date = parseDate(End_Date);
                const formattedEndDateString = formatDateWithTimezone(End_Date, '07:10:58.017'); // Get the formatted string
                const formattedEndDate = new Date(formattedEndDateString); // Convert to Date object
                return Tbl_TaskDetails_1.default.create({
                    Emp_Id,
                    Project_Id,
                    Status: 'In Progress',
                    Start_Date: new Date(),
                    Start_Time,
                    Task_Details,
                    Actual_Start_Date: new Date(),
                    Actual_Start_Time: '',
                    End_Date: formattedEndDate,
                    End_Time,
                    Role_Id,
                    Assigned_Emp_Id,
                    Is_deleted: false,
                });
            }
            catch (rowError) {
                if (rowError instanceof Error) {
                    console.error(`Error processing row: ${rowError.message}`);
                    throw rowError;
                }
                else {
                    console.error(`Unexpected error processing row`);
                    throw new Error('Unexpected error processing row');
                }
            }
        })));
        return res.status(201).json({
            message: 'Tasks imported successfully',
            tasks,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return res.status(500).json({
                message: 'Error importing tasks',
                error: error.message,
            });
        }
        else {
            console.error('Unexpected error');
            return res.status(500).json({
                message: 'Unexpected error',
            });
        }
    }
}));
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
Task.get('/project-employees', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empId = req.user.Emp_Id; // Get the Emp_Id from authenticated user
        if (!empId) {
            return res.status(400).json({ message: 'Employee ID not found in the request.' });
        }
        // Step 1: Find the project where this employee has Role_Id = 2
        const projectEmployee = yield Tbl_ProjectEmployee_1.default.findOne({
            where: { Emp_Id: empId, Role_Id: 2, Is_deleted: false },
            attributes: ['Project_Id'], // Fetch Project_Id
        });
        if (!projectEmployee) {
            return res.status(404).json({ message: 'No project found for this employee with Role_Id = 2.' });
        }
        const projectId = projectEmployee.Project_Id;
        // Step 2: Fetch all employees for this project
        const projectEmployees = yield Tbl_ProjectEmployee_1.default.findAll({
            where: { Project_Id: projectId, Is_deleted: false },
            attributes: ['Emp_Id', 'Degesination', 'Role_Id'], // Fetch Emp_Id, Degesination, and Role_Id
        });
        if (projectEmployees.length === 0) {
            return res.status(404).json({ message: 'No employees found for this project.' });
        }
        // Step 3: Get Employee names and Role names from Employee and Role table
        const employeeDetails = yield Promise.all(projectEmployees.map((projectEmployee) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch Employee name from Employee table
            const employee = yield Tbl_Employee_1.default.findOne({
                where: { Emp_Id: projectEmployee.Emp_Id, Is_deleted: false },
                attributes: ['Emp_Id', 'Employee_name'], // Fetch Emp_Id and Employee_name
            });
            // Fetch Role name from Role table
            const role = yield Tbl_Role_1.default.findOne({
                where: { Role_Id: projectEmployee.Role_Id, Is_deleted: false },
                attributes: ['Role_Id', 'Name'], // Fetch Role_Id and Role Name
            });
            return {
                empId: (employee === null || employee === void 0 ? void 0 : employee.Emp_Id) || projectEmployee.Emp_Id,
                employeeName: (employee === null || employee === void 0 ? void 0 : employee.Employee_name) || 'Unknown',
                designation: projectEmployee.Degesination,
                roleName: (role === null || role === void 0 ? void 0 : role.Name) || 'Unknown', // In case role is not found
            };
        })));
        // Step 4: Return the employee details with role name
        return res.status(200).json({
            projectId,
            employees: employeeDetails,
        });
    }
    catch (error) {
        console.error('Error fetching employee data:', error); // Log the error
        return res.status(500).json({ message: 'An error occurred while fetching employee data.' });
    }
}));
// get own task of teamLead
// Define the GET API to retrieve tasks for the authenticated employee where Role_Id = 2
// Define the GET API to retrieve project names and task details for the authenticated employee
Task.get('/team-lead-tasks', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignedEmpId = req.user.Emp_Id; // Get the Emp_Id from the authenticated user
        if (!assignedEmpId) {
            return res.status(400).json({ message: 'Assigned employee ID not found in request.' });
        }
        // Step 1: Find unique project IDs and task details for tasks assigned to this employee
        const assignedTasks = yield Tbl_TaskDetails_1.default.findAll({
            where: {
                Assigned_Emp_Id: assignedEmpId,
                Is_deleted: false, // Filter out deleted tasks
            },
            attributes: [
                'Task_details_Id',
                'Task_Details',
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
                'Project_Id', // Corrected field: Project ID
            ],
        });
        if (!assignedTasks.length) {
            return res.status(404).json({ message: 'No tasks found for this team leader.' });
        }
        // Step 2: Extract unique project IDs from assigned tasks
        const projectIds = [...new Set(assignedTasks.map(task => task.Project_Id))]; // Corrected field: Project ID
        // Step 3: Get project names using the unique project IDs
        const projects = yield Tbl_Project_1.default.findAll({
            where: {
                Project_Id: projectIds,
                Is_deleted: false, // Filter out deleted projects
            },
            attributes: [
                'Project_Id',
                'Project_Name', // Corrected field: Project Name
            ],
        });
        // Step 4: Format the response to include project names and corresponding task details
        const projectTasks = projects.map(project => {
            // Filter tasks that match this project ID
            const tasks = assignedTasks
                .filter(task => task.Project_Id === project.Project_Id) // Corrected field: Project ID
                .map(task => ({
                Task_details_Id: task.Task_details_Id,
                taskDetails: task.Task_Details,
                Emp_Id: task.Emp_Id,
                Project_Id: task.Project_Id,
                Status: task.Status,
                Start_Date: task.Start_Date,
                Start_Time: task.Start_Time,
                End_Date: task.End_Date,
                End_Time: task.End_Time,
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
                projectId: project.Project_Id,
                projectName: project.Project_Name,
                tasks, // Include task details associated with this project
            };
        });
        return res.status(200).json({ projectTasks });
    }
    catch (error) {
        console.error('Error fetching projects and tasks for team lead:', error);
        return res.status(500).json({ message: 'An error occurred while fetching projects and tasks.' });
    }
}));
//
Task.patch('/UpdateTask/:taskId', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params; // Get the task ID from the route parameters
    const Emp_Id = req.user.Emp_Id; // Get employee ID from the authenticated user
    try {
        const { Start_Time, Start_Date, Task_Details, End_Date, End_Time, Assigned_Emp_Id, } = req.body; // Destructure the fields from the request body
        // Find the task by its ID
        const task = yield Tbl_TaskDetails_1.default.findOne({ where: { Task_details_Id: taskId, Emp_Id } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }
        // Update the task with the new data, if it exists
        const updatedTask = yield task.update({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error updating task',
            error: error.message,
        });
    }
}));
Task.get("/assigned", autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Assigned_Emp_Id = req.user.Emp_Id;
    const { page = 1, limit = 5, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
        // Query the database to find all tasks assigned to the employee and exclude completed tasks
        const { count, rows: taskDetails } = yield Tbl_TaskDetails_1.default.findAndCountAll({
            where: {
                Assigned_Emp_Id: Assigned_Emp_Id,
                Is_deleted: false,
                [sequelize_1.Op.or]: [
                    { Task_Details: { [sequelize_1.Op.iLike]: `%${search}%` } }, // Search in Task_Details
                ]
            },
            include: [
                {
                    model: Tbl_Project_1.default,
                    attributes: ['Project_Name'],
                    where: {
                        Project_Name: { [sequelize_1.Op.iLike]: `%${search}%` }, // Search in Project_Name
                    },
                    required: false, // Make the join optional (tasks without projects won't be excluded)
                }
            ],
            limit: parseInt(limit),
            offset: offset, // Set offset for pagination
        });
        // Check if tasks are found
        return res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            tasks: taskDetails.map(task => (Object.assign({}, task.toJSON())))
        });
    }
    catch (error) {
        console.error("Error fetching task details:", error);
        return res.status(500).json({ message: "An error occurred while fetching task details." });
    }
}));
Task.put('/UpdateTask/:Task_details_Id', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Task_details_Id } = req.params;
        const { Status, Remarks, Actual_Start_Date, Actual_Start_Time } = req.body;
        // Find the task by Task_details_Id
        const task = yield Tbl_TaskDetails_1.default.findOne({
            where: { Task_details_Id, Is_deleted: false } // Ensure that the task is not soft-deleted
        });
        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }
        // Prepare update payload
        let updatePayload = { Status };
        // Handle Actual_Start_Date and Actual_Start_Time
        if (Actual_Start_Date && Actual_Start_Time) {
            // If both are provided, use them to update the task
            updatePayload.Actual_Start_Date = Actual_Start_Date;
            updatePayload.Actual_Start_Time = Actual_Start_Time;
        }
        else {
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
            updatePayload.Extend_End_Date = currentDate; // Set the current date
            updatePayload.Extend_End_Time = currentTimeString; // Set the current time
        }
        // Always update Remarks if provided
        if (Remarks) {
            updatePayload.Remarks = Remarks;
        }
        // Update the task
        const updatedTask = yield task.update(updatePayload);
        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    }
    catch (error) {
        const errorMessage = error.message || 'Error updating task';
        console.error(error);
        return res.status(500).json({
            message: errorMessage
        });
    }
}));
exports.default = Task;
