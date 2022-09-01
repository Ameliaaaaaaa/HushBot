const { SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: 'control',
    description: 'Choose interactions to send to the toy.',
    cooldown: 10,

    async execute(client, interaction) {
        const menu = new ActionRowBuilder({
            type: ComponentType.ActionRow
        });

        menu.addComponents([new SelectMenuBuilder().setCustomId('control').setMaxValues(1).setMinValues(1).setPlaceholder('Nothing Selected')]);

        for (let option of Object.keys(client.cfg.Options)) {
            menu.components[0].options.push(new SelectMenuOptionBuilder({
                label: option,
                value: option,
                description: `${client.cfg.Options[option].Description}`
            }));
        }

        await interaction.reply({ content: 'Choose an option from the menu below.', components: [menu], ephemeral: true });
    }
}
