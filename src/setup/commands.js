module.exports = {
  setup(client) {
    const { Collection } = require("discord.js");
    const fs = require("fs");

    // Add commands to Collection
    client.commands = new Collection();

    try {
      const folders = fs.readdirSync("./src/commands");
      for (const folder of folders) {
        const files = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));
        for (const file of files) {
          const command = require(`../commands/${folder}/${file}`);
          client.commands.set(command.name, command);
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
