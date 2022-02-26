const { Collection } = require('discord.js');
const { readdirSync } = require('fs');

let slashCommands = [];

function loadCommands(client) {
    client.commands = new Collection();

    readdirSync('./bot/commands').forEach(command => {
        if (command.endsWith('.js')) {
            const cmd = require(`../commands/${command}`);

            client.commands.set(cmd.name, cmd);

            let cmdData = {
                name: cmd.name,
                description: cmd.description,
                options: []
            };

            slashCommands.push(cmdData);
        }
    });
}

async function registerSlash(client) {
    await client.guilds.cache.get(client.cfg.Discord.Server)?.commands.set(slashCommands).then(result => {
        console.log('[Bot] Slash Commands Registered.');
    });
}

module.exports = { loadCommands, registerSlash };