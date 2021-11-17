module.exports = {
  name: "image",
  execute(msg, args) {
    const { MessageEmbed } = require("discord.js");
    const fetch = require("node-fetch");

    // const SQLite = require("better-sqlite3");
    // const sql = new SQLite("./src/databases/stats.sqlite");
    // var stats = sql.prepare("SELECT * FROM stats WHERE stay = 1").get();
    // stats.quote++;
    // stats.total++;
    // sql
    //   .prepare(
    //     "INSERT OR REPLACE INTO stats (total, anime, manga, character, help, about, invite, quote, stay, slashanime, slashmanga) VALUES (@total, @anime, @manga, @character, @help, @about, @invite, @quote, @stay, @slashanime, @slashmanga);"
    //   )
    //   .run(stats);

    var expression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    let url;
    let attachment = msg.attachments.first();
    if (attachment == undefined) {
      if (!args[0]) return msg.reply({ content: "Missing image url" });
      url = args[0];
    } else {
      url = attachment.url;
    }

    if (!url.match(regex)) return msg.reply({ content: "Invalid image url" });
    console.log(url);

    let fetchUrl = `https://api.trace.moe/search?url=${encodeURIComponent(
      url.trim()
    )}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((results) => {
        let name;
        let result = results.result[0];
        let id = result.anilist;
        let query = (id) => `
        {
            Media(id: ${id}, type: ANIME, isAdult: false) {
              title {
                romaji
                english
                native
                userPreferred
              }
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
              query: query(id),
              variables: { search: id },
            }),
          };
        fetch(url, options)
          .then(handleResponse)
          .then(handleData)
          .catch(handleError);
        function handleResponse(response) {
          return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
          });
        }
        function handleData(anilistResults) {
          name = `${String(result.similarity.toFixed(2) * 100)}% match with ${
            anilistResults.data.Media.title.romaji
          }`;
          msg.reply({ content: `**${name}**\n${result.video}` });
        }
        function handleError(error) {
          name = `${String(result.similarity.toFixed(2) * 100)}% match with ${
            result.filename
          }`;
          msg.reply({ content: `**${name}**\n${result.video}` });
          console.error(error);
        }
      })
      .catch(handleError);

    function handleError(error) {
      msg.channel.send({ content: "**Error:** Invalid image" });
      console.error(error);
    }
  },
};
