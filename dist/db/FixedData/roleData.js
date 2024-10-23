"use strict";
// services/RoleService.ts
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
exports.addRole = void 0;
const Tbl_Role_1 = __importDefault(require("../models/Tbl_Role"));
const addRole = () => __awaiter(void 0, void 0, void 0, function* () {
    // First demo role
    const findRole1 = yield Tbl_Role_1.default.findOne({ where: { Name: "Manager" } });
    if (findRole1) {
        console.log("Role 'EMS' already exists");
    }
    else {
        const reqData1 = {
            Name: "Manager",
            Status: "Active",
            Is_deleted: false,
        };
        const createRole1 = yield Tbl_Role_1.default.create(reqData1);
        console.log("Role 'Manager' created:", createRole1);
    }
    // Second demo Role
    const findRole2 = yield Tbl_Role_1.default.findOne({ where: { Name: "Team_Lead" } });
    if (findRole2) {
        console.log("Role 'Team_Lead' already exists");
    }
    else {
        const reqData2 = {
            Name: "Team_Lead",
            Status: "Active",
            Is_deleted: false,
        };
        const createRole2 = yield Tbl_Role_1.default.create(reqData2);
        console.log("Role 'Team_Lead' created:", createRole2);
    }
    // Third demo Role
    const findRole3 = yield Tbl_Role_1.default.findOne({ where: { Name: "Employee" } });
    if (findRole3) {
        console.log("Role 'Team_Lead' already exists");
    }
    else {
        const reqData3 = {
            Name: "Employee",
            Status: "Active",
            Is_deleted: false,
        };
        const createRole3 = yield Tbl_Role_1.default.create(reqData3);
        console.log("Role 'Team_Lead' created:", createRole3);
    }
});
exports.addRole = addRole;
