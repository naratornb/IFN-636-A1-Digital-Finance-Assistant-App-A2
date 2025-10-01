
import GoalService from '../services/goalService.js';
import GoalRepository from '../repositories/goalRepository.js';

// Mock the repository
jest.mock('../repositories/goalRepository.js');

describe('Goal Service', () => {
  const mockGoal = { _id: '1', userId: 'u1', name: 'Test Goal', amount: 1000, deadline: new Date(Date.now() + 86400000) };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // createGoal
  describe('createGoal', () => {
    it('should create a goal successfully', async () => {
      GoalRepository.prototype.create.mockResolvedValue(mockGoal);
      const result = await GoalService.createGoal(mockGoal);
      expect(result).toEqual(mockGoal);
    });

    it('should fail if data is invalid', async () => {
      GoalRepository.prototype.create.mockRejectedValue(new Error('Invalid data'));
      await expect(GoalService.createGoal({})).rejects.toThrow('Invalid data');
    });

    it('should handle repository error', async () => {
      GoalRepository.prototype.create.mockRejectedValue(new Error('Repo error'));
      await expect(GoalService.createGoal(mockGoal)).rejects.toThrow('Repo error');
    });
  });

  // getGoalsByUser
  describe('getGoalsByUser', () => {
    it('should return list of goals', async () => {
      GoalRepository.prototype.find.mockResolvedValue([mockGoal]);
      const result = await GoalService.getGoalsByUser('u1');
      expect(result).toEqual([mockGoal]);
    });

    it('should return empty list if none found', async () => {
      GoalRepository.prototype.find.mockResolvedValue([]);
      const result = await GoalService.getGoalsByUser('u2');
      expect(result).toEqual([]);
    });

    it('should handle repository error', async () => {
      GoalRepository.prototype.find.mockRejectedValue(new Error('Repo error'));
      await expect(GoalService.getGoalsByUser('u1')).rejects.toThrow('Repo error');
    });
  });

  // updateGoal
  describe('updateGoal', () => {
    it('should update successfully', async () => {
      GoalRepository.prototype.update.mockResolvedValue(mockGoal);
      const result = await GoalService.updateGoal('1', { name: 'Updated Goal' });
      expect(result).toEqual(mockGoal);
    });

    it('should fail for invalid id', async () => {
      GoalRepository.prototype.update.mockRejectedValue(new Error('Goal not found'));
      await expect(GoalService.updateGoal('invalid', {})).rejects.toThrow('Goal not found');
    });

    it('should handle repository error', async () => {
      GoalRepository.prototype.update.mockRejectedValue(new Error('Repo error'));
      await expect(GoalService.updateGoal('1', {})).rejects.toThrow('Repo error');
    });
  });

  // deleteGoal
  describe('deleteGoal', () => {
    it('should delete successfully', async () => {
      GoalRepository.prototype.delete.mockResolvedValue({ message: 'Goal deleted' });
      const result = await GoalService.deleteGoal('1');
      expect(result).toEqual({ message: 'Goal deleted' });
    });

    it('should fail for invalid id', async () => {
      GoalRepository.prototype.delete.mockRejectedValue(new Error('Goal not found'));
      await expect(GoalService.deleteGoal('invalid')).rejects.toThrow('Goal not found');
    });

    it('should handle repository error', async () => {
      GoalRepository.prototype.delete.mockRejectedValue(new Error('Repo error'));
      await expect(GoalService.deleteGoal('1')).rejects.toThrow('Repo error');
    });
  });
});
