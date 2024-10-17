import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const secret:any = "team_lead_jwt_secret"

export const authenticateTeamLead = (req: any , res: Response, next: NextFunction) => {

    
  const token = req.header('Authorization');

  
  if (!token) {
    console.log('unauthorised',token)
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secret) as any;
    
    req.user = decoded;
    console.log(decoded);
    
    next();
  } catch (error:any) {
    res.status(401).json({ message: error?.message });
  }
};