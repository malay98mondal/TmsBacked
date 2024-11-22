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
// mailQueue.ts
const bullmq_1 = require("bullmq");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const ioredis_1 = __importDefault(require("ioredis"));
require("../routes");
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});
const mailQueue = new bullmq_1.Queue('mail', { connection });
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER || "prabeersarkar098@gmail.com",
        pass: process.env.EMAIL_PASS || 'eftyaffbnbtkidmv',
    },
});
const worker = new bullmq_1.Worker('mail', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { mailOptions } = job.data;
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}), { connection });
worker.on('completed', (job) => {
    console.log(`Job completed with result ${job.returnvalue}`);
});
worker.on('failed', (job, err) => {
    console.log(`Job failed with error ${err.message}`);
});
exports.default = mailQueue;
