module.exports = {
  name: "stat",
  async execute(msg) {
    if (msg.author.id !== "279032930926592000") return;

    const { Stats } = require("../../mongo/Mongo");

    let hi = await Stats.getStat("total");
    // let total = await Stats.addStat({ name: "total", count: "4" });
    console.log(hi);
  },
};
