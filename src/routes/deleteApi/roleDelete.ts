import { Router, Request, Response } from 'express';
import Role from '../../db/models/Tbl_Role'; // Adjust the path as per your project structure

const roleDeleteRoute = Router();

// Soft Delete API for Role by Role_Id
roleDeleteRoute.delete('/delete-role/:Role_Id', async (req: Request, res: Response) => {
    const { Role_Id } = req.params; // Extract Role_Id from request parameters

    try {
        // Find the role by Role_Id and ensure it's not already soft deleted
        const role = await Role.findOne({
            where: { Role_Id, Is_deleted: false }
        });

        // If the role is not found, return a 404 response
        if (!role) {
            return res.status(404).json({ message: 'Role not found or already deleted.' });
        }

        // Perform a soft delete by updating the Is_deleted field to true
        await role.update({ Is_deleted: true });

        return res.status(200).json({ message: 'Role soft deleted successfully', role });
    } catch (error) {
        console.error('Error in performing soft delete for role:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the role.' });
    }
});

export default roleDeleteRoute;
