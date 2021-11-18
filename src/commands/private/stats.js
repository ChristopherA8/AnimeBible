module.exports = {
  name: "stats",
  execute(msg) {
    if (msg.author.id !== "279032930926592000") return;

    const SQLite = require("better-sqlite3");
    const sql = new SQLite("./src/databases/stats.sqlite");
    var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();

    const Discord = require("discord.js");
    const embed = new Discord.MessageEmbed()
      .setTitle("Stats:")
      .setDescription(
        `Total: ${stats.total}\nAnime: ${stats.anime}\nManga: ${stats.manga}\nCharacter: ${stats.character}\nQuote: ${stats.quote}\nAbout: ${stats.about}\nHelp: ${stats.help}\nInvite: ${stats.invite}\n/anime: ${stats.slashanime}\n/manga: ${stats.slashmanga}`
      );
    msg.channel.send({ embeds: [embed] });
  },
};
