module.exports = {
  name: "total",
  execute(msg) {
    if (msg.author.id !== "279032930926592000") return;

    msg.reply(
      `Total members in all servers: ${msg.client.guilds.cache
        .map((g) => g.memberCount)
        .reduce((a, c) => a + c)}`
    );
  },
};
