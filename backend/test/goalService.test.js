import { expect } from 'chai';
import sinon from 'sinon';
import GoalService from '../services/goalService.js';

describe('GoalService', () => {
  let goalService;
  let goalRepositoryStub;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

   
    goalRepositoryStub = {
      create: sandbox.stub(),
      findByUser: sandbox.stub(),
      findById: sandbox.stub(),
      update: sandbox.stub(),
      delete: sandbox.stub()
    };

    goalService = GoalService;
    goalService.goalRepository = goalRepositoryStub;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createGoal', () => {
    it('should create a new goal successfully', async () => {
     
      const goalData = {
        userId: 'user123',
        name: 'Save for vacation',
        target: 5000,
        current: 1000,
        deadline: new Date('2026-12-31')
      };

      const createdGoal = { _id: 'goal123', ...goalData };
      goalRepositoryStub.create.resolves(createdGoal);


      const result = await goalService.createGoal(goalData);


      expect(goalRepositoryStub.create.calledWith(goalData)).to.be.true;
      expect(result).to.equal(createdGoal);
    });

    it('should handle errors when creating a goal', async () => {
     
      const goalData = { userId: 'user123', name: 'Invalid Goal' };
      const error = new Error('Creation failed');
      goalRepositoryStub.create.rejects(error);

    
      try {
        await goalService.createGoal(goalData);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should create a goal with all required fields', async () => {
     
      const goalData = {
        userId: 'user123',
        name: 'Emergency Fund',
        target: 10000,
        current: 0,
        deadline: new Date('2026-06-30')
      };

      const createdGoal = { _id: 'goal456', ...goalData };
      goalRepositoryStub.create.resolves(createdGoal);


      const result = await goalService.createGoal(goalData);


      expect(goalRepositoryStub.create.calledWith(goalData)).to.be.true;
      expect(result).to.have.property('_id', 'goal456');
      expect(result).to.have.property('name', 'Emergency Fund');
      expect(result).to.have.property('target', 10000);
    });
  });

  describe('getGoalsByUser', () => {
    it('should return all goals for a user', async () => {
     
      const userId = 'user123';
      const expectedGoals = [
        { _id: 'goal1', userId, name: 'Vacation', target: 5000 },
        { _id: 'goal2', userId, name: 'New Car', target: 15000 }
      ];
      goalRepositoryStub.findByUser.resolves(expectedGoals);


      const result = await goalService.getGoalsByUser(userId);


      expect(goalRepositoryStub.findByUser.calledWith(userId)).to.be.true;
      expect(result).to.equal(expectedGoals);
    });

    it('should return empty array when no goals exist', async () => {
     
      goalRepositoryStub.findByUser.resolves([]);


      const result = await goalService.getGoalsByUser('anyUser');


      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle errors when fetching goals', async () => {
     
      const error = new Error('Database error');
      goalRepositoryStub.findByUser.rejects(error);

    
      try {
        await goalService.getGoalsByUser('user123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('getGoalById', () => {
    it('should return a goal by id', async () => {
     
      const goalId = 'goal123';
      const goal = { _id: goalId, userId: 'user123', name: 'Vacation', target: 5000 };
      goalRepositoryStub.findById.resolves(goal);


      const result = await goalService.getGoalById(goalId);


      expect(goalRepositoryStub.findById.calledWith(goalId)).to.be.true;
      expect(result).to.equal(goal);
    });

    it('should return null when goal is not found', async () => {
     
      goalRepositoryStub.findById.resolves(null);


      const result = await goalService.getGoalById('nonexistent');


      expect(result).to.be.null;
    });

    it('should handle errors when fetching by id', async () => {
     
      const error = new Error('Database error');
      goalRepositoryStub.findById.rejects(error);

    
      try {
        await goalService.getGoalById('goal123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('updateGoal', () => {
    it('should update a goal successfully', async () => {
     
      const goalId = 'goal123';
      const updateData = { current: 2000, name: 'Updated Vacation Goal' };
      const updatedGoal = {
        _id: goalId,
        userId: 'user123',
        name: 'Updated Vacation Goal',
        target: 5000,
        current: 2000
      };

      goalRepositoryStub.update.resolves(updatedGoal);


      const result = await goalService.updateGoal(goalId, updateData);


      expect(goalRepositoryStub.update.calledWith(goalId, updateData)).to.be.true;
      expect(result).to.equal(updatedGoal);
    });

    it('should return null when goal to update is not found', async () => {
     
      goalRepositoryStub.update.resolves(null);


      const result = await goalService.updateGoal('nonexistent', { current: 1000 });


      expect(result).to.be.null;
    });

    it('should handle errors during update', async () => {
     
      const error = new Error('Update failed');
      goalRepositoryStub.update.rejects(error);

    
      try {
        await goalService.updateGoal('goal123', { current: 1000 });
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal successfully', async () => {
     
      const goalId = 'goal123';
      const deletedGoal = {
        _id: goalId,
        userId: 'user123',
        name: 'Vacation',
        target: 5000
      };
      goalRepositoryStub.delete.resolves(deletedGoal);


      const result = await goalService.deleteGoal(goalId);


      expect(goalRepositoryStub.delete.calledWith(goalId)).to.be.true;
      expect(result).to.equal(deletedGoal);
    });

    it('should return null when goal to delete is not found', async () => {
     
      goalRepositoryStub.delete.resolves(null);


      const result = await goalService.deleteGoal('nonexistent');


      expect(result).to.be.null;
    });

    it('should handle errors during deletion', async () => {
     
      const error = new Error('Deletion failed');
      goalRepositoryStub.delete.rejects(error);

    
      try {
        await goalService.deleteGoal('goal123');
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});
