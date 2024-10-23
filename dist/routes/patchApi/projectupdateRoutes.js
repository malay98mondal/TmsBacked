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
const sequelize_1 = require("sequelize");
const Tbl_Project_1 = __importDefault(require("../../db/models/Tbl_Project"));
const projectUpdateRoute = (0, express_1.Router)();
projectUpdateRoute.patch('/update-project/:project_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { project_id } = req.params; // Extract project_id from the route parameters
    const { Project_Name, Status } = req.body; // Extract fields from the request body
    try {
        // Find the project by project_id
        const project = yield Tbl_Project_1.default.findOne({ where: { Project_Id: project_id } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const errors = [];
        // Check if Project_Name is unique, excluding the current project
        if (Project_Name) {
            const existingProject = yield Tbl_Project_1.default.findOne({
                where: {
                    Project_Name,
                    Project_Id: { [sequelize_1.Op.ne]: project_id }, // Exclude the current project
                },
            });
            if (existingProject) {
                errors.push({ field: 'Project_Name', message: `A project with the name '${Project_Name}' already exists.` });
            }
        }
        // If there are any conflicts, return the errors
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }
        // Update the project if no conflicts are found
        yield project.update({
            Project_Name,
            Status,
        });
        return res.status(200).json({ message: 'Project updated successfully', project });
    }
    catch (error) {
        console.error('Error in updating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = projectUpdateRoute;
