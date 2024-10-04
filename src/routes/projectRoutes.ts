// routes/projectRoutes.ts
import express, { Request, Response } from 'express';
import Project from '../db/models/Tbl_Project';


const projectRoutes = express.Router();

// Get all non-deleted projects
projectRoutes.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll({
      where: {
        Is_deleted: false
      }
    });

    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: error.message
    });
  }
});

// Get a project by ID
projectRoutes.get('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await Project.findOne({
      where: {
        Project_Id: id,
        Is_deleted: false
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or has been deleted'
      });
    }

    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      error: error.message
    });
  }
});

export default projectRoutes;
