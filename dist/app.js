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
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const init_1 = __importDefault(require("./db/init"));
const cors = require("cors");
const serverless_http_1 = __importDefault(require("serverless-http"));
const queueMail_1 = __importDefault(require("./middleware/queueMail"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(cors()); // enable cors
// Body parsing Middleware
app.use(express_1.default.json()); // josn middle ware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//app.use(queueMail);
app.use(queueMail_1.default);
// // database initialization
(0, init_1.default)();
//let uiCodePath = process.env.NODE_ENV == "development"? "client/dist" : "client-dist";
let uiCodePath = "client-dist"; //use this to debug production code 
app.use(express_1.default.static(path_1.default.join(__dirname, '..', uiCodePath)));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile(path_1.default.join(__dirname, "..", uiCodePath, "index.html"));
}));
//Intialising routes 
app.use('/api/v1', routes_1.default);
app.use('/api/v1/protected', (req, res) => {
    res.send({ message: 'This is a routes route' });
});
app.get("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile(path_1.default.join(__dirname, "..", uiCodePath, "index.html"));
}));
app.listen(5000, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
const handler = (0, serverless_http_1.default)(app);
module.exports.handler = handler;
