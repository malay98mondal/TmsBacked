import { Router, Request, Response } from 'express';
import ProjectEmployee from '../../db/models/Tbl_ProjectEmployee'; // Adjust the path according to your project structure

const projectEmployeeDeleteRoute = Router();

// Soft Delete API for ProjectEmployee by ProjectMember_Id
projectEmployeeDeleteRoute.delete('/delete-project-employee/:ProjectMember_Id', async (req: Request, res: Response) => {
    const { ProjectMember_Id } = req.params; // Extract ProjectMember_Id from the route parameters

    try {
        // Find the ProjectEmployee by ProjectMember_Id and ensure it's not already soft deleted
        const projectEmployee = await ProjectEmployee.findOne({
            where: { ProjectMember_Id, Is_deleted: false }
        });

        // If the ProjectEmployee is not found, return a 404 response
        if (!projectEmployee) {
            return res.status(404).json({ message: 'ProjectEmployee not found or already deleted.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await projectEmployee.update({ Is_deleted: true });

        return res.status(200).json({ message: 'ProjectEmployee soft deleted successfully', projectEmployee });
    } catch (error) {
        console.error('Error in soft deleting ProjectEmployee:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the project employee.' });
    }
});

export default projectEmployeeDeleteRoute;
