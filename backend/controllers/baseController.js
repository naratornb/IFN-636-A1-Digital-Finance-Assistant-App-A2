// Template Method Pattern: Defines the skeleton of an algorithm
// OOP Principle: Polymorphism - BaseController can be extended by specific controllers
// The BaseController defines a template method (handleRequest) that calls abstract methods (validateRequest and processRequest). The BudgetController provides specific implementations of these methods. This allows different controllers to be treated uniformly while providing specialized behavior.
export default class BaseController {
  constructor(repository) {
    this.repository = repository;
  }

  // Template method that defines the algorithm structure
  handleRequest = async (req, res) => {
    try {
      await this.validateRequest(req);
      const result = await this.processRequest(req);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Steps to be implemented by subclasses
  async validateRequest(req) {
    throw new Error('validateRequest must be implemented by subclass');
  }

  async processRequest(req) {
    throw new Error('processRequest must be implemented by subclass');
  }

  // Common methods
  sendResponse(res, data) {
    res.status(200).json({ success: true, data });
  }

  handleError(res, error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}