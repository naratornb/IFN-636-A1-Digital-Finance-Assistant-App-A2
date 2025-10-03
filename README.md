# Digital Finance Assistant

## Overview
The **Digital Finance Assistant** is a web application that helps users efficiently manage personal finances. Users can track expenses, manage budgets, monitor financial goals, and generate reports. The application ensures secure authentication and data integrity with validations, enabling informed financial decisions.

## Features
- **Authentication & Profile Management**: Signup, Login, Logout, Update profile
- **Expenses (CRUD)**: Create, Read, Update, Delete
- **Budgets (CRUD)**: Create, Read, Update, Delete
- **Goals (CRUD)**: Create, Read, Update, Delete
- **Reports (CRUD)**: Create, Read, Update, Delete

## Sample Users for Testing
- Username: test1@example.com | Password: password123
- Username: test2@example.com | Password: password456

## Environment Configuration (`.env`)
Create a `.env` file in the `backend/` root directory:

```
PORT=5000
MONGO_URI=mongodb+srv://IAmInevitableLeo:kin12664@cluster0.omi2auq.mongodb.net/DFA_Database?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=2J8zqkP7VN6bxzg+Wy7DQZsd3Yx8mF3Bl0kch6HYtFs=
PORT=5001
ENV_NAME=local
```

## Project Structure
frontend/ # React-based UI  
backend/ # Express.js server  
├─ controllers/ # Handles requests  
├─ models/ # MongoDB schemas  
├─ repositories/ # Data access layer  
├─ services/ # Business logic layer  
├─ routes/ # API endpoints  
├─ middleware/ # Authentication & validation  
├─ tests/ # Unit tests for services  
├─ .env # Environment variables  

## Setup & Installation
```bash
# Clone the repository
git clone <repo-url>
cd digital-finance-assistant

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Configure environment variables (.env)
# Start development server
npm run dev

## Design Patterns & OOP Concepts

**Patterns and Usage:**  
- Singleton → One instance for app-wide config/logger  
- Repository → Centralized data handling between services and DB   
- Observer → Notify users of changes automatically  
- Factory Method → Return Admin/Member/Guest objects  
- Builder → Construct complex objects with method chaining  
- Decorator → Add logging, alerts, or formatting dynamically  
- Strategy → Swap sorting/filtering dynamically    


**OOP Principles Applied:**  
- Encapsulation → Internal logic hidden within services  
- Inheritance → User subclasses (Admin, Member)  
- Polymorphism → Methods with different behaviors for Goal, Expense, Budget  
- Abstraction → Interfaces for repositories  

## Testing

**Unit Testing:**  
- Tools: Mocha + Chai  
- Focus: Service layer (Expenses, Budgets, Goals, Reports)  
- Examples: `tests/expenseService.test.js`, `tests/budgetService.test.js`  

**API Testing:**  
- Tool: Postman  
- Endpoints tested: `POST /login`, `GET /expenses`, `POST /budgets`, `PUT /goals/:id`, `DELETE /reports/:id`  
- Postman collection: [Link]  

## UI/UX Prototyping
- Figma link: <https://www.figma.com/design/FBqsTmSuUTT0cE0ZXVVHC4/UI-Design?node-id=0-1&p=f&t=QyIhFdwOQAC1VT9h-0>  

## CI/CD & Deployment
- GitHub Actions: Automated builds & tests  
- Deployment: AWS EC2 / Elastic Beanstalk  
- Auto-deployment triggered on main branch  

## Notes
- Only service layer is unit tested; models and controllers are used as-is.  
- Swagger annotations are optional for API documentation.


