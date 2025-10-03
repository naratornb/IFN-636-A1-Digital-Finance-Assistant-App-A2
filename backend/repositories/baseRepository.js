class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const entity = new this.model(data);
    return entity.save();
  }

  async findById(id, userId) {
    if (userId) {
      return this.model.findOne({ _id: id, userId });
    }
    return this.model.findById(id);
  }

  async findAll() {
    return this.model.find();
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
