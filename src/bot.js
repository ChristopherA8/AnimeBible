/* =-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
/*                                                          */
/*                 Welcome to Anime Bible!                  */
/*             Written entirely in javascript               */
/*     Searches for Anime, Manga, Characters and more!      */
/*            Using the AniList.co GraphQL API              */
/*                                                          */
/*                     BOT WEBSITE:                         */
/*                https://chr1s.dev/anime                   */
/*                                                          */
/* =-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

const { token, prefix, tokens } = require("../config.json");
const { Client, Intents } = require("discord.js");
const DBL = require("dblapi.js");
const chalk = require("chalk");
const fs = require("fs");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const dbl = new DBL(tokens.topgg, client);

client.on("ready", () => {
  console.log(
    chalk.bold.blue("[BOT]") + " Logged in as " + chalk.green(client.user.tag)
  );
  client.user.setActivity(`//help in ${client.guilds.cache.size} servers`, {
    type: "PLAYING",
  });

  //top.gg
  setInterval(() => {
    dbl.postStats(client.guilds.cache.size);
  }, 1800000);

  // Run setup
  const files = fs
    .readdirSync(`./src/setup`)
    .filter((file) => file.endsWith(".js"));
  for (const file of files) {
    const { setup } = require(`../src/setup/${file}`);
    setup(client);
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  const { commandHandler } = require("./handlers/commands.js");
  commandHandler(msg, process.env.PREFIX);
});

client.on("interactionCreate", async (interaction) => {
  const { interactionHandler } = require("./handlers/interactions.js");
  interactionHandler(interaction, client);
});

// Top.gg API events
dbl.on("posted", () => {
  console.log(chalk.bold.yellow("[DBL]") + " Server count posted!");
});

dbl.on("error", (e) => {
  console.log(`Oops! ${e}`);
});

client.login(process.env.TOKEN);
