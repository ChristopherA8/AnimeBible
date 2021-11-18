const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Get the description of an anime")
    .addStringOption((option) =>
      option.setName("name").setDescription("Anime name").setRequired(true)
    ),
  async execute(interaction) {
    const { MessageEmbed } = require("discord.js");
    const sanitizeHtml = require("sanitize-html");
    const fetch = require("node-fetch");
    const SQLite = require("better-sqlite3");
    const sql = new SQLite("./src/databases/stats.sqlite");

    var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();
    stats.slashanime++;
    stats.total++;

    sql
      .prepare(
        "INSERT OR REPLACE INTO stats (total, anime, manga, character, help, about, invite, quote, stay, slashanime, slashmanga) VALUES (@total, @anime, @manga, @character, @help, @about, @invite, @quote, @stay, @slashanime, @slashmanga);"
      )
      .run(stats);

    let name = interaction.options.getString("name");

    let query = (name) => `
    {
        Media(search: "${name}", type: ANIME, isAdult: false) {
          coverImage {
            extraLarge
            large
            medium
            color
          }
          title {
            romaji
            english
            native
            userPreferred
          }
          description(asHtml: false)
          episodes
          averageScore
          genres
        }
      }
    `;

    let url = "https://graphql.anilist.co",
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query(name),
          variables: { search: name },
        }),
      };

    fetch(url, options)
      .then((res) => {
        return res.json().then(function (json) {
          return res.ok ? json : Promise.reject(json);
        });
      })
      .then((res) => {
        let dirty = res.data.Media.description.substring(0, 250);
        const desc = sanitizeHtml(dirty, {
          allowedTags: [],
          allowedAttributes: {},
        });

        const embed = new MessageEmbed()
          .setAuthor(
            `${res.data.Media.title.romaji} (${res.data.Media.title.native})`,
            `https://anilist.co/img/icons/favicon-32x32.png`,
            `https://anilist.co`
          )
          .setColor("#55128E")
          .setDescription(`${desc}...`)
          .setFooter(
            `${
              res.data.Media.episodes
                ? "Total Episodes: " + res.data.Media.episodes
                : ""
            }   ${
              res.data.Media.averageScore
                ? `|   Average Score: ${res.data.Media.averageScore}/100`
                : ""
            }`,
            `https://chr1s.dev/assets/animelist.png`
          )
          .setThumbnail(`${res.data.Media.coverImage.extraLarge}`);
        if (
          res.data.Media.genres.includes("Ecchi") &&
          interaction.channel.nsfw == false
        ) {
          interaction.reply({
            content: `**Ecchi anime only allowed in NSFW channel**`,
            ephemeral: true,
          });
        } else {
          interaction.reply({ embeds: [embed] });
        }
      })
      .catch((error) => {
        interaction.reply({
          content: "**Error:** Invalid anime name!",
          ephemeral: true,
        });
      });
  },
};
