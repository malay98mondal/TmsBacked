import { Router } from 'express';
import projectRoutes from './projectRoutes';
import roleRoutes from './roleRoutes';
import employeeRoutes from './employeeRoutes';
import projectEmployeeRoutes from './projectEmployeeRoutes';
import Task from './taskRoutes';
import EmploySideRoute from './EmploySideRoutes';




const routes = Router();
routes.use('/GetProject', projectRoutes);
routes.use('/GetRole', roleRoutes);
routes.use('/Employee', employeeRoutes);

routes.use('/ProjectEmployee', projectEmployeeRoutes);
routes.use('/TaskRoutes',Task)
routes.use('/EmployeTaskRoute',EmploySideRoute)

export default routes;
