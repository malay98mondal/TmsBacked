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
const express_1 = __importDefault(require("express"));
const Tbl_ProjectEmployee_1 = __importDefault(require("../db/models/Tbl_ProjectEmployee"));
const Tbl_Employee_1 = __importDefault(require("../db/models/Tbl_Employee"));
const Tbl_Role_1 = __importDefault(require("../db/models/Tbl_Role"));
const Tbl_Project_1 = __importDefault(require("../db/models/Tbl_Project"));
const authenticateManager_1 = require("../middleware/authenticateManager");
const sequelize_1 = require("sequelize");
const projectEmployeeRoutes = express_1.default.Router();
projectEmployeeRoutes.post('/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectIdString = req.params.projectId; // Get Project_Id from URL parameters
    const { Emp_Id, Role_Id, Degesination } = req.body; // Get Emp_Id, Role_Id, and Degesination from request body
    try {
        // Validate input data
        if (!Emp_Id || !Role_Id || !Degesination) {
            return res.status(400).json({
                success: false,
                message: 'Emp_Id, Role_Id, and Degesination are required.',
            });
        }
        // Convert Project_Id to a number
        const projectIdNumber = Number(projectIdString);
        // Check if the employee exists
        const employee = yield Tbl_Employee_1.default.findByPk(Emp_Id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.',
            });
        }
        // Check if the ProjectEmployee record already exists
        const existingProjectEmployee = yield Tbl_ProjectEmployee_1.default.findOne({
            where: {
                Project_Id: projectIdNumber,
                Emp_Id: Emp_Id,
                Is_deleted: false
            },
        });
        if (existingProjectEmployee) {
            // If the ProjectEmployee exists, return an error
            return res.status(409).json({
                success: false,
                message: 'Employee is already assigned to this project.',
            });
        }
        // Check if the employee is already a team lead in any project
        if (Role_Id === 2) { // Check for Team_Lead role
            const existingTeamLead = yield Tbl_ProjectEmployee_1.default.findOne({
                where: {
                    Emp_Id: Emp_Id,
                    Role_Id: 2,
                    Is_deleted: false
                },
            });
            if (existingTeamLead) {
                // If a team lead already exists for this employee, return an error
                return res.status(409).json({
                    success: false,
                    message: `Employee is already a team lead in another project.`,
                });
            }
        }
        // Create a new ProjectEmployee record
        const newProjectEmployee = yield Tbl_ProjectEmployee_1.default.create({
            Project_Id: projectIdNumber,
            Emp_Id,
            Role_Id,
            Degesination,
            Is_deleted: false,
        });
        // Update the employee's role only if they are being added as a team lead
        if (Role_Id === 2) {
            // Update the employee's role only if they are being assigned as a team lead
            yield Tbl_Employee_1.default.update({ Role_Id }, // Set new Role_Id from request body
            { where: { Emp_Id } } // Find employee by Emp_Id
            );
        }
        return res.status(201).json({
            success: true,
            message: 'Project employee created successfully.',
            data: newProjectEmployee,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create the project employee',
            error: error.message,
        });
    }
}));
// Get API
projectEmployeeRoutes.get('/:projectId', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectIdString = req.params.projectId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const searchTerm = req.query.search || '';
    try {
        const projectIdNumber = Number(projectIdString);
        // Set up the base query
        const whereClause = {
            Project_Id: projectIdNumber,
            Is_deleted: false,
        };
        // Employee and Role search filters (only if searchTerm is provided)
        const employeeWhereClause = {};
        const roleWhereClause = {};
        if (searchTerm) {
            employeeWhereClause.Employee_name = {
                [sequelize_1.Op.iLike]: `%${searchTerm}%`, // Use case-insensitive search for employee names
            };
            // roleWhereClause.Name = {
            //     [Op.iLike]: `%${searchTerm}%`,  // Use case-insensitive search for role names
            // };
        }
        // Fetch project employees by Project_Id with search and pagination
        const projectEmployees = yield Tbl_ProjectEmployee_1.default.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Tbl_Employee_1.default,
                    attributes: ['Employee_name', 'Role_Id'],
                    where: employeeWhereClause,
                    include: [
                        {
                            model: Tbl_Role_1.default,
                            attributes: ['Name'],
                            as: 'Role',
                            where: roleWhereClause, // Apply role search condition
                        },
                    ],
                },
                {
                    model: Tbl_Project_1.default,
                    attributes: ['Project_Name'],
                },
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });
        // Map the response to include Employee_name, Role_Name, and Project_Name
        const response = projectEmployees.rows.map((projectEmployee) => {
            var _a, _b, _c, _d, _e;
            return ({
                ProjectMember_Id: projectEmployee.ProjectMember_Id,
                Project_Id: projectEmployee.Project_Id,
                Emp_Id: projectEmployee.Emp_Id,
                Employee_name: (_a = projectEmployee.Employee) === null || _a === void 0 ? void 0 : _a.Employee_name,
                Role_Id: (_b = projectEmployee.Employee) === null || _b === void 0 ? void 0 : _b.Role_Id,
                Role_Name: (_d = (_c = projectEmployee.Employee) === null || _c === void 0 ? void 0 : _c.Role) === null || _d === void 0 ? void 0 : _d.Name,
                Degesination: projectEmployee.Degesination,
                Project_Name: (_e = projectEmployee.Project) === null || _e === void 0 ? void 0 : _e.Project_Name,
                Is_deleted: projectEmployee.Is_deleted,
            });
        });
        // Calculate total pages and return response
        return res.status(200).json({
            success: true,
            data: response,
            total: projectEmployees.count,
            totalPages: Math.ceil(projectEmployees.count / pageSize),
            currentPage: page,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve project employees',
            error: error.message,
        });
    }
}));
exports.default = projectEmployeeRoutes;
