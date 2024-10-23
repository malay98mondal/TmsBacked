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
// routes/roleRoutes.ts
const express_1 = __importDefault(require("express"));
const Tbl_Role_1 = __importDefault(require("../db/models/Tbl_Role"));
const roleRoutes = express_1.default.Router();
// Get all non-deleted roles
roleRoutes.get('/roles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Tbl_Role_1.default.findAll({
            where: {
                Is_deleted: false
            }
        });
        return res.status(200).json({
            success: true,
            data: roles
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve roles',
            error: error.message
        });
    }
}));
// Get a role by ID
roleRoutes.get('/roles/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const role = yield Tbl_Role_1.default.findOne({
            where: {
                Role_Id: id,
                Is_deleted: false
            }
        });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found or has been deleted'
            });
        }
        return res.status(200).json({
            success: true,
            data: role
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve role',
            error: error.message
        });
    }
}));
exports.default = roleRoutes;
