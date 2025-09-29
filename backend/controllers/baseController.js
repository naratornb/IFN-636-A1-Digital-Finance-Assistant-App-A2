// Template Method Pattern: Defines the skeleton of an algorithm
// OOP Principle: Polymorphism - BaseController can be extended by specific controllers
// The BaseController defines a template method (handleRequest) that calls abstract methods (validateRequest and processRequest). The BudgetController provides specific implementations of these methods. This allows different controllers to be treated uniformly while providing specialized behavior.
class BaseController {
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
    // Default implementation (can be overridden by subclasses)
    return true;
  }

  // To be implemented by subclasses
  async processRequest(req) {
    throw new Error('Method not implemented');
  }

  // Response handling
  sendResponse(res, data) {
    res.json(data);
  }

  handleError(res, error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

  // Common methods for CRUD operations
  async create(req, res) {
    try {
      const data = await this.repository.create(req.body);
      return res.status(201).json({ success: true, data });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await this.repository.getAll();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await this.repository.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await this.repository.update(req.params.id, req.body);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const data = await this.repository.delete(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = BaseController;
