import { Router } from 'express';
import { Op } from 'sequelize';
import ProjectEmployee from '../../db/models/Tbl_ProjectEmployee';

const projectEmployeeUpdateRoute = Router();

projectEmployeeUpdateRoute.patch('/update-project-employee/:ProjectMember_Id', async (req: any, res: any) => {
    const { ProjectMember_Id } = req.params; // Extract ProjectMember_Id from the route parameters
    const { Project_Id, Emp_Id, Role_Id } = req.body; // Extract fields from the request body
    // const modified_by = req.user?.id; // Assuming you have user authentication and req.user is available

    try {
        // Find the ProjectEmployee by ProjectMember_Id and ensure it's not deleted (Is_deleted is false)
        const projectEmployee = await ProjectEmployee.findOne({ where: { ProjectMember_Id, Is_deleted: false } });

        if (!projectEmployee) {
            return res.status(404).json({ message: 'Project Employee not found' });
        }

        const errors: { field: string; message: string }[] = [];

        // Check if the combination of Project_Id and Emp_Id is unique, excluding the current ProjectEmployee
        const existingProjectEmployee = await ProjectEmployee.findOne({
            where: {
                Project_Id,
                Emp_Id,
                Is_deleted: false,
                ProjectMember_Id: { [Op.ne]: ProjectMember_Id }, // Exclude the current ProjectEmployee
            },
        });

        if (existingProjectEmployee) {
            errors.push({ field: 'Project_Id and Emp_Id', message: 'This employee is already assigned to the project.' });
        }

        // If there are any conflicts, return the errors
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }

        // Update the ProjectEmployee if no conflicts are found
        await projectEmployee.update({
            Project_Id,
            Emp_Id,
            Role_Id,
        });

        return res.status(200).json({ message: 'Project Employee updated successfully', projectEmployee });

    } catch (error) {
        console.error('Error in updating project employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default projectEmployeeUpdateRoute;
