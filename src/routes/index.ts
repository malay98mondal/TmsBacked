import { Router } from 'express';
import projectRoutes from './projectRoutes';
import roleRoutes from './roleRoutes';




const routes = Router();
routes.use('/GetProject', projectRoutes);
routes.use('/GetRole', roleRoutes);



export default routes;
