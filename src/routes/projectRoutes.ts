// routes/projectRoutes.ts
import express, { Request, Response } from 'express';
import Project from '../db/models/Tbl_Project';
import { authenticateManager } from '../middleware/authenticateManager';
import { Op } from 'sequelize';


const projectRoutes = express.Router();

projectRoutes.post("/addProject",authenticateManager, async (req: any, res:any) => {
  try {
    const { Project_Name, Status } = req.body;
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




projectRoutes.get('/projects', authenticateManager, async (req: Request, res: Response) => {
  try {
    // Default values for pagination
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string, 5) || 5;

    // Search query from the request (if any)
    const searchQuery = req.query.search || '';

    // Calculate the offset (starting point for the query)
    const offset = (page - 1) * pageSize;

    // Create search condition for project name or any other field you'd like to search
    const searchCondition = searchQuery
      ? {
          [Op.or]: [
            { Project_Name: { [Op.iLike]: `%${searchQuery}%` } }
          ]
        }
      : {};

    // Fetch projects with pagination and search
    const { count, rows: projects } = await Project.findAndCountAll({
      where: {
        Is_deleted: false,
        ...searchCondition
      },
      limit: pageSize,
      offset: offset
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / pageSize);

    return res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        pageSize: pageSize,
        totalItems: count
      }
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
