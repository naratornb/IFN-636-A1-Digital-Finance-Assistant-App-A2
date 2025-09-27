// Template Method Pattern: Defines the skeleton of an algorithm
// OOP Principle: Polymorphism - BaseController can be extended by specific controllers
// The BaseController defines a template method (handleRequest) that calls abstract methods (validateRequest and processRequest). The BudgetController provides specific implementations of these methods. This allows different controllers to be treated uniformly while providing specialized behavior.
/*
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

*/

export class BaseController {
  constructor() {
    // Bind methods to maintain context
    this.handleRequest = this.handleRequest.bind(this);
  }

  // Template Method Pattern
  async handleRequest(req, res) {
    try {
      await this.validateRequest(req);
      const result = await this.processRequest(req);
      this.sendSuccessResponse(res, result, req.method);
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Abstract methods - to be overridden
  async validateRequest(req) {
    throw new Error('validateRequest must be implemented');
  }

  async processRequest(req) {
    throw new Error('processRequest must be implemented');
  }

  // Response helpers
  sendSuccessResponse(res, data, method = 'GET') {
    const statusCode = method === 'POST' ? 201 : 200;
    res.status(statusCode).json({
      success: true,
      data,
      count: Array.isArray(data) ? data.length : undefined,
      timestamp: new Date().toISOString()
    });
  }

  sendErrorResponse(res, error) {
    const statusCode = this.getErrorStatusCode(error);
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  getErrorStatusCode(error) {
    if (error.name === 'ValidationError') return 400;
    if (error.name === 'CastError') return 400;
    if (error.code === 11000) return 409; // Duplicate key
    return error.statusCode || 500;
  }

  // Utility methods
  isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  extractUserId(req) {
    if (!req.user || !req.user.id) {
      const error = new Error('User authentication required');
      error.statusCode = 401;
      throw error;
    }
    return req.user.id;
  }
}