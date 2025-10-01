// tests/controllers/expenseController.test.js
import ExpenseController from '../../controllers/expenseController.js';
import ExpenseService from '../../services/expenseService.js';

jest.mock('../../services/expenseService.js');

describe('ExpenseController', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 'user123' }, body: {}, params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should get expenses', async () => {
    const mockExpenses = [{ name: 'Expense1' }];
    ExpenseService.getExpensesByUser.mockResolvedValue(mockExpenses);

    await ExpenseController.getExpenses(req, res);

    expect(ExpenseService.getExpensesByUser).toHaveBeenCalledWith('user123');
    expect(res.json).toHaveBeenCalledWith(mockExpenses);
  });

  it('should add an expense', async () => {
    req.body = { name: 'New Expense', amount: 200, deadline: '2025-12-01' };
    const mockExpense = { ...req.body };
    ExpenseService.createExpense.mockResolvedValue(mockExpense);

    await ExpenseController.addExpense(req, res);

    expect(ExpenseService.createExpense).toHaveBeenCalledWith({ ...req.body, userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockExpense);
  });

  it('should update an expense', async () => {
    const mockExpense = { id: '1', name: 'Updated Expense' };
    ExpenseService.updateExpense.mockResolvedValue(mockExpense);

    await ExpenseController.updateExpense(req, res);

    expect(ExpenseService.updateExpense).toHaveBeenCalledWith('1', req.body);
    expect(res.json).toHaveBeenCalledWith(mockExpense);
  });

  it('should delete an expense', async () => {
    ExpenseService.deleteExpense.mockResolvedValue({ message: 'Expense deleted' });

    await ExpenseController.deleteExpense(req, res);

    expect(ExpenseService.deleteExpense).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Expense deleted' });
  });
});
