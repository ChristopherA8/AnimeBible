module.exports = {
  name: "top",
  execute(msg) {
    if (msg.author.id !== "279032930926592000") return;

    const Discord = require("discord.js");

    let count = 1;

    msg.client.guilds.cache
      .sort((guildA, guildB) => guildB.memberCount - guildA.memberCount)
      .forEach((guild) => {
        if (count > 10) return;
        const embed = new Discord.MessageEmbed()
          .setColor("#55128E")
          .setThumbnail(guild.iconURL())
          .addField(`${guild.name}`, `${guild.memberCount}`, true);
        msg.reply({ embeds: [embed] });
        count++;
      });
  },
};
