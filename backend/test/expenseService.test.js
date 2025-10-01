import ExpenseService from '../services/expenseService.js';
import ExpenseRepository from '../repositories/expenseRepository.js';

jest.mock('../repositories/expenseRepository.js');

describe('Expense Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createExpense', () => {
    it('should create an expense successfully', async () => {
      const data = { userId: 'u1', name: 'Food', amount: 20 };
      ExpenseRepository.prototype.create.mockResolvedValue(data);
      const result = await ExpenseService.createExpense(data);
      expect(result).toEqual(data);
    });

    it('should fail if required data is missing', async () => {
      await expect(ExpenseService.createExpense(null)).rejects.toThrow();
    });

    it('should handle repository errors', async () => {
      ExpenseRepository.prototype.create.mockRejectedValue(new Error('DB fail'));
      await expect(ExpenseService.createExpense({})).rejects.toThrow('DB fail');
    });
  });

  describe('getExpensesByUser', () => {
    it('should return all expenses for a user', async () => {
      const mockData = [{ name: 'Rent', amount: 500 }];
      ExpenseRepository.prototype.find.mockResolvedValue(mockData);
      const result = await ExpenseService.getExpensesByUser('u1');
      expect(result).toEqual(mockData);
    });

    it('should return empty list if no expenses', async () => {
      ExpenseRepository.prototype.find.mockResolvedValue([]);
      const result = await ExpenseService.getExpensesByUser('u2');
      expect(result).toEqual([]);
    });

    it('should handle repository error', async () => {
      ExpenseRepository.prototype.find.mockRejectedValue(new Error('DB error'));
      await expect(ExpenseService.getExpensesByUser('u3')).rejects.toThrow('DB error');
    });
  });

  describe('getExpenseById', () => {
    it('should return expense by ID', async () => {
      const exp = { id: 1, name: 'Transport' };
      ExpenseRepository.prototype.findById.mockResolvedValue(exp);
      const result = await ExpenseService.getExpenseById(1);
      expect(result).toEqual(exp);
    });

    it('should return null if not found', async () => {
      ExpenseRepository.prototype.findById.mockResolvedValue(null);
      const result = await ExpenseService.getExpenseById('invalid');
      expect(result).toBeNull();
    });

    it('should handle repository error', async () => {
      ExpenseRepository.prototype.findById.mockRejectedValue(new Error('Fail'));
      await expect(ExpenseService.getExpenseById('x')).rejects.toThrow('Fail');
    });
  });

  describe('updateExpense', () => {
    it('should update an expense successfully', async () => {
      const updated = { id: 1, name: 'Food', amount: 25 };
      ExpenseRepository.prototype.update.mockResolvedValue(updated);
      const result = await ExpenseService.updateExpense(1, updated);
      expect(result).toEqual(updated);
    });

    it('should fail if invalid id', async () => {
      await expect(ExpenseService.updateExpense(null, {})).rejects.toThrow();
    });

    it('should handle repository error', async () => {
      ExpenseRepository.prototype.update.mockRejectedValue(new Error('Update fail'));
      await expect(ExpenseService.updateExpense(1, {})).rejects.toThrow('Update fail');
    });
  });

  describe('deleteExpense', () => {
    it('should delete successfully', async () => {
      const deleted = { id: 1 };
      ExpenseRepository.prototype.delete.mockResolvedValue(deleted);
      const result = await ExpenseService.deleteExpense(1);
      expect(result).toEqual(deleted);
    });

    it('should fail for invalid id', async () => {
      await expect(ExpenseService.deleteExpense(null)).rejects.toThrow();
    });

    it('should handle repository error', async () => {
      ExpenseRepository.prototype.delete.mockRejectedValue(new Error('Delete fail'));
      await expect(ExpenseService.deleteExpense('x')).rejects.toThrow('Delete fail');
    });
  });
});
