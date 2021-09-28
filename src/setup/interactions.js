module.exports = {
  setup(client) {
    const { Collection } = require("discord.js");
    const fs = require("fs");

    // Add slash commands to collection
    client.slashCommands = new Collection();
    try {
      const files = fs
        .readdirSync(`./src/interactions/slash/`)
        .filter((file) => file.endsWith(".js"));
      for (const file of files) {
        const command = require(`../interactions/slash/${file}`);
        client.slashCommands.set(command.name, command);
      }
    } catch (err) {
      console.error(err);
    }

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
