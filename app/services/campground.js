class CampgroundService {
  constructor(Campground) {
    this.Campground = Campground;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.search = this.search.bind(this);
    this.findAllMatches = this.findAllMatches.bind(this);
    this.findById = this.findById.bind(this);
    this.findByIdAndUpdate = this.findByIdAndUpdate.bind(this);
    this.paginate = this.paginate.bind(this);
    this.count = this.count.bind(this);
  }
  async create(newCampground) {
    return await this.Campground.create(newCampground);
  }
  async getAll() {
    return await this.Campground.find({});
  }
  async search(query) {
    return await this.Campground.find().or(query);
  }
  async findAllMatches(query, match) {
    return await this.Campground.find().where(query).equals(match);
  }
  async findById(id) {
    const result = await this.Campground.findById(id);
    return result;
  }
  async findByIdAndUpdate(id, newData) {
    return await this.Campground.findByIdAndUpdate(id, newData);
  }
  async paginate(start, limit) {
    return await this.Campground.find().limit(limit).skip(start);
  }
  async count() {
    return await this.Campground.estimatedDocumentCount();
  }
}
module.exports = CampgroundService;
