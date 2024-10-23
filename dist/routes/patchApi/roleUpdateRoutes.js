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
const Tbl_Role_1 = __importDefault(require("../../db/models/Tbl_Role")); // Adjust the import path based on your project structure
const sequelize_1 = require("sequelize");
const roleUpdateRoute = (0, express_1.Router)();
roleUpdateRoute.patch('/update-role/:Role_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Role_Id } = req.params; // Extract Role_Id from the route parameters
    const { Name, Status } = req.body; // Extract fields from the request body
    try {
        // Find the role by Role_Id
        const role = yield Tbl_Role_1.default.findOne({ where: { Role_Id } });
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        // Validate Name uniqueness if provided
        const errors = [];
        if (Name) {
            const existingRole = yield Tbl_Role_1.default.findOne({
                where: {
                    Name,
                    Role_Id: { [sequelize_1.Op.ne]: Role_Id }, // Exclude the current role
                },
            });
            if (existingRole) {
                errors.push({ field: 'Name', message: `A role with the name '${Name}' already exists.` });
            }
        }
        // If there are any validation errors, return them
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }
        // Update the role if no conflicts are found
        yield role.update({
            Status,
        });
        return res.status(200).json({ message: 'Role updated successfully', role });
    }
    catch (error) {
        console.error('Error in updating role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = roleUpdateRoute;
