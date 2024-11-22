import { Request, Response, NextFunction } from 'express';
import mailQueue from '../services/mailingservice';

const queueMail = (req: any, res: any, next: NextFunction) => {
  req.queueMail = async (mailOptions: object) => {
    try {
      const job = await mailQueue.add('sendMail', { mailOptions }, { 
        removeOnComplete: { age: 300 }, 
        removeOnFail: { age: 300 } 
      });
      console.log('Job added to queue:', job.id);
      return job;
    } catch (error) {
      console.error('Error adding job to queue:', error);
      throw error;
    }
  };
  next();
};

export default queueMail;
