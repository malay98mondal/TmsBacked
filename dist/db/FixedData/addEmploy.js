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
exports.addDefaultEmployees = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Tbl_Employee_1 = __importDefault(require("../models/Tbl_Employee"));
const addDefaultEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const defaultEmployees = [
        {
            Emp_Id: 1,
            Employee_name: 'Prabeer Sarkar',
            Role_Id: 1,
            email: 'prabeer.sarkar@example.com',
            password: 'Prabeer098@', // Raw password before hashing
        }
    ];
    for (const employee of defaultEmployees) {
        const { Emp_Id, Employee_name, Role_Id, email, password } = employee;
        const foundEmployee = yield Tbl_Employee_1.default.findOne({ where: { email } });
        if (foundEmployee) {
            console.log(`Employee '${Employee_name}' already exists`);
        }
        else {
            const hashed_password = bcrypt_1.default.hashSync(password, 7); // Hashing the password
            const reqData = {
                Emp_Id,
                Employee_name,
                Role_Id,
                Is_deleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                email,
                password: hashed_password,
            };
            // Create the employee record
            const createdEmployee = yield Tbl_Employee_1.default.create(reqData);
            console.log(`Employee '${Employee_name}' created:`, createdEmployee);
        }
    }
});
exports.addDefaultEmployees = addDefaultEmployees;
// Call the function to add default employees
(0, exports.addDefaultEmployees)()
    .then(() => console.log("Default employees added successfully."))
    .catch((error) => console.error("Error adding default employees:", error));
