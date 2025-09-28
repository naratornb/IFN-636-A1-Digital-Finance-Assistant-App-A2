export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const entity = new this.model(data);
    return entity.save();
  }

  async findById(id, userId) {
    return this.model.findOne({ _id: id, userId }).exec();
  }

  async find(filter = {}) {
    return this.model.find(filter).exec();
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id) {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
