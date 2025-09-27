// src/services/ExpenseService.js
import axiosInstance from "../axiosConfig";

const API_URL = '/api/expenses/';

class ExpenseService {
  constructor() {
    this.api = axiosInstance;
  }

  // Factory Method Pattern: This method creates a new expense resource via API
  async createExpense(token, expenseData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.post(API_URL, expenseData, config);
    return response.data;
  }

  // Retrieves all expenses using the same authorization pattern
  // Optional params for filtering expenses
  async getExpenses(token, params = {}) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    };
    const response = await this.api.get(API_URL, config);
    return response.data;
  }

  // Retrieves an expense by ID using the same authorization pattern
  async getExpenseById(token, id) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.get(`${API_URL}${id}`, config);
    return response.data;
  }

  // Updates an expense by ID using the same authorization pattern
  async updateExpense(token, id, expenseData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.put(`${API_URL}${id}`, expenseData, config);
    return response.data;
  }

  // Deletes an expense by ID using the same authorization pattern
  async deleteExpense(token, id) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.delete(`${API_URL}${id}`, config);
    return response.data;
  }
}

const expenseService = new ExpenseService();
export default expenseService;
