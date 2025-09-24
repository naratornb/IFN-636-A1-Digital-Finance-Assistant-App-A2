# Digital Finance Assistant

## Overview
The Digital Finance Assistant application helps users efficiently manage their personal finances through a user-friendly interface for tracking expenses, managing budgets, monitoring financial goals, and generating reports. It includes secure user authentication, allowing users to sign up, log in, log out, and manage their profiles. Built-in validations ensure data integrity and a seamless user experience, empowering users to make informed financial decisions.

## Features

### Authentication & Profile Management
- **Signup**: Create a new account
- **Login**: Access the account
- **Logout**: Sign out securely
- **Update profile**: Edit personal information

### Expenses (CRUD)
- **Create**: Add new expense records
- **Read**: View expense history
- **Update**: Edit existing expenses
- **Delete**: Remove expenses

### Budget (CRUD)
- **Create**: Set a new budget
- **Read**: View current budgets
- **Update**: Adjust budgets
- **Delete**: Remove budgets

### Goals (CRUD)
- **Create**: Define new financial goals
- **Read**: Track progress on goals
- **Update**: Edit goal details
- **Delete**: Remove goals

### Reports (CRUD)
- **Create**: Generate new reports
- **Read**: View financial summaries
- **Update**: Refresh or adjust report parameters
- **Delete**: Remove saved reports

## Development Notes
This application is mostly precompiled. However, students will actively develop CRUD functionality for expenses, budgets, goals, and reports, while also interacting with GitHub during development.

## Prerequisites
Please install the following software and create accounts in these web tools:

- **Node.js**: [https://nodejs.org/en](https://nodejs.org/en)
- **Git**: [https://git-scm.com/](https://git-scm.com/)
- **VS Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **MongoDB Account**: [https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)  
  *Note: In the tutorial, we show how to create an account and database (follow step number 2).*
- **GitHub Account**: [https://github.com/signup](https://github.com/signup)

## Getting Started
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up your environment variables
4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure
- `frontend/`: React-based user interface
- `backend/`: Express.js API server
- `backend/models/`: MongoDB data models
- `backend/controllers/`: Request handlers
- `backend/routes/`: API endpoint definitions
