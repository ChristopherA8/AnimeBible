module.exports = {
  async setup(client) {
    const chalk = require("chalk");
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    const { Collection } = require("discord.js");
    const fs = require("fs");

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    let applicationCommandData = [];

    // Add slash commands to Collection
    client.slashCommands = new Collection();

    try {
      const folders = fs.readdirSync("./src/interactions/slash");
      for (const folder of folders) {
        const files = fs
          .readdirSync(`./src/interactions/slash/${folder}`)
          .filter((file) => file.endsWith(".js"));
        for (const file of files) {
          const command = require(`../interactions/slash/${folder}/${file}`);
          client.slashCommands.set(command.data.name, command);
          applicationCommandData.push(command.data.toJSON());
        }
      }
    } catch (err) {
      console.error(err);
    }

    await rest
      .put(Routes.applicationCommands(client.user.id), {
        body: applicationCommandData,
      })
      .catch(console.error);

    console.log(
      chalk.bold.blue("[BOT]") + " Successfully registered application commands"
    );

    /////////////////////////////////////////////////////////////////////////////

    // Add select menus to collection
    client.selectMenus = new Collection();
    try {
      const files = fs
        .readdirSync(`./src/interactions/menus/`)
        .filter((file) => file.endsWith(".js"));
      for (const file of files) {
        const command = require(`../interactions/menus/${file}`);
        client.selectMenus.set(command.name, command);
      }
    } catch (err) {
      console.error(err);
    }

    // Add buttons to collection
    client.buttons = new Collection();
    try {
      const files = fs
        .readdirSync(`./src/interactions/buttons/`)
        .filter((file) => file.endsWith(".js"));
      for (const file of files) {
        const command = require(`../interactions/buttons/${file}`);
        client.buttons.set(command.name, command);
      }
    } catch (err) {
      console.error(err);
    }
  },
};
