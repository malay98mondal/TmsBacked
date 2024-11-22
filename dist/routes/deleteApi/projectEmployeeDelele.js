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
const Tbl_ProjectEmployee_1 = __importDefault(require("../../db/models/Tbl_ProjectEmployee")); // Adjust the path according to your project structure
const Tbl_TaskDetails_1 = __importDefault(require("../../db/models/Tbl_TaskDetails"));
const config_1 = __importDefault(require("../../db/config"));
const Tbl_Employee_1 = __importDefault(require("../../db/models/Tbl_Employee"));
const authenticateManager_1 = require("../../middleware/authenticateManager");
const projectEmployeeDeleteRoute = (0, express_1.Router)();
// Soft Delete API for ProjectEmployee by ProjectMember_Id
projectEmployeeDeleteRoute.delete('/delete-project-employee/:ProjectMember_Id', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProjectMember_Id } = req.params; // Extract ProjectMember_Id from the route parameters
    try {
        // Find the ProjectEmployee by ProjectMember_Id and ensure it's not already soft deleted
        const projectEmployee = yield Tbl_ProjectEmployee_1.default.findOne({
            where: { ProjectMember_Id, Is_deleted: false }
        });
        // If the ProjectEmployee is not found, return a 404 response
        if (!projectEmployee) {
            return res.status(404).json({ message: 'ProjectEmployee not found or already deleted.' });
        }
        // Perform a soft delete by updating the Is_deleted field to true
        yield projectEmployee.update({ Is_deleted: true });
        return res.status(200).json({ message: 'ProjectEmployee soft deleted successfully', projectEmployee });
    }
    catch (error) {
        console.error('Error in soft deleting ProjectEmployee:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the project employee.' });
    }
}));
projectEmployeeDeleteRoute.delete('/projectEmployee/:projectId/:empId', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, empId } = req.params;
    // Initialize a variable for the transaction instance
    let transaction = null;
    try {
        // Start a transaction instance
        transaction = yield config_1.default.transaction();
        yield Tbl_ProjectEmployee_1.default.update({ Is_deleted: true }, {
            where: {
                Project_Id: projectId,
                Emp_Id: empId,
            },
            transaction,
        });
        // Step 2: Soft delete all TaskDetails related to this Project_Id and Emp_Id
        yield Tbl_TaskDetails_1.default.update({ Is_deleted: true }, {
            where: {
                Project_Id: projectId,
                Assigned_Emp_Id: empId,
            },
            transaction,
        });
        const employee = yield Tbl_Employee_1.default.findOne({
            where: {
                Emp_Id: empId,
            },
            transaction,
        });
        if (employee && employee.Role_Id === 2) {
            // Only update Role_Id to 3 if current Role_Id is 2
            yield Tbl_Employee_1.default.update({ Role_Id: 3 }, {
                where: {
                    Emp_Id: empId,
                },
                transaction,
            });
        }
        yield transaction.commit();
        res.status(200).json({ message: "Project employee soft-deleted and tasks marked as deleted successfully." });
    }
    catch (error) {
        if (transaction)
            yield transaction.rollback();
        console.error("Error soft-deleting project employee and tasks:", error);
        res.status(500).json({ message: "An error occurred while soft-deleting project employee and tasks." });
    }
}));
exports.default = projectEmployeeDeleteRoute;
