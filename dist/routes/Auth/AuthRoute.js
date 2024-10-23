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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Tbl_Employee_1 = __importDefault(require("../../db/models/Tbl_Employee"));
const AuthUser = express_1.default.Router();
const MANAGER_SECRET = 'manager_jwt_secret';
const TEAM_LEAD_SECRET = 'team_lead_jwt_secret';
const MEMBER_SECRET = 'member_jwt_secret';
AuthUser.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || typeof email !== "string") {
            return res.status(400).send({ message: "Please enter a valid email" });
        }
        if (!password || typeof password !== "string") {
            return res.status(400).send({ message: "Please enter a valid password" });
        }
        const findUser = yield Tbl_Employee_1.default.findOne({
            where: { email },
        });
        if (!findUser) {
            return res.status(404).send({ message: "User not found" });
        }
        if (findUser.Is_deleted) {
            return res.status(404).send({ message: "User account deleted" });
        }
        const valid = yield bcrypt_1.default.compare(password, findUser.password);
        if (!valid) {
            return res.status(401).send({ message: "Email and password do not match" });
        }
        let token;
        let payload = {
            Emp_Id: findUser.Emp_Id,
            email: findUser.email,
            Role_Id: findUser.Role_Id,
        };
        switch (findUser.Role_Id) {
            case 1: // Manager
                token = jsonwebtoken_1.default.sign(payload, MANAGER_SECRET, { expiresIn: "1h" });
                return res.status(200).send({ message: `${findUser.Employee_name} logged in as Manager successfully`, access_token: token, type: 1 });
            case 2: // Team Lead
                token = jsonwebtoken_1.default.sign(payload, TEAM_LEAD_SECRET, { expiresIn: "1h" });
                return res.status(200).send({ message: `${findUser.Employee_name} logged in as Team Lead successfully`, access_token: token, type: 2 });
            case 3: // Member
                token = jsonwebtoken_1.default.sign(payload, MEMBER_SECRET, { expiresIn: "1h" });
                return res.status(200).send({ message: `${findUser.Employee_name} logged in as Member successfully`, access_token: token, type: 3 });
            default:
                return res.status(403).send({ message: "Unauthorized role" });
        }
    }
    catch (error) {
        return res.status(500).send({ messageError: `Error in login: ${error.message}` });
    }
}));
exports.default = AuthUser;
