# Digital Finance Assistant

## Overview
The **Digital Finance Assistant** is a web application that helps users efficiently manage personal finances. Users can track expenses, manage budgets, monitor financial goals, and generate reports. The application ensures secure authentication and data integrity with validations, enabling informed financial decisions.

## Features
- **Authentication & Profile Management**: Sign up, log in, log out, and update profile.
- **Manage Expenses**: Add, update and delete expenses with fields such as category, amount, date, and description.
- **Manage Budgets**: Create, update and delete budgets with fields for period, start date, total budget, status, and notes.
- **Manage Goals**: Create, update and delete saving goals with fields such as name, description, deadline, target, and current amount.
- **Display Reports**: Display summary reports of expenses and budgets and allow users to download the report in PDF format.

## Sample Users for Testing
- Username: test@mail.com | Password: password123

## Project Setup Instructions [EC2]
- Start EC2 instance
    - instance id: i-0c7a7d30cde1805af
    - instance ip: 16.176.67.173
- Rerun build pipline
- Access with given public ip address (using qut local network)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Environment Configuration (`.env`)
Create a `.env` file in the `backend/` root directory:

Please see the details in the report.

## Project Structure
```
IFN-636-A1-Digital-Finance-Assistant-App-A2/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│
├── README.md
└── package.json
```
    ├─ middleware/ # Authentication & validation  
    ├─ test/ # Unit tests for services  
    ├─ .env # Environment variables  

# Setup & Installation

## Clone the repository
```
git clone https://github.com/naratornb/IFN-636-A1-Digital-Finance-Assistant-App-A2.git
cd IFN-636-A1-Digital-Finance-Assistant-App-A2
```
## Install dependencies
```
npm install
cd frontend && npm install
cd ../backend && npm install
```
## Configure environment variables (.env)
## Start development server
```
npm start
```
## Public URL
- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

# Testing

## Unit Testing:
- Tools: Mocha + Chai  
- Focus: Service layer (Expenses, Budgets, Goals, Reports)  
- Unit test files:
    - `backend/test/budgetService.test.js`
    - `backend/test/expenseService.test.js`
    - `backend/test/goalService.test.js`
    - `backend/test/reportService.test.js`

## API Testing:

Tool: Postman  
Endpoints tested:

**Auth/User**
- `POST /api/auth/register` (Register)
- `POST /api/auth/login` (Login)
- `GET /api/auth/profile` (Get profile)

**Budget**
- `POST /api/budgets` (Create budget)
- `GET /api/budgets` (Get all budgets)
- `GET /api/budgets/:id` (Get budget by ID)
- `PUT /api/budgets/:id` (Update budget)
- `DELETE /api/budgets/:id` (Delete budget)

**Expense**
- `POST /api/expenses` (Create expense)
- `GET /api/expenses` (Get all expenses)
- `GET /api/expenses/:id` (Get expense by ID)
- `PUT /api/expenses/:id` (Update expense)
- `DELETE /api/expenses/:id` (Delete expense)

**Goal**
- `POST /api/goals` (Create goal)
- `GET /api/goals` (Get all goals)
- `GET /api/goals/:id` (Get goal by ID)
- `PUT /api/goals/:id` (Update goal)
- `DELETE /api/goals/:id` (Delete goal)

**Report**
- `GET /api/reports` (Get dashboard report)
- `GET /api/reports/pdf` (Download report PDF)
- `GET /api/reports/download-logs` (Get report download logs)
- `DELETE /api/reports/download-logs` (Clear report download logs)

Postman collection: <https://github.com/naratornb/IFN-636-A1-Digital-Finance-Assistant-App-A2/blob/main/backend/postman/postman_collection.json>

## UI/UX Prototyping
- Figma link: <https://www.figma.com/design/FBqsTmSuUTT0cE0ZXVVHC4/UI-Design?node-id=0-1&p=f&t=QyIhFdwOQAC1VT9h-0>  

## CI/CD & Deployment
- GitHub Actions: Automated builds & tests  
- Deployment: AWS EC2 / Elastic Beanstalk  
- Auto-deployment triggered on main branch  

## Notes
- Only service layer is unit tested; models and controllers are used as-is.  
- Swagger annotations are optional for API documentation.


