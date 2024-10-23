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
// routes/projectRoutes.ts
const express_1 = __importDefault(require("express"));
const Tbl_Project_1 = __importDefault(require("../db/models/Tbl_Project"));
const authenticateManager_1 = require("../middleware/authenticateManager");
const sequelize_1 = require("sequelize");
const projectRoutes = express_1.default.Router();
projectRoutes.post("/addProject", authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Project_Name, Status } = req.body;
        if (!Project_Name || !Status) {
            return res.status(400).json({ error: "Project_Name and Status are required." });
        }
        // Create a new project
        const newProject = yield Tbl_Project_1.default.create({
            Project_Name,
            Status,
            Is_deleted: false,
        });
        return res.status(201).json({ success: true, data: newProject });
    }
    catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ success: false, error: "Failed to create project." });
    }
}));
projectRoutes.get('/projects', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Default values for pagination
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 5) || 5;
        // Search query from the request (if any)
        const searchQuery = req.query.search || '';
        // Calculate the offset (starting point for the query)
        const offset = (page - 1) * pageSize;
        // Create search condition for project name or any other field you'd like to search
        const searchCondition = searchQuery
            ? {
                [sequelize_1.Op.or]: [
                    { Project_Name: { [sequelize_1.Op.iLike]: `%${searchQuery}%` } }
                ]
            }
            : {};
        // Fetch projects with pagination and search
        const { count, rows: projects } = yield Tbl_Project_1.default.findAndCountAll({
            where: Object.assign({ Is_deleted: false }, searchCondition),
            limit: pageSize,
            offset: offset
        });
        // Calculate the total number of pages
        const totalPages = Math.ceil(count / pageSize);
        return res.status(200).json({
            success: true,
            data: projects,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                pageSize: pageSize,
                totalItems: count
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve projects',
            error: error.message
        });
    }
}));
// Get a project by ID
projectRoutes.get('/projects/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield Tbl_Project_1.default.findOne({
            where: {
                Project_Id: id,
                Is_deleted: false
            }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or has been deleted'
            });
        }
        return res.status(200).json({
            success: true,
            data: project
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve project',
            error: error.message
        });
    }
}));
exports.default = projectRoutes;
