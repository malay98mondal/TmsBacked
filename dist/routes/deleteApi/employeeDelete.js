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
const Tbl_Employee_1 = __importDefault(require("../../db/models/Tbl_Employee")); // Adjust the path as per your project structure
const config_1 = __importDefault(require("../../db/config"));
const Tbl_ProjectEmployee_1 = __importDefault(require("../../db/models/Tbl_ProjectEmployee"));
const Tbl_TaskDetails_1 = __importDefault(require("../../db/models/Tbl_TaskDetails"));
const authenticateManager_1 = require("../../middleware/authenticateManager");
const employeeDeleteRoute = (0, express_1.Router)();
// Soft Delete API for Employee by Emp_Id
// employeeDeleteRoute.delete('/delete-employee/:Emp_Id', async (req: Request, res: Response) => {
//     const { Emp_Id } = req.params; // Extract Emp_Id from request parameters
//     try {
//         // Find the employee by Emp_Id and ensure they are not already soft deleted
//         const employee = await Employee.findOne({
//             where: { Emp_Id, Is_deleted: false }
//         });
//         // If the employee is not found, return a 404 response
//         if (!employee) {
//             return res.status(404).json({ message: 'Employee not found or already deleted.' });
//         }
//         // Perform a soft delete by updating the Is_deleted field to true
//         await employee.update({ Is_deleted: true });
//         return res.status(200).json({ message: 'Employee soft deleted successfully', employee });
//     } catch (error) {
//         console.error('Error in performing soft delete for employee:', error);
//         return res.status(500).json({ message: 'An error occurred while deleting the employee.' });
//     }
// });
employeeDeleteRoute.delete('/delete-employee/:Emp_Id', authenticateManager_1.authenticateManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Emp_Id } = req.params;
    let transaction = null;
    try {
        transaction = yield config_1.default.transaction();
        yield Tbl_Employee_1.default.update({ Is_deleted: true }, {
            where: {
                Emp_Id: Emp_Id,
            },
            transaction,
        });
        // Step 2: Soft delete the ProjectEmployee entries related to this employee
        yield Tbl_ProjectEmployee_1.default.update({ Is_deleted: true }, {
            where: {
                Emp_Id: Emp_Id,
            },
            transaction,
        });
        // Step 3: Soft delete all TaskDetails related to this employee
        yield Tbl_TaskDetails_1.default.update({ Is_deleted: true }, {
            where: {
                Assigned_Emp_Id: Emp_Id,
            },
            transaction,
        });
        // Step 4: Commit the transaction to save the changes
        yield transaction.commit();
        res.status(200).json({ message: "Employee and related data soft-deleted successfully." });
    }
    catch (error) {
        // Rollback transaction in case of error
        if (transaction)
            yield transaction.rollback();
        console.error("Error soft-deleting employee and related data:", error);
        res.status(500).json({ message: "An error occurred while soft-deleting employee and related data." });
    }
}));
exports.default = employeeDeleteRoute;
