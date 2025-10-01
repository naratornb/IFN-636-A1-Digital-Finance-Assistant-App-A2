import * as budgetRepository from '../repositories/budgetRepository.js';
import { createBudget, getBudgets, updateBudget, deleteBudget } from '../services/budgetService.js';


jest.mock('../repositories/budgetRepository.js');

describe('Budget Service', () => {


  describe('createBudget', () => {
    it('should create a budget successfully', async () => {
      const mockData = { userId: 1, name: 'Food', amount: 500 };
      const mockResult = { id: 1, ...mockData };

      budgetRepository.createBudget.mockResolvedValue(mockResult);

      const result = await createBudget(mockData);

      expect(result).toEqual(mockResult);
      expect(budgetRepository.createBudget).toHaveBeenCalledWith(mockData);
    });

    it('should fail if data is invalid', async () => {
      await expect(createBudget(null)).rejects.toThrow('Invalid budget data');
    });

    it('should handle repository error', async () => {
      const mockData = { userId: 1, name: 'Transport', amount: 200 };
      budgetRepository.createBudget.mockRejectedValue(new Error('DB Error'));

      await expect(createBudget(mockData)).rejects.toThrow('DB Error');
    });
  });



  describe('getBudgets', () => {
    it('should return list of budgets', async () => {
      const mockBudgets = [
        { id: 1, userId: 1, name: 'Food', amount: 500 },
        { id: 2, userId: 1, name: 'Rent', amount: 1000 },
      ];
      budgetRepository.getBudgets.mockResolvedValue(mockBudgets);

      const result = await getBudgets(1);

      expect(result).toEqual(mockBudgets);
      expect(budgetRepository.getBudgets).toHaveBeenCalledWith(1);
    });

    it('should return empty list if none found', async () => {
      budgetRepository.getBudgets.mockResolvedValue([]);

      const result = await getBudgets(2);

      expect(result).toEqual([]);
    });

    it('should handle repository error', async () => {
      budgetRepository.getBudgets.mockRejectedValue(new Error('Query failed'));

      await expect(getBudgets(1)).rejects.toThrow('Query failed');
    });
  });


 
  describe('updateBudget', () => {
    it('should update successfully', async () => {
      const mockData = { id: 1, amount: 600 };
      const mockUpdated = { id: 1, name: 'Food', amount: 600 };

      budgetRepository.updateBudget.mockResolvedValue(mockUpdated);

      const result = await updateBudget(mockData.id, mockData);

      expect(result).toEqual(mockUpdated);
      expect(budgetRepository.updateBudget).toHaveBeenCalledWith(mockData.id, mockData);
    });

    it('should fail for invalid id', async () => {
      await expect(updateBudget(null, {})).rejects.toThrow('Invalid budget id');
    });

    it('should handle repository error', async () => {
      const mockData = { id: 2, amount: 800 };
      budgetRepository.updateBudget.mockRejectedValue(new Error('DB error'));

      await expect(updateBudget(2, mockData)).rejects.toThrow('DB error');
    });
  });



  describe('deleteBudget', () => {
    it('should delete successfully', async () => {
      budgetRepository.deleteBudget.mockResolvedValue({ affectedRows: 1 });

      const result = await deleteBudget(1);

      expect(result).toEqual({ affectedRows: 1 });
      expect(budgetRepository.deleteBudget).toHaveBeenCalledWith(1);
    });

    it('should fail for invalid id', async () => {
      await expect(deleteBudget(null)).rejects.toThrow('Invalid budget id');
    });

    it('should handle repository error', async () => {
      budgetRepository.deleteBudget.mockRejectedValue(new Error('Delete failed'));

      await expect(deleteBudget(1)).rejects.toThrow('Delete failed');
    });
  });

});
