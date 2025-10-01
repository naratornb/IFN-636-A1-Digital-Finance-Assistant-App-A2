// tests/repositories/budgetRepository.test.js
import BudgetRepository from '../../repositories/budgetRepository.js';
import Budget from '../../models/Budget.js';

jest.mock('../../models/Budget.js'); // Mock the Mongoose model

describe('BudgetRepository', () => {
  let budgetRepo;

  beforeEach(() => {
    budgetRepo = new BudgetRepository();
    jest.clearAllMocks();
  });

  it('should create a new budget', async () => {
    const mockBudget = { name: 'Test Budget', amount: 1000 };
    Budget.create.mockResolvedValue(mockBudget);

    const result = await budgetRepo.create(mockBudget);
    expect(Budget.create).toHaveBeenCalledWith(mockBudget);
    expect(result).toEqual(mockBudget);
  });

  it('should find budgets by user', async () => {
    const mockBudgets = [{ name: 'Budget1' }, { name: 'Budget2' }];
    Budget.find.mockReturnValue({ sort: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockBudgets) });

    const result = await budgetRepo.findByUser('user123');
    expect(Budget.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(result).toEqual(mockBudgets);
  });

  it('should find by id', async () => {
    const mockBudget = { id: '1', name: 'Budget1' };
    Budget.findById.mockResolvedValue(mockBudget);

    const result = await budgetRepo.findById('1');
    expect(Budget.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockBudget);
  });
});
