const { MongoClient } = require("mongodb");
const chalk = require("chalk");
const Stats = require("./Stats");

class Mongo {
  constructor() {
    const url = "mongodb://localhost:27017/";

    this.client = new MongoClient(url);
  }
  async init() {
    await this.client.connect();
    console.log(
      chalk.blue.bold("[BOT]") +
        " Connected to MongoDB " +
        chalk.green("animebible")
    );

    this.db = this.client.db("animebible");
    this.Stats = new Stats(this.db);
  }
}

module.exports = new Mongo();
