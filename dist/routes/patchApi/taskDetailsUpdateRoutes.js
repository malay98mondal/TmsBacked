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
const Tbl_TaskDetails_1 = __importDefault(require("../../db/models/Tbl_TaskDetails")); // Adjust the import path based on your project structure
const taskDetailsUpdateRoute = (0, express_1.Router)();
taskDetailsUpdateRoute.patch('/update-task/:Task_details_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Task_details_Id } = req.params; // Extract Task_details_Id from the route parameters
    const { Emp_Id, Project_Id, Status, Start_Date, Start_Time, Task_Details, End_Date, End_Time, Extend_Start_Date, Extend_Start_Time, Extend_End_Date, Extend_End_Time, Remarks, Modified_By } = req.body; // Extract fields from the request body
    try {
        // Find the task details by Task_details_Id and ensure it's not deleted (Is_deleted is false)
        const taskDetails = yield Tbl_TaskDetails_1.default.findOne({ where: { Task_details_Id, Is_deleted: false } });
        if (!taskDetails) {
            return res.status(404).json({ message: 'Task details not found' });
        }
        // Update the task details if found
        yield taskDetails.update({
            Emp_Id,
            Project_Id,
            Status,
            Start_Date,
            Start_Time,
            Task_Details,
            End_Date,
            End_Time,
            Extend_Start_Date,
            Extend_Start_Time,
            Extend_End_Date,
            Extend_End_Time,
            Remarks,
            Modified_By,
            Modified_DateTime: new Date() // Set the modified date to now
        });
        return res.status(200).json({ message: 'Task details updated successfully', taskDetails });
    }
    catch (error) {
        console.error('Error in updating task details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = taskDetailsUpdateRoute;
