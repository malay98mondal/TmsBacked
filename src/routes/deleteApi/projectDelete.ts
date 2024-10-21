import { Router, Request, Response } from 'express';
import Project from '../../db/models/Tbl_Project'; // Adjust the path according to your project structure

const projecDeletetRoute = Router();

// Soft Delete API for Project by Project_Id
projecDeletetRoute.delete('/delete-project/:Project_Id', async (req: Request, res: Response) => {
    const { Project_Id } = req.params; // Extract Project_Id from the route parameters

    try {
        // Find the Project by Project_Id and ensure it's not already soft deleted
        const project = await Project.findOne({
            where: { Project_Id, Is_deleted: false }
        });

        // If the Project is not found, return a 404 response
        if (!project) {
            return res.status(404).json({ message: 'Project not found or already deleted.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await project.update({ Is_deleted: true });

        return res.status(200).json({ message: 'Project soft deleted successfully', project });
    } catch (error) {
        console.error('Error in soft deleting Project:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the project.' });
    }
});

export default projecDeletetRoute;
