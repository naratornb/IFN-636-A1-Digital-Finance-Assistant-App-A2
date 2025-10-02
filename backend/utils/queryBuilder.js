
class QueryBuilder {
  constructor() {
    this.query = {};
  }

  select(fields) {
    this.query.fields = fields.join(' ');
    return this;
  }

  where(condition) {
    this.query.filter = { ...this.query.filter, ...condition };
    return this;
  }

  limit(count) {
    this.query.limit = count;
    return this;
  }

  sort(field, order = 'asc') {
    this.query.sort = { [field]: order === 'asc' ? 1 : -1 };
    return this;
  }

  build() {
    return { ...this.query };
  }
}

module.exports = QueryBuilder;
