import { Router } from 'express';
import { Op } from 'sequelize';
import Project from '../../db/models/Tbl_Project';

const projectUpdateRoute = Router();

projectUpdateRoute.patch('/update-project/:project_id', async (req: any, res: any) => {
    const { project_id } = req.params; // Extract project_id from the route parameters
    const { Project_Name, Status } = req.body; // Extract fields from the request body

    try {
        // Find the project by project_id
        const project = await Project.findOne({ where: { Project_Id: project_id } });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const errors: { field: string; message: string }[] = [];

        // Check if Project_Name is unique, excluding the current project
        if (Project_Name) {
            const existingProject = await Project.findOne({
                where: {
                    Project_Name,
                    Project_Id: { [Op.ne]: project_id }, // Exclude the current project
                },
            });

            if (existingProject) {
                errors.push({ field: 'Project_Name', message: `A project with the name '${Project_Name}' already exists.` });
            }
        }

        // If there are any conflicts, return the errors
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }

        // Update the project if no conflicts are found
        await project.update({
            Project_Name,
            Status,
        });

        return res.status(200).json({ message: 'Project updated successfully', project });

    } catch (error) {
        console.error('Error in updating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default projectUpdateRoute;
