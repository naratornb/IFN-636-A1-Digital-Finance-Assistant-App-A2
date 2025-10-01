// tests/services/expenseService.test.js
import ExpenseService from '../../services/expenseService.js';
import ExpenseRepository from '../../repositories/expenseRepository.js';

jest.mock('../../repositories/expenseRepository.js');

describe('ExpenseService', () => {
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    ExpenseRepository.mockImplementation(() => mockRepo);
    jest.clearAllMocks();
  });

  it('should get expenses by user', async () => {
    const mockExpenses = [{ name: 'Expense1' }];
    mockRepo.find.mockResolvedValue(mockExpenses);

    const result = await ExpenseService.getExpensesByUser('user123');
    expect(mockRepo.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toEqual(mockExpenses);
  });

  it('should create an expense', async () => {
    const data = { name: 'New Expense', amount: 100 };
    mockRepo.create.mockResolvedValue(data);

    const result = await ExpenseService.createExpense(data);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  it('should get expense by id', async () => {
    const mockExpense = { id: '1', name: 'Expense1' };
    mockRepo.findById.mockResolvedValue(mockExpense);

    const result = await ExpenseService.getExpenseById('1');
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockExpense);
  });

  it('should update an expense', async () => {
    const data = { name: 'Updated Expense' };
    const mockExpense = { id: '1', ...data };
    mockRepo.update.mockResolvedValue(mockExpense);

    const result = await ExpenseService.updateExpense('1', data);
    expect(mockRepo.update).toHaveBeenCalledWith('1', data);
    expect(result).toEqual(mockExpense);
  });

  it('should delete an expense', async () => {
    const mockResponse = { message: 'Expense deleted' };
    mockRepo.delete.mockResolvedValue(mockResponse);

    const result = await ExpenseService.deleteExpense('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockResponse);
  });
});
