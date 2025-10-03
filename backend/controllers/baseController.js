class BaseController {
  constructor(repository) {
    this.repository = repository;
  }

  handleRequest = async (req, res) => {
    try {
      await this.validateRequest(req);
      const result = await this.processRequest(req);
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  async validateRequest(req) {
    return true;
  }

  async processRequest(req) {
    throw new Error('Method not implemented');
  }

  sendResponse(res, data) {
    res.json(data);
  }

  handleError(res, error) {
    console.warn(error);

    if (error.name === 'ValidationError') {
      const validationErrors = {};

      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return res.status(400).json({
        success: false,
        message: error._message || 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred'
    });
  }

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
