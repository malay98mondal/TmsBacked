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
const Tbl_TaskDetails_1 = __importDefault(require("../../db/models/Tbl_TaskDetails")); // Adjust the path as per your project structure
const taskDetailsDeleteRoute = (0, express_1.Router)();
// Soft Delete API for TaskDetails by Assigned_Emp_Id
taskDetailsDeleteRoute.delete('/delete-task/:Assigned_Emp_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Task_details_Id } = req.params; // Extract Assigned_Emp_Id from request parameters
    try {
        // Find all tasks for the assigned employee that are not already soft deleted
        const taskDetails = yield Tbl_TaskDetails_1.default.findAll({
            where: {
                Task_details_Id,
                Is_deleted: false, // Fetch tasks that are not deleted
            }
        });
        // If no task details are found, return a 404 response
        if (taskDetails.length === 0) {
            return res.status(404).json({ message: 'No tasks found for the assigned employee to delete.' });
        }
        // Perform a soft delete by updating the Is_deleted field to true
        yield Promise.all(taskDetails.map((task) => __awaiter(void 0, void 0, void 0, function* () {
            yield task.update({ Is_deleted: true });
        })));
        return res.status(200).json({ message: 'Tasks soft deleted successfully', taskDetails });
    }
    catch (error) {
        console.error('Error performing soft delete:', error);
        return res.status(500).json({ message: 'An error occurred while deleting tasks.' });
    }
}));
exports.default = taskDetailsDeleteRoute;
