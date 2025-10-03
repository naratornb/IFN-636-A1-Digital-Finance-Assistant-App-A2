import axiosInstance from "../axiosConfig";

const API_URL = '/api/budgets/';

class BudgetService {
  constructor() {
    this.api = axiosInstance;
  }

  async createBudget(token, budgetData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.post(API_URL, budgetData, config);
    return response.data;
  }

  async getBudgets(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.get(API_URL, config);

    return response.data.data ? { data: response.data.data } : response.data;
  }

  async getBudgetById(token, id) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.get(`${API_URL}${id}`, config);
    return response.data.data ? response.data.data : response.data;
  }

  async updateBudget(token, id, budgetData) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await this.api.put(`${API_URL}${id}`, budgetData, config);
    return response.data;
  }

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
