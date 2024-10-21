import bcrypt from 'bcrypt';
import Employee from '../models/Tbl_Employee';

export const addDefaultEmployees = async () => {
    const defaultEmployees = [
        {
            Emp_Id: 1,  // Ensure this ID is unique
            Employee_name: 'Prabeer Sarkar',
            Role_Id: 1, // Adjust according to your roles
            email: 'prabeer.sarkar@example.com',
            password: 'Prabeer098@', // Raw password before hashing
        }
    
    ];

    for (const employee of defaultEmployees) {
        const { Emp_Id, Employee_name, Role_Id, email, password } = employee;

        const foundEmployee = await Employee.findOne({ where: { email } });

        if (foundEmployee) {
            console.log(`Employee '${Employee_name}' already exists`);
        } else {
          const hashed_password = bcrypt.hashSync(password, 7); // Hashing the password

            const reqData = {
                Emp_Id,
                Employee_name,
                Role_Id,
                Is_deleted: false,
                createdAt: new Date(), 
                updatedAt: new Date(),
                email,
                password: hashed_password, 
            };

            // Create the employee record
            const createdEmployee = await Employee.create(reqData);
            console.log(`Employee '${Employee_name}' created:`, createdEmployee);
        }
    }
};

// Call the function to add default employees
addDefaultEmployees()
    .then(() => console.log("Default employees added successfully."))
    .catch((error) => console.error("Error adding default employees:", error));
