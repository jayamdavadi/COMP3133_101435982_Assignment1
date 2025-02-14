# Employee Management System (GraphQL API)

## 📌 Project Overview

This project is a GraphQL-based Employee Management System built using Node.js, Apollo Server, and MongoDB. The system provides authentication using JWT (JSON Web Token) and allows users to perform CRUD operations on employee records.

---

📌 Technologies Used
Node.js (Backend Framework)
Apollo Server (GraphQL API)
MongoDB (Database)
Mongoose (ODM for MongoDB)
JWT Authentication (Secure API Calls)
Postman (API Testing)

---

Installation & Setup
1️⃣ Clone the Repository
sh
git clone https://github.com/jayamdavadi/COMP3133_101435982_Assignment1.git
cd COMP3133_101435982_Assignment1

````
### 2️⃣ Install Dependencies
```sh
npm install
````

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```sh
MONGO_URI=mongodb://localhost:27017/comp3133_101435982_assignment1
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h
PORT=5000
```

### 4️⃣ Start the Server
node server.js
```

✅ The GraphQL API will be running at: `http://localhost:5000/graphql`

---

## 📌 GraphQL API Endpoints

### 1️⃣ Signup (Create a New User)

```graphql
mutation {
  signup(
    username: "JayAmdavadi"
    email: "jayamdavadi2003@gmail.com"
    password: "Password123"
  ) {
    id
    username
    email
  }
}
```

### 2️⃣ Login (Generate JWT Token)

```graphql
query {
  login(username: "JayAmdavadi", password: "Password123") {
    token
    user {
      id
      username
    }
  }
}
```

### **3️⃣ Add Employee (Requires JWT Token)**

```graphql
mutation {
  addEmployee(
    first_name: "Sam"
    last_name: "Verma"
    email: "sam.verma@company.com"
    gender: "Male"
    designation: "Software Engineer"
    salary: 55000
    date_of_joining: "2023-05-10"
    department: "IT"
    employee_photo: "sam_photo.jpg"
  ) {
    id
    first_name
    last_name
    email
    designation
  }
}
```


### 4️⃣ Get All Employees (Requires JWT Token)

```graphql
query {
  getAllEmployees {
    id
    first_name
    last_name
    email
    designation
    department
  }
}
```



### 5️⃣ Search Employee by ID (Requires JWT Token)

```graphql
query {
  searchEmployeeById(id: "EMPLOYEE_ID_HERE") {
    first_name
    last_name
    email
    department
  }
}
```

### 6️⃣ Search Employee by Designation or Department (Requires JWT Token)

```graphql
query {
  searchEmployeeByDesignationOrDepartment(designation: "Software Engineer") {
    first_name
    last_name
    email
    department
  }
}
```

### 7️⃣ Update Employee (Requires JWT Token)

```graphql
mutation {
  updateEmployee(
    id: "EMPLOYEE_ID_HERE"
    designation: "Senior Software Engineer"
    salary: 70000
  ) {
    first_name
    designation
    salary
  }
}
```

### 8️⃣ Delete Employee (Requires JWT Token)

```graphql
mutation {
  deleteEmployee(id: "EMPLOYEE_ID_HERE")
}
```

---

## 📌 Assignment Submission Checklist

✅ **GitHub Repository Link**
✅ **Postman Collection JSON File**
✅ **Screenshots Folder (ZIP)**
