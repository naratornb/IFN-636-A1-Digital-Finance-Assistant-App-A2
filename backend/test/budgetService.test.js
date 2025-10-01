describe('getBudgetById', () => {
    it('should return a budget by id', async () => {
      
      const budgetId = 'budget123';
      const budget = { _id: budgetId };
      budgetRepositoryStub.findById.resolves(budget);
  
     
      const result = await budgetService.getBudgetById(budgetId);
  
   
      expect(budgetRepositoryStub.findById.calledWith(budgetId)).to.be.true;
      expect(result).to.equal(budget);
    });
  });