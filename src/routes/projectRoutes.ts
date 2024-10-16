// routes/projectRoutes.ts
import express, { Request, Response } from 'express';
import Project from '../db/models/Tbl_Project';


const projectRoutes = express.Router();

projectRoutes.post("/addProject", async (req: any, res:any) => {
  try {
    const { Project_Name, Status } = req.body;

    // Input validation (optional)
    if (!Project_Name || !Status) {
      return res.status(400).json({ error: "Project_Name and Status are required." });
    }

    // Create a new project
    const newProject = await Project.create({
      Project_Name,
      Status,
      Is_deleted:  false, 
    });

    return res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ success: false, error: "Failed to create project." });
  }
});




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
