"use strict";
// services/projectService.ts
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
exports.addProject = void 0;
const Tbl_Project_1 = __importDefault(require("../models/Tbl_Project"));
const addProject = () => __awaiter(void 0, void 0, void 0, function* () {
    // First demo project
    const findProject1 = yield Tbl_Project_1.default.findOne({ where: { Project_Name: "EMS" } });
    if (findProject1) {
        console.log("Project 'EMS' already exists");
    }
    else {
        const reqData1 = {
            Project_Name: "EMS",
            Status: "Active",
            Is_deleted: false,
        };
        const createProject1 = yield Tbl_Project_1.default.create(reqData1);
        console.log("Project 'EMS' created:", createProject1);
    }
    // Second demo project
    const findProject2 = yield Tbl_Project_1.default.findOne({ where: { Project_Name: "Amb" } });
    if (findProject2) {
        console.log("Project 'Amb' already exists");
    }
    else {
        const reqData2 = {
            Project_Name: "Amb",
            Status: "Active",
            Is_deleted: false,
        };
        const createProject2 = yield Tbl_Project_1.default.create(reqData2);
        console.log("Project 'Amb' created:", createProject2);
    }
});
exports.addProject = addProject;
