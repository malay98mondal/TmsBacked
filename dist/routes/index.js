"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const roleRoutes_1 = __importDefault(require("./roleRoutes"));
const employeeRoutes_1 = __importDefault(require("./employeeRoutes"));
const projectEmployeeRoutes_1 = __importDefault(require("./projectEmployeeRoutes"));
const taskRoutes_1 = __importDefault(require("./taskRoutes"));
const EmploySideRoutes_1 = __importDefault(require("./EmploySideRoutes"));
const employeeRoutesUpdate_1 = __importDefault(require("./patchApi/employeeRoutesUpdate"));
const projectEmployeeRoutesUpdate_1 = __importDefault(require("./patchApi/projectEmployeeRoutesUpdate"));
const projectupdateRoutes_1 = __importDefault(require("./patchApi/projectupdateRoutes"));
const roleUpdateRoutes_1 = __importDefault(require("./patchApi/roleUpdateRoutes"));
const taskDetailsUpdateRoutes_1 = __importDefault(require("./patchApi/taskDetailsUpdateRoutes"));
const employeeDelete_1 = __importDefault(require("./deleteApi/employeeDelete"));
const taskDetailsDelete_1 = __importDefault(require("./deleteApi/taskDetailsDelete"));
const roleDelete_1 = __importDefault(require("./deleteApi/roleDelete"));
const projectEmployeeDelele_1 = __importDefault(require("./deleteApi/projectEmployeeDelele"));
const projectDelete_1 = __importDefault(require("./deleteApi/projectDelete"));
const AuthRoute_1 = __importDefault(require("./Auth/AuthRoute"));
const routes = (0, express_1.Router)();
routes.use('/auth', AuthRoute_1.default);
routes.use('/GetProject', projectRoutes_1.default);
routes.use('/GetRole', roleRoutes_1.default);
routes.use('/Employee', employeeRoutes_1.default);
routes.use('/ProjectEmployee', projectEmployeeRoutes_1.default);
routes.use('/TaskRoutes', taskRoutes_1.default);
routes.use('/EmployeTaskRoute', EmploySideRoutes_1.default);
routes.use('/EmployeUpdateRoute', employeeRoutesUpdate_1.default);
routes.use('/ProjectEmployeUpdateRoute', projectEmployeeRoutesUpdate_1.default);
routes.use('/ProjectUpdateRoute', projectupdateRoutes_1.default);
routes.use('/roleUpdateRoutes', roleUpdateRoutes_1.default);
routes.use('/taskDetailsUpdateRoute', taskDetailsUpdateRoutes_1.default);
routes.use('/employeeDelete', employeeDelete_1.default);
routes.use('/taskDetailsDelete', taskDetailsDelete_1.default);
routes.use('/taskDelete', roleDelete_1.default);
routes.use('/projectEmployeeDelete', projectEmployeeDelele_1.default);
routes.use('/projectDelete', projectDelete_1.default);
exports.default = routes;
