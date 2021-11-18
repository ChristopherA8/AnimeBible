const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Get the description of a character")
    .addStringOption((option) =>
      option.setName("name").setDescription("Character name").setRequired(true)
    ),
  async execute(interaction) {
    const { MessageEmbed } = require("discord.js");
    const SQLite = require("better-sqlite3");
    const sql = new SQLite("./src/databases/stats.sqlite");
    const fetch = require("node-fetch");

    var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();
    stats.character++;
    stats.total++;
    sql
      .prepare(
        "INSERT OR REPLACE INTO stats (total, anime, manga, character, help, about, invite, quote, stay, slashanime, slashmanga) VALUES (@total, @anime, @manga, @character, @help, @about, @invite, @quote, @stay, @slashanime, @slashmanga);"
      )
      .run(stats);

    let name = interaction.options.getString("name");
    let url = `https://api.jikan.moe/v3/search/character?q=${name}&page=1`;

    await interaction.deferReply({ ephemeral: false });

    fetch(url)
      .then((res) => res.json())
      .then(async (api) => {
        const { name, image_url, url, mal_id } = api.results[0];

        let names = [];
        for (let index = 0; index < api.results[0].anime.length; index++) {
          if (api.results[0].anime.length <= 10) {
            const element = api.results[0].anime[index];
            names.push(`[${element.name}](${element.url})`);
          } else {
            const element = api.results[0].anime[index];
            if (names.length <= 9) {
              names.push(`[${element.name}](${element.url})`);
            } else if ((names.length = 10)) {
              names.push(`[${element.name}](${element.url})\n**...**`);
            }
          }
        }

        const embed = new MessageEmbed()
          .setAuthor(`${name}`, `${image_url}`, `${url}`)
          .setColor("#55128E")
          .setDescription(`Found in:\n${names.join("\n")}`)
          .setFooter(
            `MyAnimeList id: ${mal_id}`,
            `https://chr1s.dev/assets/animelist.png`
          )
          .setThumbnail(`${image_url}`);
        await interaction.editReply({ embeds: [embed] });
      })
      .catch(async (error) => {
        // Cannot edit a non-ephemeral to an ephemeral since we defer this reply
        await interaction.editReply({
          content: "**Error:** Invalid character name!",
        });
      });
  },
};
