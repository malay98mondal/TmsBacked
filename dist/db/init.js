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
const Tbl_Project_1 = __importDefault(require("./models/Tbl_Project"));
const Tbl_Role_1 = __importDefault(require("./models/Tbl_Role"));
const Tbl_Task_1 = __importDefault(require("./models/Tbl_Task"));
const Tbl_TaskDetails_1 = __importDefault(require("./models/Tbl_TaskDetails"));
// Import your data insertion functions
// import { addProject } from "./FixedData/projectData"
const roleData_1 = require("./FixedData/roleData");
const Tbl_ProjectEmployee_1 = __importDefault(require("./models/Tbl_ProjectEmployee"));
const addEmploy_1 = require("./FixedData/addEmploy");
const Tbl_Employee_1 = __importDefault(require("./models/Tbl_Employee"));
const isDev = false;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Tbl_Project_1.default.sync({ alter: isDev });
        yield Tbl_Role_1.default.sync({ alter: isDev });
        yield Tbl_Employee_1.default.sync({ alter: isDev });
        yield Tbl_Task_1.default.sync({ alter: isDev });
        yield Tbl_TaskDetails_1.default.sync({ alter: isDev });
        yield Tbl_TaskDetails_1.default.sync({ alter: isDev });
        yield Tbl_ProjectEmployee_1.default.sync({ alter: isDev });
        // await addProject(); 
        yield (0, roleData_1.addRole)();
        yield (0, addEmploy_1.addDefaultEmployees)();
    });
}
const dbInit = () => {
    init();
};
exports.default = dbInit;
