const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'control',
    description: 'Choose interactions to send to the toy.',
    cooldown: 10,

    async execute(client, interaction) {
        const menu = new MessageActionRow();

        menu.addComponents(new MessageSelectMenu().setMinValues(1).setMaxValues(1).setPlaceholder('Nothing Selected').setCustomId('control'));

        for (let option of Object.keys(client.cfg.Options)) {
            menu.components[0].options.push({ label: option, value: option, description: `${client.cfg.Options[option].Description}` });
        }

        await interaction.reply({ content: 'Choose an option from the menu below.', components: [menu], ephemeral: true });
    }
}
