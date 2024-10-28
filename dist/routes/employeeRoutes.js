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
const Tbl_Employee_1 = __importDefault(require("../db/models/Tbl_Employee"));
const Tbl_Role_1 = __importDefault(require("../db/models/Tbl_Role"));
const authenticateManager_1 = require("../middleware/authenticateManager");
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const employeeRoutes = express_1.default.Router();
employeeRoutes.get('/GetEmployee', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdToExclude = req.user.Emp_Id;
        const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1
        const pageSize = 10; // Number of employees to return per page (can be adjusted)
        const searchTerm = req.query.searchTerm ? req.query.searchTerm : ''; // Get search term from query params
        // Calculate offset for pagination
        const offset = (page - 1) * pageSize;
        const employees = yield Tbl_Employee_1.default.findAndCountAll({
            where: {
                Is_deleted: false,
                Emp_Id: {
                    [sequelize_1.Op.ne]: userIdToExclude, // Exclude the employee with the id from the token
                },
                // Add search filter for employee name (or other fields as necessary)
                [sequelize_1.Op.or]: [
                    {
                        Employee_name: {
                            [sequelize_1.Op.iLike]: `%${searchTerm}%`, // Case insensitive search
                        },
                    },
                    // You can add more fields here if necessary
                    // {
                    //     AnotherField: {
                    //         [Op.iLike]: `%${searchTerm}%`,
                    //     },
                    // },
                ],
            },
            limit: pageSize,
            offset: offset,
        });
        // Calculate total pages
        const totalPages = Math.ceil(employees.count / pageSize);
        return res.status(200).json({
            success: true,
            data: employees.rows,
            totalPages: totalPages,
            currentPage: page,
            totalEmployees: employees.count,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee details',
            error: error.message,
        });
    }
}));
employeeRoutes.get('/GetEmployee1', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdToExclude = req.user.Emp_Id;
        const { page = 1, limit = 10, search = '' } = req.query; // Defaults and query params
        const numericPage = parseInt(page); // Convert to number
        const numericLimit = parseInt(limit); // Convert to number
        const offset = (numericPage - 1) * numericLimit; // Offset for pagination
        const whereClause = {
            Is_deleted: false,
            Emp_Id: {
                [sequelize_1.Op.ne]: userIdToExclude,
            },
        };
        if (search) {
            whereClause.Employee_name = {
                [sequelize_1.Op.iLike]: `%${search}%`,
            };
        }
        const { rows: employees, count: total } = yield Tbl_Employee_1.default.findAndCountAll({
            where: whereClause,
            limit: numericLimit,
            offset: offset, // Use numeric offset
        });
        return res.status(200).json({
            success: true,
            data: employees,
            total,
            page: numericPage,
            totalPages: Math.ceil(total / numericLimit),
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee details',
            error: error.message,
        });
    }
}));
employeeRoutes.get('/role/:roleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = req.params.roleId;
    try {
        const employees = yield Tbl_Employee_1.default.findAll({
            where: {
                Role_Id: roleId,
                Is_deleted: false,
            },
        });
        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No employees found for this role ID',
            });
        }
        return res.status(200).json({
            success: true,
            data: employees,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee details by role ID',
            error: error.message,
        });
    }
}));
//post API
employeeRoutes.post('/post', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Employee_name, email, password } = req.body;
    try {
        if (!Employee_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Employee name, email, and password are required.',
            });
        }
        const existingEmployee = yield Tbl_Employee_1.default.findOne({
            where: {
                email,
                Is_deleted: false
            }
        });
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Email is already in use.',
            });
        }
        // Hash the password
        const hashed_password = bcrypt_1.default.hashSync(password, 7);
        const newEmployee = yield Tbl_Employee_1.default.create({
            Employee_name,
            Role_Id: 3,
            email,
            password: hashed_password,
            Is_deleted: false,
        });
        return res.status(201).json({
            success: true,
            data: newEmployee,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create the employee',
            error: error.message,
        });
    }
}));
Tbl_Employee_1.default.belongsTo(Tbl_Role_1.default, { foreignKey: 'Role_Id', as: 'Role' }); // Ensure to use an alias if needed
exports.default = employeeRoutes;
