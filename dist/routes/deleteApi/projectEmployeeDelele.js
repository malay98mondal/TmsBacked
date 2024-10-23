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
const projectEmployeeDeleteRoute = (0, express_1.Router)();
// Soft Delete API for ProjectEmployee by ProjectMember_Id
projectEmployeeDeleteRoute.delete('/delete-project-employee/:ProjectMember_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = projectEmployeeDeleteRoute;
