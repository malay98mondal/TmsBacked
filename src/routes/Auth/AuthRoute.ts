import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../../db/models/Tbl_Employee';

const AuthUser = express.Router();

const MANAGER_SECRET = 'manager_jwt_secret'; 
const TEAM_LEAD_SECRET = 'team_lead_jwt_secret'; 
const MEMBER_SECRET = 'member_jwt_secret'; 

AuthUser.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).send({ message: "Please enter a valid email" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).send({ message: "Please enter a valid password" });
    }

    const findUser = await Employee.findOne({
      where: { email },
    });

    if (!findUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (findUser.Is_deleted) {
      return res.status(404).send({ message: "User account deleted" });
    }

    const valid = await bcrypt.compare(password, findUser.password);
    if (!valid) {
      return res.status(401).send({ message: "Email and password do not match" });
    }

    let token;
    let payload = {
      Emp_Id: findUser.Emp_Id,
      email: findUser.email,
      Role_Id: findUser.Role_Id,
    };

    switch (findUser.Role_Id) {
      case 1: // Manager
        token = jwt.sign(payload, MANAGER_SECRET, { expiresIn: "1h" });
        return res.status(200).send({ message: `${findUser.Employee_name} logged in as Manager successfully`, access_token: token, type: 1 });
      
      case 2: // Team Lead
        token = jwt.sign(payload, TEAM_LEAD_SECRET, { expiresIn: "1h" });
        return res.status(200).send({ message: `${findUser.Employee_name} logged in as Team Lead successfully`, access_token: token, type: 2 });
      
      case 3: // Member
        token = jwt.sign(payload, MEMBER_SECRET, { expiresIn: "1h" });
        return res.status(200).send({ message: `${findUser.Employee_name} logged in as Member successfully`, access_token: token, type: 3 });

      default:
        return res.status(403).send({ message: "Unauthorized role" });
    }

  } catch (error: any) {
    return res.status(500).send({ messageError: `Error in login: ${error.message}` });
  }
});

export default AuthUser;
