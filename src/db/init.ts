import Employee from "./models/Tbl_Employee";
import Project from "./models/Tbl_Project";
import Role from "./models/Tbl_Role";
import Task from "./models/Tbl_Task";
import TaskDetails from "./models/Tbl_TaskDetails";
// Import your data insertion functions
import { addProject } from "./FixedData/projectData"
import { addRole } from "./FixedData/roleData";
const isDev = true






async function init() {

  await Project.sync({ alter: isDev });
  await Role.sync({ alter: isDev });
  await Employee.sync({ alter: isDev });
  await Task.sync({ alter: isDev });
  await TaskDetails.sync({ alter: isDev });
  await TaskDetails.sync({ alter: isDev });

  
    // Insert demo data after syncing
    await addProject(); // Call the function to add data to the Tbl_Project table
    // Insert demo data after syncing
    await addRole(); // Call the function to add data to the Tbl_Project table
 
  }
const dbInit = () => {
    init();
  };
  
  export default dbInit;
    
  