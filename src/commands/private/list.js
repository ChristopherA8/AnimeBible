module.exports = {
  name: "list",
  execute(msg) {
    if (msg.author.id !== "279032930926592000") return;

    const Discord = require("discord.js");

    let count = 1;

    const embed = new Discord.MessageEmbed()
      .setTitle("Biggest Guilds")
      .setColor("#55128E");

    msg.client.guilds.cache
      .sort((guildA, guildB) => guildB.memberCount - guildA.memberCount)
      .forEach((guild) => {
        if (count > 5) return;
        embed.addField(`${guild.name}`, `${guild.memberCount}`, false);

        count++;
      });

    msg.reply({ embeds: [embed] });
  },
};
