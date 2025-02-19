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
const Tbl_ProjectEmployee_1 = __importDefault(require("../../db/models/Tbl_ProjectEmployee"));
const projectEmployeeUpdateRoute = (0, express_1.Router)();
projectEmployeeUpdateRoute.patch('/update-project-employee/:ProjectMember_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProjectMember_Id } = req.params; // Extract ProjectMember_Id from the route parameters
    const { Project_Id, Emp_Id, Role_Id } = req.body; // Extract fields from the request body
    // const modified_by = req.user?.id; // Assuming you have user authentication and req.user is available
    try {
        // Find the ProjectEmployee by ProjectMember_Id and ensure it's not deleted (Is_deleted is false)
        const projectEmployee = yield Tbl_ProjectEmployee_1.default.findOne({ where: { ProjectMember_Id, Is_deleted: false } });
        if (!projectEmployee) {
            return res.status(404).json({ message: 'Project Employee not found' });
        }
        const errors = [];
        // Check if the combination of Project_Id and Emp_Id is unique, excluding the current ProjectEmployee
        const existingProjectEmployee = yield Tbl_ProjectEmployee_1.default.findOne({
            where: {
                Project_Id,
                Emp_Id,
                Is_deleted: false,
                ProjectMember_Id: { [sequelize_1.Op.ne]: ProjectMember_Id }, // Exclude the current ProjectEmployee
            },
        });
        if (existingProjectEmployee) {
            errors.push({ field: 'Project_Id and Emp_Id', message: 'This employee is already assigned to the project.' });
        }
        // If there are any conflicts, return the errors
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }
        // Update the ProjectEmployee if no conflicts are found
        yield projectEmployee.update({
            Project_Id,
            Emp_Id,
            Role_Id,
        });
        return res.status(200).json({ message: 'Project Employee updated successfully', projectEmployee });
    }
    catch (error) {
        console.error('Error in updating project employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = projectEmployeeUpdateRoute;
