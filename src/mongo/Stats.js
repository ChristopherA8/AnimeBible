class Stats {
  constructor(db) {
    this.collection = db.collection("stats");
  }
  async addStat(stat) {
    /* Structure of person object
    {
      name: 'anime',
      count: 1000,
    }
    */
    const newStat = await this.collection.insertOne(stat);
    return newStat;
  }
  async updateStat(stat) {
    const updatedStat = await this.collection.updateOne(
      { name: stat.name },
      {
        $set: {
          count: stat.count,
        },
      }
    );
    return updatedStat;
  }
  async getStat(name) {
    let query = { name: name };
    const aStat = await this.collection.findOne(query);
    return aStat;
  }
  async getStats() {
    const stats = await this.collection.find().toArray();
    return stats;
  }
  async incrementStat(name) {
    const oldStat = await this.getStat(name);
    // if (!oldStat) return false;
    const updatedStat = await this.collection.updateOne(
      { name: name },
      {
        $set: {
          count: oldStat.count + 1,
        },
      }
    );
    return updatedStat;
  }
}
module.exports = Stats;
