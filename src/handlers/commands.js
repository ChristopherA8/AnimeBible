module.exports = {
  async commandHandler(msg, prefix) {
    if (msg.content.startsWith(prefix)) {
      const args = msg.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();
      if (!msg.client.commands.has(commandName)) return;
      const command = msg.client.commands.get(commandName);

      try {
        command.execute(msg, args);
      } catch (err) {
        console.log(err);
      }
    }
  },
};
