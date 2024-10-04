// routes/roleRoutes.ts
import express, { Request, Response } from 'express';
import Role from '../db/models/Tbl_Role';


const roleRoutes = express.Router();

// Get all non-deleted roles
roleRoutes.get('/roles', async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({
      where: {
        Is_deleted: false
      }
    });

    return res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve roles',
      error: error.message
    });
  }
});

// Get a role by ID
roleRoutes.get('/roles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const role = await Role.findOne({
      where: {
        Role_Id: id,
        Is_deleted: false
      }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found or has been deleted'
      });
    }

    return res.status(200).json({
      success: true,
      data: role
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve role',
      error: error.message
    });
  }
});

export default roleRoutes;
