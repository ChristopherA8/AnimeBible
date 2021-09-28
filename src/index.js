const { ShardingManager } = require("discord.js");
const { token } = require("../config.json");

const manager = new ShardingManager("src/bot.js", {
  token: token,
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));
manager.spawn();
