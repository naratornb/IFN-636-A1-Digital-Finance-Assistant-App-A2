import axiosInstance from "../axiosConfig";

const API_URL = '/api/expenses/';

class ExpenseService {
  constructor() {
    this.api = axiosInstance;
  }

  async createExpense(token, expenseData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.post(API_URL, expenseData, config);
    return response.data;
  }

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

  async getExpenseById(token, id) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.get(`${API_URL}${id}`, config);
    return response.data;
  }

  async updateExpense(token, id, expenseData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.put(`${API_URL}${id}`, expenseData, config);
    return response.data;
  }

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
