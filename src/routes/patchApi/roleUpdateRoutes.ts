import { Router } from 'express';
import Role from '../../db/models/Tbl_Role'; // Adjust the import path based on your project structure
import { Op } from 'sequelize';

const roleUpdateRoute = Router();

roleUpdateRoute.patch('/update-role/:Role_Id', async (req: any, res: any) => {
    const { Role_Id } = req.params; // Extract Role_Id from the route parameters
    const { Name, Status } = req.body; // Extract fields from the request body

    try {
        // Find the role by Role_Id
        const role = await Role.findOne({ where: { Role_Id } });

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Validate Name uniqueness if provided
        const errors: { field: string; message: string }[] = [];
        if (Name) {
            const existingRole = await Role.findOne({
                where: {
                    Name,
                    Role_Id: { [Op.ne]: Role_Id }, // Exclude the current role
                },
            });

            if (existingRole) {
                errors.push({ field: 'Name', message: `A role with the name '${Name}' already exists.` });
            }
        }

        // If there are any validation errors, return them
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation errors',
                errors,
            });
        }

        // Update the role if no conflicts are found
        await role.update({
            Status,
        });

        return res.status(200).json({ message: 'Role updated successfully', role });

    } catch (error) {
        console.error('Error in updating role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default roleUpdateRoute;
