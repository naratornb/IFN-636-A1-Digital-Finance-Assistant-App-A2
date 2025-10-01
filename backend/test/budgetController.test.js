// tests/controllers/budgetController.test.js
import BudgetController from '../../controllers/budgetController.js';
import BudgetService from '../../services/budgetService.js';

jest.mock('../../services/budgetService.js');

describe('BudgetController', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 'user123' }, body: {}, params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should get budgets', async () => {
    const mockBudgets = [{ name: 'Budget1' }];
    BudgetService.getBudgetsByUser.mockResolvedValue(mockBudgets);

    await BudgetController.getBudgets(req, res);

    expect(BudgetService.getBudgetsByUser).toHaveBeenCalledWith('user123');
    expect(res.json).toHaveBeenCalledWith(mockBudgets);
  });

  it('should add a budget', async () => {
    req.body = { name: 'New Budget', amount: 500 };
    const mockBudget = { name: 'New Budget', amount: 500 };
    BudgetService.createBudget.mockResolvedValue(mockBudget);

    await BudgetController.addBudget(req, res);

    expect(BudgetService.createBudget).toHaveBeenCalledWith({ ...req.body, userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockBudget);
  });

  it('should update a budget', async () => {
    const mockBudget = { id: '1', name: 'Updated Budget' };
    BudgetService.updateBudget.mockResolvedValue(mockBudget);

    await BudgetController.updateBudget(req, res);

    expect(BudgetService.updateBudget).toHaveBeenCalledWith('1', req.body);
    expect(res.json).toHaveBeenCalledWith(mockBudget);
  });

  it('should delete a budget', async () => {
    BudgetService.deleteBudget.mockResolvedValue({ message: 'Budget deleted' });

    await BudgetController.deleteBudget(req, res);

    expect(BudgetService.deleteBudget).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Budget deleted' });
  });
});
