const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Get a quote from an anime")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Optional anime name")
        .setRequired(false)
    ),
  async execute(interaction) {
    const { MessageEmbed } = require("discord.js");
    const fetch = require("node-fetch");
    const SQLite = require("better-sqlite3");
    const sql = new SQLite("./src/databases/stats.sqlite");

    var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();
    stats.quote++;
    stats.total++;
    sql
      .prepare(
        "INSERT OR REPLACE INTO stats (total, anime, manga, character, help, about, invite, quote, stay, slashanime, slashmanga) VALUES (@total, @anime, @manga, @character, @help, @about, @invite, @quote, @stay, @slashanime, @slashmanga);"
      )
      .run(stats);

    let name = interaction.options.getString("name");

    let url = "https://animechan.vercel.app/api/random";
    if (name)
      url = `https://animechan.vercel.app/api/quotes/anime?title=${name}`;

    fetch(url)
      .then((res) => res.json())
      .then(async (results) => {
        let info = results;
        if (name) {
          info = results[Math.floor(Math.random() * results.length)];
          if (!info) throw "No Data";
        }

        const embed = new MessageEmbed()
          .setAuthor(
            `Quote from ${info?.anime}:`,
            `https://chr1s.dev/assets/animelist.png`,
            `https://animechanapi.xyz/`
          )
          .setColor("#55128E")
          .setDescription(`${info?.quote}\n **- ${info?.character}**`);
        await interaction.reply({ embeds: [embed] });
      })
      .catch(async (error) => {
        await interaction.reply({
          content: "**Error:** Couldn't find a quote from this anime!",
          ephemeral: true,
        });
      });
  },
};
