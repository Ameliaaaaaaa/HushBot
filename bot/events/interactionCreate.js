const { sendCommand } = require('../../utils/commands');
const { Collection } = require('discord.js');

const cooldowns = new Collection();
const controlCooldown = new Collection();

module.exports = {
    event: 'interactionCreate',

    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmdName = interaction.commandName;

            if (!client.commands.has(cmdName)) return;

            const command = client.commands.get(cmdName);

            if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;

                    return await interaction.reply({ content: `This interaction is on cooldown for another ${timeLeft} seconds.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(client, interaction);
            } catch (e) {
                await interaction.reply({ content: 'An error occurred running that interaction.', ephemeral: false });
                console.log(e);
            }
        }

        if (interaction.customId === 'control') {
            const option = client.cfg.Options[interaction.values[0]];
            const cooldownAmount = 5 * 1000;

            const now = Date.now();

            if (controlCooldown.has(interaction.user.id)) {
                const expirationTime = controlCooldown.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;

                    return await interaction.reply({ content: `This interaction is on cooldown for another ${timeLeft} seconds.`, ephemeral: true });
                }
            }

            if (!controlCooldown.has(interaction.user.id)) controlCooldown.set(interaction.user.id, now);

            setTimeout(() => controlCooldown.delete(interaction.user.id), cooldownAmount);

            if (client.inUse) {
                if (client.cfg.Settings.QueueCommands) {
                    client.queue.push({ Interaction: interaction, Command: option });
                    return await interaction.reply({ content: 'Interaction has been queued.', ephemeral: true });
                }

                return await interaction.reply({ content: 'The toy is already in use.', ephemeral: true });
            }

            await sendCommand(client, interaction, option);
        }
    }
}
