const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();
const { ApolloError } = require('apollo-server-express');

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) throw new ApolloError("User not found", "USER_NOT_FOUND");

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new ApolloError("Invalid credentials", "INVALID_CREDENTIALS");

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return { token, user };
        },
        getAllEmployees: async (_, __, context) => {
            authMiddleware(context);
            return await Employee.find();
        },
        searchEmployeeById: async (_, { id }, context) => {
            authMiddleware(context);
            return await Employee.findById(id);
        },
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }, context) => {
            authMiddleware(context);
            return await Employee.find({
                $or: [{ designation }, { department }]
            });
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const errors = [];
            if (!username || username.length < 3) errors.push("Username must be at least 3 characters.");
            if (!email.includes('@')) errors.push("Invalid email format.");
            if (password.length < 6) errors.push("Password must be at least 6 characters.");
            if (errors.length > 0) throw new ApolloError(errors.join(" "), "INVALID_INPUT");

            const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
            if (existingUser) throw new ApolloError("Email already in use.", "EMAIL_IN_USE");

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return { token, user };
        },
        addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }) => {
            const errors = [];
            
            if (!first_name) errors.push("First name is required.");
            if (!last_name) errors.push("Last name is required.");
            if (!email || !email.includes('@')) errors.push("Valid email is required.");
            if (!gender) errors.push("Gender is required.");
            if (!designation) errors.push("Designation is required.");
            if (!salary || salary < 1000) errors.push("Salary must be at least 1000.");
            if (!date_of_joining) errors.push("Date of joining is required.");
            if (!department) errors.push("Department is required.");
            
            if (errors.length > 0) throw new ApolloError(errors.join(" "), "INVALID_INPUT");
        
            const existingEmployee = await Employee.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
            if (existingEmployee) throw new ApolloError("Email already in use for another employee.", "EMAIL_IN_USE");
        
            const employee = new Employee({
                first_name,
                last_name,
                email,
                gender,
                designation,
                salary,
                date_of_joining,
                department,
                employee_photo
            });
        
            await employee.save();
            return employee;
        }
        ,
        updateEmployee: async (_, { id, ...updates }) => {
            if (updates.email && !updates.email.includes('@')) {
                throw new ApolloError("Invalid email format.", "INVALID_EMAIL");
            }
            if (updates.salary && updates.salary < 1000) {
                throw new ApolloError("Salary must be at least 1000.", "INVALID_SALARY");
            }
            return await Employee.findByIdAndUpdate(id, updates, { new: true });
        },
        deleteEmployee: async (_, { id }) => {
            await Employee.findByIdAndDelete(id);
            return "Employee deleted successfully";
        }
    }
};

module.exports = resolvers;
