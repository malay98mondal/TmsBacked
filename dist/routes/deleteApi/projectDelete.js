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
const Tbl_Project_1 = __importDefault(require("../../db/models/Tbl_Project")); // Adjust the path according to your project structure
const config_1 = __importDefault(require("../../db/config"));
const Tbl_ProjectEmployee_1 = __importDefault(require("../../db/models/Tbl_ProjectEmployee"));
const Tbl_TaskDetails_1 = __importDefault(require("../../db/models/Tbl_TaskDetails"));
const authenticateManager_1 = require("../../middleware/authenticateManager");
const projecDeletetRoute = (0, express_1.Router)();
// Soft Delete API for Project by Project_Id
projecDeletetRoute.delete('/delete-project/:Project_Id', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Project_Id } = req.params; // Extract Project_Id from the route parameters
    try {
        // Find the Project by Project_Id and ensure it's not already soft deleted
        const project = yield Tbl_Project_1.default.findOne({
            where: { Project_Id, Is_deleted: false }
        });
        // If the Project is not found, return a 404 response
        if (!project) {
            return res.status(404).json({ message: 'Project not found or already deleted.' });
        }
        // Perform a soft delete by updating the Is_deleted field to true
        yield project.update({ Is_deleted: true });
        return res.status(200).json({ message: 'Project soft deleted successfully', project });
    }
    catch (error) {
        console.error('Error in soft deleting Project:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the project.' });
    }
}));
projecDeletetRoute.delete("/projects/:projectId", authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    let transaction = null;
    try {
        // Start a transaction to ensure all operations are atomic
        transaction = yield config_1.default.transaction();
        // Soft delete the Project
        const project = yield Tbl_Project_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        yield project.update({ Is_deleted: true }, { transaction });
        // Soft delete associated ProjectMembers
        yield Tbl_ProjectEmployee_1.default.update({ Is_deleted: true }, {
            where: {
                Project_Id: projectId,
            },
            transaction,
        });
        // Soft delete related Tasks
        yield Tbl_TaskDetails_1.default.update({ Is_deleted: true }, {
            where: {
                Project_Id: projectId,
            },
            transaction,
        });
        const projectEmployees = yield Tbl_ProjectEmployee_1.default.findAll({
            where: {
                Project_Id: projectId,
                Role_Id: 2,
            },
            transaction,
        });
        for (let employee of projectEmployees) {
            // Update the Role_Id to 3 for employees with Role_Id 2
            yield employee.update({ Role_Id: 3 }, { transaction });
        }
        // Commit the transaction
        yield transaction.commit();
        res.status(200).json({ message: "Project and related data soft deleted successfully" });
    }
    catch (error) {
        if (transaction)
            yield transaction.rollback();
        console.error("Error soft-deleting project employee and tasks:", error);
        res.status(500).json({ message: "An error occurred while soft-deleting project." });
    }
}));
exports.default = projecDeletetRoute;
