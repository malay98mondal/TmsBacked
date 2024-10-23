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
const Tbl_Employee_1 = __importDefault(require("../../db/models/Tbl_Employee"));
const employeeRoute = (0, express_1.Router)();
employeeRoute.patch('/update-employee/:Emp_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Emp_Id } = req.params; // Extract Emp_Id from the route parameters
    const { Employee_name, Role_Id } = req.body; // Extract fields from the request body
    try {
        // Find the employee by Emp_Id and ensure it's not deleted (Is_deleted is false)
        const employee = yield Tbl_Employee_1.default.findOne({ where: { Emp_Id, Is_deleted: false } });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const errors = [];
        // Check if Employee_name is unique, excluding the current employee
        if (Employee_name) {
            const existingEmployee = yield Tbl_Employee_1.default.findOne({
                where: {
                    Employee_name,
                    Is_deleted: false,
                    Emp_Id: { [sequelize_1.Op.ne]: Emp_Id }, // Exclude the current employee
                },
            });
            if (existingEmployee) {
                errors.push({ field: 'Employee_name', message: `An employee with the name '${Employee_name}' already exists.` });
            }
        }
        // If there are any conflicts, return the errors
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }
        // Update the employee if no conflicts are found
        yield employee.update({
            Employee_name,
            Role_Id,
        });
        return res.status(200).json({ message: 'Employee updated successfully', employee });
    }
    catch (error) {
        console.error('Error in updating employee:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = employeeRoute;
