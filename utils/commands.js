const axios = require('axios');

async function sendCommand(client, interaction, option) {
    if (option) {
        let logString = option.Command;

        let postData = {
            token: client.cfg.Lovense.Token,
            uid: client.cfg.Lovense.UID,
            command: option.Command,
            timeSec: option.Time,
            apiVer: 1
        };

        if (option.Action) {
            postData.action = option.Action;
            logString = logString + ' ' + option.Action;
        }

        if (option.Name) {
            postData.name = option.Name;
            logString = logString + ' ' + option.Name;
        }

        logString = ' ' +  logString + ' for ' + option.Time + ' seconds';

        axios.post('https://api.lovense.com/api/lan/v2/command', postData).then(async res => {
            if (!client.cfg.Settings.QueueCommands) await interaction.reply({ content: 'Command sent.', ephemeral: true });

            console.log(`[Bot] ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) used the interaction${logString}.`);

            client.inUse = true;

            setTimeout(() => client.inUse = false, option.Time * 1000);
        }).catch(async err => {
            if (!client.cfg.Settings.QueueCommands) await interaction.reply({ content: 'An error occurred running that interaction.', ephemeral: true });

            console.log(err);
        });
    }
}

module.exports = { sendCommand };
