import { Router } from 'express';
import projectRoutes from './projectRoutes';
import roleRoutes from './roleRoutes';
import employeeRoutes from './employeeRoutes';
import projectEmployeeRoutes from './projectEmployeeRoutes';
import Task from './taskRoutes';
import EmploySideRoute from './EmploySideRoutes';
import employeeRoute from './patchApi/employeeRoutesUpdate';
import projectEmployeeUpdateRoute from './patchApi/projectEmployeeRoutesUpdate';
import projectUpdateRoute from './patchApi/projectupdateRoutes';
import roleUpdateRoute from './patchApi/roleUpdateRoutes';
import taskDetailsUpdateRoute from './patchApi/taskDetailsUpdateRoutes';
import employeeDeleteRoute from './deleteApi/employeeDelete';
import taskDetailsDeleteRoute from './deleteApi/taskDetailsDelete';
import roleDeleteRoute from './deleteApi/roleDelete';
import projectEmployeeDeleteRoute from './deleteApi/projectEmployeeDelele';
import projecDeletetRoute from './deleteApi/projectDelete';
import AuthRoute from './Auth/AuthRoute';
import { authenticateManager } from '../middleware/authenticateManager';




const routes = Router();

routes.use('/auth', AuthRoute);

routes.use('/GetProject', projectRoutes);
routes.use('/GetRole', roleRoutes);
routes.use('/Employee', employeeRoutes);

routes.use('/ProjectEmployee', projectEmployeeRoutes);
routes.use('/TaskRoutes',Task)
routes.use('/EmployeTaskRoute',EmploySideRoute)
routes.use('/EmployeUpdateRoute',employeeRoute )
routes.use('/ProjectEmployeUpdateRoute',projectEmployeeUpdateRoute )
routes.use('/ProjectUpdateRoute',projectUpdateRoute)
routes.use('/roleUpdateRoutes',roleUpdateRoute)
routes.use('/taskDetailsUpdateRoute',taskDetailsUpdateRoute)

routes.use('/employeeDelete',employeeDeleteRoute)

routes.use('/taskDetailsDelete',taskDetailsDeleteRoute)
routes.use('/taskDelete',roleDeleteRoute)
routes.use('/projectEmployeeDelete',projectEmployeeDeleteRoute)
routes.use('/projectDelete',projecDeletetRoute)



export default routes;
