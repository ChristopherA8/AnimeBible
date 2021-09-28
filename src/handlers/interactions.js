module.exports = {
  interactionHandler(interaction, client) {
    if (interaction.isCommand()) {
      const commandName = interaction.commandName;
      if (!client.slashCommands.has(commandName)) return;
      const command = client.slashCommands.get(commandName);

      try {
        command.execute(interaction);
      } catch (err) {
        console.log(`Error executing slash command`);
      }
    }

    if (interaction.isSelectMenu()) {
      const menuId = interaction.customId;
      if (!client.selectMenus.has(menuId)) return;
      const command = client.selectMenus.get(menuId);

      try {
        command.execute(interaction);
      } catch (err) {
        console.log(`Error executing select menu`);
      }
    }

    if (interaction.isButton()) {
      const buttonId = interaction.customId;
      if (!client.buttons.has(buttonId)) return;
      const command = client.buttons.get(buttonId);

      try {
        command.execute(interaction);
      } catch (err) {
        console.log(`Error executing button`);
      }
    }
  },
};
