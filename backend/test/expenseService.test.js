import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseService from '../services/expenseService.js';

describe('ExpenseService', () => {
  let expenseService;
  let expenseRepositoryStub;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create stubs for repository methods
    expenseRepositoryStub = {
      create: sandbox.stub(),
      findByUser: sandbox.stub(),
      findByUserAndDateRange: sandbox.stub(),
      findById: sandbox.stub(),
      update: sandbox.stub(),
      delete: sandbox.stub()
    };

    expenseService = new ExpenseService();
    expenseService.expenseRepository = expenseRepositoryStub;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createExpense', () => {
    it('should create a new expense successfully', async () => {
      // Setup
      const expenseData = {
        userId: 'user123',
        amount: 50,
        category: 'Food',
        description: 'Lunch',
        date: new Date()
      };

      const createdExpense = { _id: 'expense123', ...expenseData };
      expenseRepositoryStub.create.resolves(createdExpense);

      // Execute
      const result = await expenseService.createExpense(expenseData);

      // Verify
      expect(expenseRepositoryStub.create.calledWith(expenseData)).to.be.true;
      expect(result).to.equal(createdExpense);
    });

    it('should handle errors when creating an expense', async () => {
      // Setup
      const expenseData = { userId: 'user123', amount: 50 };
      const error = new Error('Creation failed');
      expenseRepositoryStub.create.rejects(error);

      // Execute & Verify
      try {
        await expenseService.createExpense(expenseData);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should create an expense with minimum required fields', async () => {
      // Setup
      const minimalExpenseData = {
        userId: 'user123',
        amount: 25,
        category: 'Other'
      };

      const createdExpense = {
        _id: 'expense123',
        ...minimalExpenseData,
        date: sinon.match.date
      };

      expenseRepositoryStub.create.resolves(createdExpense);

      // Execute
      const result = await expenseService.createExpense(minimalExpenseData);

      // Verify
      expect(expenseRepositoryStub.create.calledWith(minimalExpenseData)).to.be.true;
      expect(result).to.have.property('_id');
      expect(result).to.have.property('userId', 'user123');
      expect(result).to.have.property('amount', 25);
    });
  });

  describe('getExpensesByUser', () => {
    it('should return all expenses for a user', async () => {
      // Setup
      const userId = 'user123';
      const expectedExpenses = [
        { _id: 'expense1', userId, amount: 50 },
        { _id: 'expense2', userId, amount: 75 }
      ];
      expenseRepositoryStub.findByUser.resolves(expectedExpenses);

      // Execute
      const result = await expenseService.getExpensesByUser(userId);

      // Verify
      expect(expenseRepositoryStub.findByUser.calledWith(userId)).to.be.true;
      expect(result).to.equal(expectedExpenses);
    });

    it('should return empty array when no expenses exist', async () => {
      // Setup
      expenseRepositoryStub.findByUser.resolves([]);

      // Execute
      const result = await expenseService.getExpensesByUser('anyUser');

      // Verify
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle errors when fetching expenses', async () => {
      // Setup
      const error = new Error('Database error');
      expenseRepositoryStub.findByUser.rejects(error);

      // Execute & Verify
      try {
        await expenseService.getExpensesByUser('user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getExpensesByUserAndDateRange', () => {
    it('should return expenses within the date range', async () => {
      // Setup
      const userId = 'user123';
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const expectedExpenses = [
        { _id: 'expense1', userId, amount: 50, date: new Date('2023-01-15') }
      ];

      expenseRepositoryStub.findByUserAndDateRange.resolves(expectedExpenses);

      // Execute
      const result = await expenseService.getExpensesByUserAndDateRange(
        userId, startDate, endDate
      );

      // Verify
      expect(expenseRepositoryStub.findByUserAndDateRange.calledWith(
        userId, startDate, endDate
      )).to.be.true;
      expect(result).to.equal(expectedExpenses);
    });

    it('should return empty array when no expenses in date range', async () => {
      // Setup
      expenseRepositoryStub.findByUserAndDateRange.resolves([]);

      // Execute
      const result = await expenseService.getExpensesByUserAndDateRange(
        'user123',
        new Date('2023-01-01'),
        new Date('2023-01-31')
      );

      // Verify
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle errors when fetching by date range', async () => {
      // Setup
      const error = new Error('Database error');
      expenseRepositoryStub.findByUserAndDateRange.rejects(error);

      // Execute & Verify
      try {
        await expenseService.getExpensesByUserAndDateRange(
          'user123',
          new Date('2023-01-01'),
          new Date('2023-01-31')
        );
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getExpenseById', () => {
    it('should return an expense by id', async () => {
      // Setup
      const expenseId = 'expense123';
      const expense = { _id: expenseId, userId: 'user123', amount: 50 };
      expenseRepositoryStub.findById.resolves(expense);

      // Execute
      const result = await expenseService.getExpenseById(expenseId);

      // Verify
      expect(expenseRepositoryStub.findById.calledWith(expenseId)).to.be.true;
      expect(result).to.equal(expense);
    });

    it('should return null when expense is not found', async () => {
      // Setup
      expenseRepositoryStub.findById.resolves(null);

      // Execute
      const result = await expenseService.getExpenseById('nonexistent');

      // Verify
      expect(result).to.be.null;
    });

    it('should handle errors when fetching by id', async () => {
      // Setup
      const error = new Error('Database error');
      expenseRepositoryStub.findById.rejects(error);

      // Execute & Verify
      try {
        await expenseService.getExpenseById('expense123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('updateExpense', () => {
    it('should update an expense successfully', async () => {
      // Setup
      const expenseId = 'expense123';
      const updateData = { amount: 75, description: 'Updated lunch' };
      const updatedExpense = {
        _id: expenseId,
        userId: 'user123',
        amount: 75,
        description: 'Updated lunch',
        category: 'Food'
      };

      expenseRepositoryStub.update.resolves(updatedExpense);

      // Execute
      const result = await expenseService.updateExpense(expenseId, updateData);

      // Verify
      expect(expenseRepositoryStub.update.calledWith(expenseId, updateData)).to.be.true;
      expect(result).to.equal(updatedExpense);
    });

    it('should return null when expense to update is not found', async () => {
      // Setup
      expenseRepositoryStub.update.resolves(null);

      // Execute
      const result = await expenseService.updateExpense('nonexistent', { amount: 100 });

      // Verify
      expect(result).to.be.null;
    });

    it('should handle errors during update', async () => {
      // Setup
      const error = new Error('Update failed');
      expenseRepositoryStub.update.rejects(error);

      // Execute & Verify
      try {
        await expenseService.updateExpense('expense123', { amount: 100 });
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense successfully', async () => {
      // Setup
      const expenseId = 'expense123';
      const deletedExpense = { _id: expenseId, userId: 'user123', amount: 50 };
      expenseRepositoryStub.delete.resolves(deletedExpense);

      // Execute
      const result = await expenseService.deleteExpense(expenseId);

      // Verify
      expect(expenseRepositoryStub.delete.calledWith(expenseId)).to.be.true;
      expect(result).to.equal(deletedExpense);
    });

    it('should return null when expense to delete is not found', async () => {
      // Setup
      expenseRepositoryStub.delete.resolves(null);

      // Execute
      const result = await expenseService.deleteExpense('nonexistent');

      // Verify
      expect(result).to.be.null;
    });

    it('should handle errors during deletion', async () => {
      // Setup
      const error = new Error('Deletion failed');
      expenseRepositoryStub.delete.rejects(error);

      // Execute & Verify
      try {
        await expenseService.deleteExpense('expense123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});
