module.exports = {
  name: "quote",
  execute(msg, args) {
    const Discord = require("discord.js");
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

    let name = args.join(" ");
    let url = "https://animechan.vercel.app/api/random";
    if (name)
      url = `https://animechan.vercel.app/api/quotes/anime?title=${name}`;

    fetch(url)
      .then((res) => res.json())
      .then((results) => {
        let info = results;
        if (name) info = results[Math.floor(Math.random() * results.length)];
        let { quote, character, anime } = info;

        const embed = new Discord.MessageEmbed()
          .setAuthor(
            `Quote from ${anime}:`,
            `https://chr1s.dev/assets/animelist.png`,
            `https://animechanapi.xyz/`
          )
          .setColor("#55128E")
          .setDescription(`${quote}\n **- ${character}**`);
        msg.channel.send({ embeds: [embed] });
      })
      .catch(handleError);

    function handleError(error) {
      msg.channel.send(`\**Error:\** Invalid anime name!`);
      console.error(error);
    }
  },
};
