// tests/repositories/expenseRepository.test.js
import ExpenseRepository from '../../repositories/expenseRepository.js';
import Expense from '../../models/Expense.js';

jest.mock('../../models/Expense.js'); // Mock the Mongoose model

describe('ExpenseRepository', () => {
  let expenseRepo;

  beforeEach(() => {
    expenseRepo = new ExpenseRepository();
    jest.clearAllMocks();
  });

  it('should create a new expense', async () => {
    const mockExpense = { name: 'Test Expense', amount: 100 };
    Expense.create.mockResolvedValue(mockExpense);

    const result = await expenseRepo.create(mockExpense);
    expect(Expense.create).toHaveBeenCalledWith(mockExpense);
    expect(result).toEqual(mockExpense);
  });

  it('should find expenses by user', async () => {
    const mockExpenses = [{ name: 'Expense1' }, { name: 'Expense2' }];
    Expense.find.mockReturnValue({ sort: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockExpenses) });

    const result = await expenseRepo.findByUser('user123');
    expect(Expense.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toEqual(mockExpenses);
  });

  it('should find by id', async () => {
    const mockExpense = { id: '1', name: 'Expense1' };
    Expense.findById.mockResolvedValue(mockExpense);

    const result = await expenseRepo.findById('1');
    expect(Expense.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockExpense);
  });
});
