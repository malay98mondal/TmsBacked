"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateManager = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = "manager_jwt_secret";
const authenticateManager = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        console.log('unauthorised', token);
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token.split(' ')[1], secret);
        req.user = decoded;
        console.log(decoded);
        next();
    }
    catch (error) {
        res.status(401).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
};
exports.authenticateManager = authenticateManager;
