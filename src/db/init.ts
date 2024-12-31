
import Project from "./models/Tbl_Project";
import Role from "./models/Tbl_Role";
import Task from "./models/Tbl_Task";
import TaskDetails from "./models/Tbl_TaskDetails";
// Import your data insertion functions
// import { addProject } from "./FixedData/projectData"
import { addRole } from "./FixedData/roleData";
import ProjectEmployee from "./models/Tbl_ProjectEmployee";
import { addDefaultEmployees } from "./FixedData/addEmploy";
import Employee from "./models/Tbl_Employee";
const isDev = false






async function init() {

  await Project.sync({ alter: isDev });
  await Role.sync({ alter: isDev });
  await Employee.sync({ alter: isDev });
  await Task.sync({ alter: isDev });
  await TaskDetails.sync({ alter: isDev });
  await TaskDetails.sync({ alter: isDev });
  await ProjectEmployee.sync({ alter: isDev });

 
    // await addProject(); 
    await addRole();
    await addDefaultEmployees();
    
 
  }
const dbInit = () => {
    init();
  };
  
  export default dbInit;
    
  