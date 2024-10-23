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
Task.get('/tasks', autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const empId = parseInt(req.params.empId);
    const empId = req.user.Emp_Id;
    const { search = '', page = 1, limit = 5 } = req.query; // Get search query, page, and limit from request query
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
        // Find tasks associated with the project, applying search and pagination
        const tasks = yield Tbl_TaskDetails_1.default.findAndCountAll({
            where: {
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
            },
            offset,
            limit: parseInt(limit),
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
    try {
        const projectEmployees = yield Tbl_ProjectEmployee_1.default.findAll({
            where: {
                Project_Id: projectId,
                Emp_Id: { [sequelize_1.Op.ne]: employeeId },
                Is_deleted: false,
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
        const tasks = yield Promise.all(data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { Start_Time, Task_Details, End_Date, End_Time, Role_Id, Assigned_Emp_Id } = row;
                Start_Time = convertExcelTimeToTimeString(Start_Time);
                End_Time = convertExcelTimeToTimeString(End_Time);
                End_Date = parseDate(End_Date);
                return Tbl_TaskDetails_1.default.create({
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
Task.get("/task-details/:id", autherticateTeamLead_1.authenticateTeamLead, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Step 1: Fetch the task details from TaskDetails table
        const taskDetails = yield Tbl_TaskDetails_1.default.findOne({
            where: { Task_details_Id: id, Is_deleted: false }, // Only fetch if not deleted
        });
        if (!taskDetails) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Step 2: Extract Assigned_Emp_Id from TaskDetails
        const { Assigned_Emp_Id, Project_Id } = taskDetails;
        // Step 3: Fetch Employee details, which includes Role_Id
        const employee = yield Tbl_Employee_1.default.findOne({
            where: { Emp_Id: Assigned_Emp_Id },
            attributes: ['Emp_Id', 'Employee_name', 'Role_Id'], // Include Role_Id
        });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        // Step 4: Fetch Role details using Role_Id from Tbl_Employee
        const { Role_Id } = employee;
        const role = yield Tbl_Role_1.default.findOne({
            where: { Role_Id },
            attributes: ['Role_Id', 'Name'], // Specify the fields to retrieve
        });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Step 5: Fetch Project details using Project_Id
        const project = yield Tbl_Project_1.default.findOne({
            where: { Project_Id },
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
    }
    catch (error) {
        console.error("Error fetching task details:", error);
        return res.status(500).json({ message: "An error occurred while fetching the task details" });
    }
}));
exports.default = Task;
