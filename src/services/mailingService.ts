// mailQueue.ts
import { Queue, Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import "dotenv/config"
import IORedis from 'ioredis';
 import '../routes';  

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const mailQueue = new Queue('mail', { connection });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER||"prabeersarkar098@gmail.com",
    pass: process.env.EMAIL_PASS||'eftyaffbnbtkidmv',
  },
});

const worker = new Worker('mail', async (job: Job) => {
  const { mailOptions }: { mailOptions: MailOptions } = job.data;

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job completed with result ${job.returnvalue}`);
});

worker.on('failed', (job, err) => {
  console.log(`Job failed with error ${err.message}`);
});

export default mailQueue;
