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
const Tbl_Role_1 = __importDefault(require("../../db/models/Tbl_Role")); // Adjust the path as per your project structure
const roleDeleteRoute = (0, express_1.Router)();
// Soft Delete API for Role by Role_Id
roleDeleteRoute.delete('/delete-role/:Role_Id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Role_Id } = req.params; // Extract Role_Id from request parameters
    try {
        // Find the role by Role_Id and ensure it's not already soft deleted
        const role = yield Tbl_Role_1.default.findOne({
            where: { Role_Id, Is_deleted: false }
        });
        // If the role is not found, return a 404 response
        if (!role) {
            return res.status(404).json({ message: 'Role not found or already deleted.' });
        }
        // Perform a soft delete by updating the Is_deleted field to true
        yield role.update({ Is_deleted: true });
        return res.status(200).json({ message: 'Role soft deleted successfully', role });
    }
    catch (error) {
        console.error('Error in performing soft delete for role:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the role.' });
    }
}));
exports.default = roleDeleteRoute;
