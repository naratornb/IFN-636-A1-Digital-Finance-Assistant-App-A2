// src/services/BudgetService.js
import axiosInstance from "../axiosConfig";

const API_URL = '/api/budgets/';

class BudgetService {
  constructor() {
    this.api = axiosInstance;
  }

  // Factory Method Pattern: This method creates a new budget resource via API
  async createBudget(token, budgetData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.post(API_URL, budgetData, config);
    return response.data;
  }

  // Retrieves all budgets using the same authorization pattern
  async getBudgets(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.get(API_URL, config);

    // Check if response data has the expected structure with a data property
    // If it does, return the nested data, otherwise return the entire response.data
    return response.data.data ? { data: response.data.data } : response.data;
  }

  // Retrieves a budget by ID using the same authorization pattern
  async getBudgetById(token, id) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.get(`${API_URL}${id}`, config);
    return response.data.data ? response.data.data : response.data;
  }

  // Updates a budget by ID using the same authorization pattern
  async updateBudget(token, id, budgetData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.put(`${API_URL}${id}`, budgetData, config);
    return response.data;
  }

  // Deletes a budget by ID using the same authorization pattern
  async deleteBudget(token, id) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.delete(`${API_URL}${id}`, config);
    return response.data;
  }
}

export default new BudgetService();
