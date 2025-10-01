import { expect } from 'chai';
import sinon from 'sinon';
import BudgetService from '../services/budgetService.js';

describe('BudgetService', () => {
  let budgetService;
  let budgetRepositoryStub;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

  
    budgetRepositoryStub = {
      create: sandbox.stub(),
      findByUser: sandbox.stub(),
      findById: sandbox.stub(),
      update: sandbox.stub(),
      delete: sandbox.stub()
    };

    budgetService = new BudgetService();
    budgetService.budgetRepository = budgetRepositoryStub;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createBudget', () => {
    it('should create a weekly budget', async () => {
  
      const userId = 'user123';
      const budgetData = {
        userId,
        period: 'weekly',
        totalBudget: 500,
        notes: 'Weekly budget'
      };

      const createdBudget = { _id: 'budget123', ...budgetData };
      budgetRepositoryStub.create.resolves(createdBudget);


      const result = await budgetService.createBudget(budgetData);

      expect(budgetRepositoryStub.create.calledOnce).to.be.true;
      expect(result).to.equal(createdBudget);
    });

    it('should create a monthly budget', async () => {
   
      const userId = 'user123';
      const startDate = new Date('2023-01-01');
      const budgetData = {
        userId,
        period: 'monthly',
        totalBudget: 2000,
        startDate
      };

      const createdBudget = { _id: 'budget123', ...budgetData };
      budgetRepositoryStub.create.resolves(createdBudget);

 
      const result = await budgetService.createBudget(budgetData);

    
      expect(budgetRepositoryStub.create.calledOnce).to.be.true;
      expect(result).to.equal(createdBudget);
    });

    it('should handle date calculations properly', async () => {
  
      const today = new Date();
      const clock = sandbox.useFakeTimers(today);

      const budgetData = {
        userId: 'user123',
        period: 'weekly',
        totalBudget: 500
      };

      budgetRepositoryStub.create.callsFake(data => {
        return Promise.resolve({ ...data, _id: 'budget123' });
      });

  
      const result = await budgetService.createBudget(budgetData);

   
      expect(result.startDate).to.not.be.undefined;
      expect(result.endDate).to.not.be.undefined;
      clock.restore();
    });
  });

  describe('getBudgetsByUser', () => {
    it('should return all budgets for a user', async () => {
  
      const userId = 'user123';
      const expectedBudgets = [
        { _id: 'budget1', userId, totalBudget: 500 },
        { _id: 'budget2', userId, totalBudget: 700 }
      ];
      budgetRepositoryStub.findByUser.resolves(expectedBudgets);

    
      const result = await budgetService.getBudgetsByUser(userId);

    
      expect(budgetRepositoryStub.findByUser.calledWith(userId)).to.be.true;
      expect(result).to.equal(expectedBudgets);
    });

    it('should return empty array when no budgets exist', async () => {
  
      budgetRepositoryStub.findByUser.resolves([]);


      const result = await budgetService.getBudgetsByUser('anyUser');

  
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle errors properly', async () => {
  
      const error = new Error('Database error');
      budgetRepositoryStub.findByUser.rejects(error);

   
      try {
        await budgetService.getBudgetsByUser('user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getBudgetById', () => {
    it('should return a budget by id and userId', async () => {

      const budgetId = 'budget123';
      const userId = 'user123';
      const budget = { _id: budgetId, userId };
      budgetRepositoryStub.findById.resolves(budget);

  
      const result = await budgetService.getBudgetById(budgetId, userId);


      expect(budgetRepositoryStub.findById.calledWith(budgetId, userId)).to.be.true;
      expect(result).to.equal(budget);
    });

    it('should return null when budget is not found', async () => {

      budgetRepositoryStub.findById.resolves(null);


      const result = await budgetService.getBudgetById('nonexistent', 'user123');


      expect(result).to.be.null;
    });
  });

  describe('updateBudget', () => {
    it('should update a budget successfully', async () => {

      const budgetId = 'budget123';
      const updateData = { totalBudget: 1000 };
      const updatedBudget = { _id: budgetId, ...updateData };
      budgetRepositoryStub.update.resolves(updatedBudget);


      const result = await budgetService.updateBudget(budgetId, updateData);


      expect(budgetRepositoryStub.update.calledWith(budgetId, updateData)).to.be.true;
      expect(result).to.equal(updatedBudget);
    });

    it('should return null when budget to update is not found', async () => {

      budgetRepositoryStub.update.resolves(null);


      const result = await budgetService.updateBudget('nonexistent', {});


      expect(result).to.be.null;
    });
  });

  describe('deleteBudget', () => {
    it('should delete a budget successfully', async () => {

      const budgetId = 'budget123';
      const deletedBudget = { _id: budgetId };
      budgetRepositoryStub.delete.resolves(deletedBudget);


      const result = await budgetService.deleteBudget(budgetId);


      expect(budgetRepositoryStub.delete.calledWith(budgetId)).to.be.true;
      expect(result).to.equal(deletedBudget);
    });

    it('should return null when budget to delete is not found', async () => {

      budgetRepositoryStub.delete.resolves(null);


      const result = await budgetService.deleteBudget('nonexistent');


      expect(result).to.be.null;
    });
  });
});
